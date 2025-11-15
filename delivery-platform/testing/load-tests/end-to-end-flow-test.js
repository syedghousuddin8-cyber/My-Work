import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const orderCreationTime = new Trend('order_creation_time');
const checkoutTime = new Trend('checkout_time');

export const options = {
  stages: [
    { duration: '2m', target: 30 },  // Gradual ramp-up
    { duration: '3m', target: 30 },  // Sustained load
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    'order_creation_time': ['p(95)<2000'],
    'checkout_time': ['p(95)<3000'],
    'http_req_failed': ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost';

export default function () {
  const userId = `user-${__VU}-${__ITER}`;

  group('Customer Journey', function () {
    // 1. Search for vendors
    group('Search Vendors', function () {
      const searchRes = http.get(
        `${BASE_URL}:3003/api/v1/vendors/search?q=pizza&lat=40.7128&lng=-74.0060&radius=5`
      );

      check(searchRes, {
        'vendor search successful': (r) => r.status === 200,
      }) || errorRate.add(1);

      if (searchRes.status !== 200) return;

      const vendors = JSON.parse(searchRes.body).data.vendors;
      if (!vendors || vendors.length === 0) return;

      const selectedVendor = vendors[0];

      // 2. Get vendor menu
      group('Get Vendor Menu', function () {
        const menuRes = http.get(
          `${BASE_URL}:3003/api/v1/vendors/${selectedVendor.id}/menu`
        );

        check(menuRes, {
          'menu loaded': (r) => r.status === 200,
        }) || errorRate.add(1);

        const menu = JSON.parse(menuRes.body).data;

        // 3. Get pricing estimate
        group('Get Pricing Estimate', function () {
          const pricingPayload = JSON.stringify({
            vendorId: selectedVendor.id,
            customerId: userId,
            distance: 2.5,
            orderValue: 25.50,
            latitude: 40.7128,
            longitude: -74.0060,
          });

          const pricingRes = http.post(
            `${BASE_URL}:3008/api/v1/pricing/estimate`,
            pricingPayload,
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );

          check(pricingRes, {
            'pricing calculated': (r) => r.status === 200,
          }) || errorRate.add(1);
        });

        // 4. Create order
        group('Create Order', function () {
          const startTime = Date.now();

          const orderPayload = JSON.stringify({
            customerId: userId,
            vendorId: selectedVendor.id,
            items: [
              {
                menuItemId: 'item-1',
                name: 'Pizza Margherita',
                quantity: 2,
                price: 12.99,
              },
            ],
            deliveryAddress: {
              street: '123 Main St',
              city: 'New York',
              zipCode: '10001',
              latitude: 40.7128,
              longitude: -74.0060,
            },
            paymentMethod: 'card',
          });

          const orderRes = http.post(
            `${BASE_URL}:3002/api/v1/orders`,
            orderPayload,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer test-token-${userId}`,
              },
            }
          );

          const orderTime = Date.now() - startTime;
          orderCreationTime.add(orderTime);

          const orderCreated = check(orderRes, {
            'order created': (r) => r.status === 201,
          });

          if (!orderCreated) {
            errorRate.add(1);
            return;
          }

          const order = JSON.parse(orderRes.body).data;

          // 5. Process payment
          group('Process Payment', function () {
            const checkoutStartTime = Date.now();

            const paymentPayload = JSON.stringify({
              orderId: order.id,
              paymentMethodId: 'pm_test_123',
              amount: order.total,
            });

            const paymentRes = http.post(
              `${BASE_URL}:3005/api/v1/payments/process`,
              paymentPayload,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer test-token-${userId}`,
                },
              }
            );

            const checkoutDuration = Date.now() - checkoutStartTime;
            checkoutTime.add(checkoutDuration);

            check(paymentRes, {
              'payment processed': (r) => r.status === 200,
            }) || errorRate.add(1);
          });

          // 6. Get order status
          group('Track Order', function () {
            const trackRes = http.get(
              `${BASE_URL}:3002/api/v1/orders/${order.id}`,
              {
                headers: {
                  Authorization: `Bearer test-token-${userId}`,
                },
              }
            );

            check(trackRes, {
              'order tracked': (r) => r.status === 200,
            }) || errorRate.add(1);
          });
        });
      });
    });
  });

  sleep(Math.random() * 3 + 2); // 2-5 seconds between iterations
}

export function handleSummary(data) {
  return {
    'load-test-results/end-to-end-summary.json': JSON.stringify(data),
  };
}
