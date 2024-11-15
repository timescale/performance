# PostgreSQL INSERT .. UNNEST benchmark

This directory contains resources for running a benchmark to compare PostgreSQL `INSERT ... VALUES` with `INSERT ... UNNEST` for batch ingestion. It tests the performance at the database level using `pg_stat_statements`.

For a deeper dive into `INSERT .. UNNEST`  and the benchmark results, please refer to the blog post: [Boosting Postgres INSERT Performance by 50% with UNNEST](www.timescale.com/blog/boosting-postgres-insert-performance/).

## Prerequisites

To run this benchmark, you’ll need `pgbench` and a PostgreSQL database with the `pg_stat_statements` extension installed, created, and `pg_stat_statements.track_planning = true` set (all this is automatic on Timescale Cloud). 

## Benchmark Overview

The benchmark compares the performance of these two INSERT variants (which do the same thing with different inputs):
```
INSERT INTO sensors (sensorid, ts, value)
VALUES 
  ($1, $2, $3), 
  ($4, $5, $6), 
   ..., 
  ($2998, $2999, $3000);
```

and

```
INSERT INTO sensors (ts, sensorid, value) 
  SELECT * 
  FROM unnest(
    $1::timestamptz[], 
    $2::text[], 
    $3::float8[]
)
```

The companion blog used a Timescale Cloud instance with 4CPU and 16GB memory.

### What This Benchmark Runs
pgbench is used to run:

- 1 million rows inserted with `INSERT .. VALUES` and 1000 row batches
- 1 million rows inserted with `INSERT .. VALUES` and 5000 row batches
- 1 million rows inserted with `INSERT .. VALUES` and 10000 row batches
- 1 million rows inserted with `INSERT .. UNNEST` and 1000 row batches
- 1 million rows inserted with `INSERT .. UNNEST` and 5000 row batches
- 1 million rows inserted with `INSERT .. UNNEST` and 10000 row batches


## Running the benchmark

To execute the benchmark, use the following commands:

```bash
export CONNECTION_STRING="postgres://database_to_test"
bash run_benchmark.sh
```

## Benchmark results

The script will output the relevant metrics after running. You can see a summary of our findings in the [blog](www.timescale.com/blog/boosting-postgres-insert-performance/) or the [PopSQL dashboard](https://popsql.com/dashboards/UEYrapIp/timescaleperformance-insert-unnest?access_token=8eef947d0d2cc5c6a0f78cea763607a4).

