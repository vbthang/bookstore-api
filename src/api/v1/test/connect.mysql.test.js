const mysql = require('mysql2')

const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 8811,
    user: 'root',
    password: 'thangvb',
    database: 'test'
})
// 2:05.216 -> insert 10_000_000 
const batchSize = 100000 // adjust batch size
const totalSize = 10000000 // adjust total size

let currentId = 1
console.log(`START...`)
console.time('---TIMER---')
const insertBatch = async () => {
    const values = []
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`
        const age = currentId
        const address = `address-${currentId}`
        values.push([currentId, name, age, address])
        currentId++
    }

    if(!values.length) {
        console.timeEnd(`---TIMER---`)
        pool.end(err => {
            if(err) {
                console.error(`error ::`, err)
            } else {
                console.log(`Connection pool closed successfully`);
            }
        })
        return
    }
    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`

    pool.query(sql, [values], async function (err, results) {
        if(err) throw err
        console.log(`Inserted ${results.affectedRows} records`)
        await insertBatch()
    })
}

insertBatch().catch(console.error)



