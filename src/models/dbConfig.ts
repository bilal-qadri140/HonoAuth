import pg, { Client } from 'pg'
const { Pool,DatabaseError } = pg

const client = new Client({
    user: 'fantech',
    host: 'localhost',
    database: 'school',
    password: '123',
    port: 5432,
});

client.connect().then(() => {
    console.log('Connection successful');
}).catch((err) => {
    console.log('Error to connect', err);

})

export default client