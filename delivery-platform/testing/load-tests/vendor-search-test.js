import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Normal load
    { duration: '30s', target: 200 }, // Peak load
    { duration: '1m', target: 200 },  // Sustained peak
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // Search should be fast
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3003';

const searchTerms = ['pizza', 'burger', 'sushi', 'mexican', 'italian', 'chinese'];
const categories = ['food', 'grocery', 'pharmacy'];

export default function () {
  // Random search query
  const query = searchTerms[Math.floor(Math.random() * searchTerms.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];

  // Search vendors
  const searchRes = http.get(
    `${BASE_URL}/api/v1/vendors/search?q=${query}&category=${category}&lat=40.7128&lng=-74.0060&radius=10`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  check(searchRes, {
    'search completed': (r) => r.status === 200,
    'has results': (r) => JSON.parse(r.body).data?.vendors !== undefined,
    'response time OK': (r) => r.timings.duration < 200,
  }) || errorRate.add(1);

  // Get random vendor details if search succeeded
  if (searchRes.status === 200) {
    const vendors = JSON.parse(searchRes.body).data.vendors;

    if (vendors && vendors.length > 0) {
      const randomVendor = vendors[Math.floor(Math.random() * vendors.length)];

      const detailsRes = http.get(`${BASE_URL}/api/v1/vendors/${randomVendor.id}`);

      check(detailsRes, {
        'vendor details loaded': (r) => r.status === 200,
        'has menu': (r) => JSON.parse(r.body).data?.menu !== undefined,
      }) || errorRate.add(1);
    }
  }

  sleep(Math.random() * 2 + 1); // Random sleep 1-3 seconds
}
