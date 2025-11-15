import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 50 },   // Stay at 50 users
    { duration: '30s', target: 100 }, // Spike to 100 users
    { duration: '1m', target: 100 },  // Stay at peak
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
    errors: ['rate<0.1'],              // Error rate should be less than 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3002';

// Test data
const customers = ['cust-1', 'cust-2', 'cust-3', 'cust-4', 'cust-5'];
const vendors = ['vend-1', 'vend-2', 'vend-3'];

export default function () {
  const customerId = customers[Math.floor(Math.random() * customers.length)];
  const vendorId = vendors[Math.floor(Math.random() * vendors.length)];

  // Create order
  const createOrderPayload = JSON.stringify({
    customerId,
    vendorId,
    items: [
      {
        menuItemId: 'item-1',
        name: 'Test Item',
        quantity: Math.floor(Math.random() * 3) + 1,
        price: Math.random() * 20 + 5,
      },
    ],
    deliveryAddress: {
      street: '123 Test St',
      city: 'Test City',
      zipCode: '12345',
      latitude: 40.7128,
      longitude: -74.0060,
    },
    paymentMethod: 'card',
  });

  const createRes = http.post(`${BASE_URL}/api/v1/orders`, createOrderPayload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer test-token-${customerId}`,
    },
  });

  check(createRes, {
    'order created successfully': (r) => r.status === 201,
    'response has order ID': (r) => JSON.parse(r.body).data?.id !== undefined,
  }) || errorRate.add(1);

  if (createRes.status === 201) {
    const orderId = JSON.parse(createRes.body).data.id;

    // Get order details
    const getRes = http.get(`${BASE_URL}/api/v1/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer test-token-${customerId}`,
      },
    });

    check(getRes, {
      'order retrieved successfully': (r) => r.status === 200,
      'order data is valid': (r) => JSON.parse(r.body).data?.id === orderId,
    }) || errorRate.add(1);
  }

  sleep(1);
}

export function handleSummary(data) {
  return {
    'load-test-results/order-service-summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  const indent = options.indent || '';
  let summary = '\n';

  summary += `${indent}✓ checks.........................: ${data.metrics.checks.passes}/${data.metrics.checks.fails + data.metrics.checks.passes}\n`;
  summary += `${indent}✓ http_req_duration..............: avg=${data.metrics.http_req_duration.values.avg.toFixed(2)}ms p(95)=${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n`;
  summary += `${indent}✓ http_req_failed................: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%\n`;
  summary += `${indent}✓ http_reqs......................: ${data.metrics.http_reqs.values.count}\n`;
  summary += `${indent}✓ vus............................: min=${data.metrics.vus.values.min} max=${data.metrics.vus.values.max}\n`;

  return summary;
}
