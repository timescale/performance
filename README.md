# Timescale Performance Series

Hello, I'm James, a Developer Advocate at Timescale. Recently, I’ve been diving into performance topics, exploring the types of content I enjoy both reading and creating.

This series is designed to highlight specific performance concepts in Timescale, TimescaleDB, and Postgres through detailed data visualizations. Expect no marketing fluff or unrealistic benchmarks, just clear, data-driven explorations of performance topics I find valuable and relevant.

Each article's directory contains:
- A link to the article
- Steps for reproducing the benchmarks
- A link to a PopSQL dashboard for interactive data exploration 

## Published Articles

## Coming Soon
1. Postgres DISTINCT: TimescaleDB's Skip Scan Under Load
2. Optimizing INSERT: Comparing Different INSERT Methods
3. Neon vs. Time-Series Data
4. Time-Series Ingestion Across Postgres DBaaS Providers
5. Wide Table vs. Narrow Table Showdown

## Performance Testing with Grafana k6

Most performance testing in this series will utilize [Grafana k6](https://k6.io/) ([GitHub](https://github.com/grafana/k6)),  "an extensible load-testing tool built for Developer happiness". 

### Extensions
I rely on the following extensions:
- [xk6-sql](https://github.com/grafana/xk6-sql) for SQL database load testing
- [xk6-output-timescaledb](https://github.com/grafana/xk6-output-timescaledb) for sending test metrics to TimescaleDB

If you have Go installed, you can compile and install `k6` with these extensions using the following commands:

```bash
go install go.k6.io/xk6/cmd/xk6@latest
xk6 build latest \
  --with github.com/grafana/xk6-sql \
  --with github.com/grafana/xk6-output-timescaledb

You will now have a new `k6` binary in your current directory with the extensions compiled in.

