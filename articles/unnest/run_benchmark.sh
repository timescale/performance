psql -q -c "CREATE TABLE IF NOT EXISTS sensors ( sensorid TEXT, ts TIMESTAMPTZ, value FLOAT8);" $CONNECTION_STRING 
psql -q -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;" $CONNECTION_STRING

reset_run () {
    psql -q -c "TRUNCATE sensors" $CONNECTION_STRING
    psql -q -c "SELECT pg_stat_statements_reset();" $CONNECTION_STRING >/dev/null
}

report_run () {
    psql -c "SELECT '$1' run, rows as rows_inserted, total_plan_time, total_exec_time, total_plan_time + total_exec_time AS total_time FROM pg_stat_statements where query ~'INSERT INTO sensors' order by 3 desc" $CONNECTION_STRING
   
}

reset_run
pgbench -n --file sensors_insert_unnest_1000.sql  -t 1000  $CONNECTION_STRING  > /dev/null
echo
report_run "unnest_1000"

reset_run
pgbench -n --file sensors_insert_values_1000.sql  -t 1000  $CONNECTION_STRING  > /dev/null
echo
report_run "values_1000"

reset_run
pgbench -n --file sensors_insert_unnest_5000.sql  -t 200   $CONNECTION_STRING  > /dev/null
echo
report_run "unnest_5000"

reset_run
pgbench -n --file sensors_insert_values_5000.sql  -t 200   $CONNECTION_STRING  > /dev/null
echo
report_run "values_5000"

reset_run
pgbench -n --file sensors_insert_unnest_10000.sql -t 100   $CONNECTION_STRING  > /dev/null
echo
report_run "unnest_10000"

reset_run
pgbench -n --file sensors_insert_values_10000.sql -t 100   $CONNECTION_STRING  > /dev/null
echo
report_run "values_10000"


