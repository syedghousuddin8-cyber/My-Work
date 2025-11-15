# Load Testing with k6

Comprehensive load testing suite for the multi-vendor delivery platform.

## Prerequisites

Install k6:
```bash
# macOS
brew install k6

# Ubuntu/Debian
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Docker
docker pull grafana/k6
```

## Test Scenarios

### 1. Order Service Load Test
Tests order creation and retrieval under load.

**Run:**
```bash
k6 run order-service-test.js
```

**Stages:**
- Ramp up to 20 users (30s)
- 50 concurrent users (1m)
- Spike to 100 users (30s)
- Sustain 100 users (1m)
- Ramp down (30s)

**Thresholds:**
- 95% of requests < 500ms
- Error rate < 1%

### 2. Vendor Search Load Test
Tests vendor search and Elasticsearch performance.

**Run:**
```bash
k6 run vendor-search-test.js
```

**Stages:**
- Normal load: 50 users (1m)
- Peak load: 200 users (30s)
- Sustained peak: 200 users (1m)

**Thresholds:**
- 95% of requests < 200ms
- Error rate < 1%

### 3. End-to-End Flow Test
Simulates complete customer journey from search to payment.

**Run:**
```bash
k6 run end-to-end-flow-test.js
```

**Flow:**
1. Search vendors
2. Get vendor menu
3. Get pricing estimate
4. Create order
5. Process payment
6. Track order

**Thresholds:**
- Order creation: p(95) < 2s
- Complete checkout: p(95) < 3s

### 4. Stress Test
Finds the breaking point of the system.

**Run:**
```bash
k6 run stress-test.js
```

**Stages:**
- Progressive load increase up to 400 concurrent users
- Tests system limits and failure modes

## Configuration

Set base URL via environment variable:
```bash
BASE_URL=https://api.delivery-platform.com k6 run order-service-test.js
```

## Results

Test results are saved to `load-test-results/` directory:
- JSON summary files
- Performance metrics
- Error rates

## Interpreting Results

### Key Metrics

1. **http_req_duration**: Request response time
   - avg: Average response time
   - p(95): 95th percentile (95% of requests faster than this)
   - p(99): 99th percentile

2. **http_req_failed**: Percentage of failed requests
   - Should be < 1% under normal load

3. **vus**: Virtual users (concurrent users)
   - Shows current load level

4. **http_reqs**: Total number of requests made

### Success Criteria

**Order Service:**
- ✅ 95% of requests < 500ms
- ✅ Error rate < 1%
- ✅ Handle 100 concurrent users

**Vendor Search:**
- ✅ 95% of requests < 200ms
- ✅ Error rate < 1%
- ✅ Handle 200 concurrent users

**End-to-End:**
- ✅ Complete flow < 3s (p95)
- ✅ Error rate < 1%
- ✅ Handle 30 concurrent journeys

**Stress Test:**
- Find breaking point
- Identify bottlenecks
- Measure degradation pattern

## Advanced Usage

### Cloud Execution with k6 Cloud

```bash
k6 cloud order-service-test.js
```

### Custom Thresholds

Edit the `options.thresholds` object in each test file:

```javascript
export const options = {
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.95'],
  },
};
```

### Output to InfluxDB

```bash
k6 run --out influxdb=http://localhost:8086/k6 order-service-test.js
```

### Output to Prometheus

```bash
k6 run --out experimental-prometheus-rw order-service-test.js
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run k6 Load Tests
  run: |
    k6 run --quiet --no-color testing/load-tests/order-service-test.js
    k6 run --quiet --no-color testing/load-tests/vendor-search-test.js
```

### Performance Gates

Fail pipeline if thresholds not met:

```bash
k6 run --quiet --no-color order-service-test.js || exit 1
```

## Best Practices

1. **Start Small**: Begin with low load and gradually increase
2. **Monitor Resources**: Watch CPU, memory, database connections
3. **Test Incrementally**: Test each service individually first
4. **Baseline Performance**: Establish baseline before optimization
5. **Regular Testing**: Run load tests on every major release
6. **Real Data**: Use production-like test data
7. **Network Conditions**: Simulate various network conditions

## Troubleshooting

### High Error Rates

- Check service logs
- Verify database connections
- Check Redis availability
- Review rate limits

### Slow Response Times

- Enable query logging
- Check database indexes
- Review caching strategy
- Check for N+1 queries

### Out of Memory

- Increase pod resources
- Review memory leaks
- Check connection pooling

## Next Steps

1. Set up continuous load testing in CI/CD
2. Integrate with Grafana for visualization
3. Create custom scenarios for specific use cases
4. Implement performance regression testing
