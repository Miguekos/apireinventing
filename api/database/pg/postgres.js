var Pool = require('pg-pool')

// by default the pool uses the same
// configuration as whatever `pg` version you have installed
// var pool = new Pool()

// you can pass properties to the pool
// these properties are passed unchanged to both the node-postgres Client constructor
// and the node-pool (https://github.com/coopernurse/node-pool) constructor
// allowing you to fully configure the behavior of both
const conex = {
    user: process.env.USER_DATABASE,
    host: process.env.IP_DATABASE,
    database: process.env.DATABASE,
    password: process.env.PASS_DATABASE,
    port: 5432,
    ssl: false,
    max: 20, // set pool max size to 20
    idleTimeoutMillis: 3000, // close idle clients after 1 second
    connectionTimeoutMillis: 3000, // return an error after 1 second if connection could not be established
    maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
}

const storePostgresql = async (query) => {

    var client = new Pool(conex)
    client.connect()
    return client.query(query)
        .then(response => {
            // console.log(response.rows)
            // client.end()
            client.end()
            return response.rows
        })
        .catch(err => {
            console.error("err", err);
            client.end()
            return {
                ...err,
                codRes: 99
            };
        })


}

// const conexionPostgres = {
//     user: process.env.USER_DATABASE,
//     host: process.env.IP_DATABASE,
//     database: process.env.DATABASE,
//     password: process.env.PASS_DATABASE,
//     port: 5432
// }

// const storePostgresql = async (query) => {
//     const client = new pg.Client(conexionPostgres)
//     // console.log(client);
//     client.connect();
//     return client.query(query)
//         .then(response => {
//             // console.log(response.rows)
//             client.end()
//             return response.rows
//         })
//         .catch(err => {
//             console.error("err", err);
//             client.end()
//             return {
//                 ...err,
//                 codRes: 99
//             };
//         })
// }

module.exports = {
    storePostgresql
}
