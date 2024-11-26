# PostgreSQL Batch Ingest Benchmark

This README contains the steps to running a batch ingest benchmark to compare PostgreSQL INSERT and COPY methods.

For a deeper dive into PoIngest batch ingest  and the benchmark results, please refer to the blog post: [Benchmarking PostgreSQL Batch Ingest](www.timescale.com/blog/benchmarking-postgresql-batch-ingest/)

## Prerequisites

To run this benchmark, you’ll need to the compile the [pgingester](https://github.com/jamessewell/pgingester) tool I made for this post, and a PostgreSQL database.

## Benchmark Overview

The benchmark compares the performance of the following ingest methods with various batch sizes:

- Batch insert (parameterized)
- Prepared batch insert
- UNNEST insert (parameterized)
- Prepared UNNEST insert
- COPY
- Binary COPY

The companion blog used a Timescale Cloud instance with 8CPU and 32GB memory, although the tool only uses a single connection so even a 1CPU instance will be fine.

### Setup
You can compile `pgingester` with the following commands (if you can Rust installed you can skip the first step).

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
git clone https://github.com/jamessewell/pgingester
cd pgingester
cargo build --release
```

## Running the benchmark

To execute the benchmark, use the following commands:

```bash
export CONNECTION_STRING="postgres://database_to_test"
unzip power_generation_1m.csv.zip
pgingester --all --batch-sizes 1000,5000,10000,100000,1000000
```

## Benchmark results

The command will output the relevant metrics after running. You can see a summary of our findings in the [blog](www.timescale.com/blog/benchmarking-postgresql-batch-ingest/).

