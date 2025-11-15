import http from 'k6/http';
import { check, sleep } from 'k6';

// Stress test - find breaking point
export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '5m', target: 200 },   // Continue to 200 users
    { duration: '2m', target: 300 },   // Push to 300 users
    { duration: '5m', target: 300 },   // Stay at 300
    { duration: '2m', target: 400 },   // Push harder
    { duration: '5m', target: 400 },   // Sustain
    { duration: '5m', target: 0 },     // Gradual cooldown
  ],
  thresholds: {
    http_req_duration: ['p(99)<5000'], // 99% under 5s (relaxed for stress test)
    http_req_failed: ['rate<0.05'],    // Allow 5% error rate
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3002';

export default function () {
  const endpoints = [
    '/api/v1/orders',
    '/api/v1/orders/recent',
    '/health',
  ];

  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];

  const res = http.get(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: 'Bearer test-token',
    },
  });

  check(res, {
    'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'response time < 5s': (r) => r.timings.duration < 5000,
  });

  sleep(0.5); // Minimal sleep to maximize load
}

export function handleSummary(data) {
  console.log('=== Stress Test Results ===');
  console.log(`Peak VUs: ${data.metrics.vus.values.max}`);
  console.log(`Total Requests: ${data.metrics.http_reqs.values.count}`);
  console.log(`Failed Requests: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%`);
  console.log(`Avg Response Time: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms`);
  console.log(`P95 Response Time: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms`);
  console.log(`P99 Response Time: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms`);

  return {
    'load-test-results/stress-test-summary.json': JSON.stringify(data),
  };
}
