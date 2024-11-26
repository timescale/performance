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

 Results for import of 1000000 records (single connection)
 Method                 | Batch Size | Transaction | Duration | Rows/sec | Relative Speed 
 Insert VALUES          | 1000       | No          | 12.52s   | 79882    | x19.10 
 Copy                   | 1000       | No          | 7.49s    | 133524   | x11.43 
 Binary Copy            | 1000       | No          | 6.86s    | 145682   | x10.47 
 UNNEST insert          | 1000       | No          | 6.04s    | 165605   | x9.21 
 Prepared Insert VALUES | 1000       | No          | 5.60s    | 178425   | x8.55 
 Prepared Insert UNNEST | 1000000    | No          | 5.42s    | 184634   | x8.26 
 UNNEST insert          | 1000000    | No          | 5.41s    | 184677   | x8.26 
 Prepared Insert UNNEST | 1000       | No          | 4.82s    | 207448   | x7.35 
 Copy                   | 5000       | No          | 3.87s    | 258599   | x5.90 
 UNNEST insert          | 5000       | No          | 3.11s    | 321803   | x4.74 
 Copy                   | 10000      | No          | 3.01s    | 331715   | x4.60 
 Prepared Insert UNNEST | 5000       | No          | 2.77s    | 360511   | x4.23 
 UNNEST insert          | 10000      | No          | 2.63s    | 380601   | x4.01 
 Prepared Insert UNNEST | 10000      | No          | 2.61s    | 383070   | x3.98 
 UNNEST insert          | 100000     | No          | 2.43s    | 410692   | x3.71 
 Prepared Insert UNNEST | 100000     | No          | 2.38s    | 420593   | x3.63 
 Copy                   | 100000     | No          | 2.37s    | 421365   | x3.62 
 Copy                   | 1000000    | No          | 2.35s    | 424987   | x3.59 
 Binary Copy            | 5000       | No          | 2.23s    | 447968   | x3.41 
 Binary Copy            | 10000      | No          | 1.44s    | 696128   | x2.19 
 Binary Copy            | 100000     | No          | 832.52ms | 1201175  | x1.27 
 Binary Copy            | 1000000    | No          | 655.52ms | 1525514  | x1.00 
```

## Benchmark results

The command will output the relevant metrics after running. You can see a summary of our findings in the [blog](www.timescale.com/blog/benchmarking-postgresql-batch-ingest/).

