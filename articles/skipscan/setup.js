import sql from 'k6/x/sql';
import driver from "k6/x/sql/driver/postgres";
import faker from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js';
import {
    uuidv4
} from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

// Select the correct DB connection string based on the environment variable
const db = sql.open(driver, __ENV.CONNECTION_STRING);
const runId = __ENV.RUN_ID;
const runDuration = '20m';

const sensors = Array.from({
    length: 1000
}, (_, i) => `sensor-${i + 1}`);
const startTime = new Date();


export const options = {
    tags: {
        runid: runId
    },
    scenarios: {
        ingest: {
            executor: 'constant-arrival-rate',
            exec: "ingest",
            duration: runDuration,
            preAllocatedVUs: 1, // Preallocate 1 virtual user
            maxVUs: 10, // Limit to 10 virtual users
            rate: 200, // 200 iterations per second (each inserting 1000 records)
            timeUnit: '1s', // Time unit to measure the rate
        },
        query_skipscan: {
            executor: 'constant-arrival-rate',
            exec: 'skipscan',
            duration: runDuration,
            preAllocatedVUs: 1, // Preallocate 1 virtual user
            maxVUs: 5, // Limit to 5 virtual users
            rate: 10, // 10 iterations per second
            timeUnit: '1s', // Time unit to measure the rate
        },
    },
};

//use the exec property to run different scenarios for different functions
export function ingest() {
    let date = Math.round(new Date().getTime() / 1000);
    let keys = Array(1000).fill(faker.random.arrayElement(sensors));
    let dates = Array.from({
        length: 1000
    }, () => date);
    let values = Array.from({
        length: 1000
    }, () => Math.random());


    // Modify the query to pass the arrays correctly
    db.exec(
        "INSERT INTO sensors (sensorid, ts, value) SELECT * FROM unnest($1::text[], ARRAY(SELECT to_timestamp(epoch) FROM unnest($2::int[]) AS epoch), $3::real[]);",
        `{${keys.join(',')}}`, // PostgreSQL array format
        `{${dates.join(',')}}`, // PostgreSQL array format
        `{${values.join(',')}}`
    );

}

export function skipscan() {
    let results = db.query("SELECT distinct ON (sensorid) * FROM sensors ORDER BY sensorid, ts DESC");
}


export function setup() {
    db.exec('create table if not exists sensors(ts timestamptz, sensorid text, value real)');
    db.exec('create index if not exists sensor_index on sensors (sensorid, ts DESC);')
    db.exec('TRUNCATE sensors;');
}

export function teardown() {
    db.close();
}
