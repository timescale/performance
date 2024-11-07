# TimescaleDB SkipScan Benchmark

This directory contains resources for running a benchmark on TimescaleDB's **Skip Scan** feature. This benchmark tests the performance benefits of Skip Scan for `SELECT DISTINCT` queries, simulating ingest at the same time as query.

For a deeper dive into the importance of Skip Scan and the benchmark results, please refer to the blog post: [Postgres DISTINCT: TimescaleDB’s Skip Scan Under Load](BLOG_LINK_HERE).

## Prerequisites

To run this benchmark, you’ll need `k6` with the necessary extensions. Follow the installation steps in the main README: [Timescale Performance Series README](../README.md).

## Benchmark Overview

The benchmark is inteded to compare the performance of two identical Postgres instances, one with with TimescaleDB SkipScan enabled and one with standard Postgres behavior (the TimescaleDB extension is loaded in both cases). The query focuses on retrieving the latest reading for each unique sensor from a table simulating high-ingest sensor data.

The companion blog used two Timescale Cloud instance with 4CPU and 16GB memory.

### What This Benchmark Runs
k6 is used to run the following in parallel:

- **Data Ingest Rate**: Simulates a continuous stream of sensor data at a high rate (200K rows per second).
- **Query Load**: Executes repeated `SELECT DISTINCT ON (sensor_id)` queries to mimic real-time dashboard needs.

### Benchmark Settings

All settings and SQL setup is encapsulated in the `skipscan.js` file. 

| Setting                     | Value                    | Description                                      |
|-----------------------------|--------------------------|--------------------------------------------------|
| **Ingest Rate**             | 200,000 rows/second      | Simulated rate of incoming sensor data           |
| **Query Rate**              | 10 queries/second        | `SELECT DISTINCT` queries to retrieve latest data|
| **Test Duration**           | 20 minutes               | Total runtime for the test                       |


## Running the Benchmark

To execute the benchmark, use the following command (make sure you're running k6 with the `xk6-sql` extension compiled in):

```bash
export CONNECTION_STRING="postgres://database_to_test"
k6 run setup.js
```

This command will begin the test, simulating both data ingest and query load based on the settings detailed below.

## Benchmark results

k6 will output general statistics that unfortunatley combine the ingest and query stats. You can see a summary of our findings in the blog above, or you can run k6 with the `-o timescaledb:postgres://your_postgres_url` to send raw data to a TimescaleDB instance.

If you'd perfer to just see the data from our run presented on a dashboard you can checkout our interactive PopSQL dashboard.


