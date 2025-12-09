const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost',
  port: 8811,
  user: 'root',
  password: 'thienthan',
  database: 'test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const batchSize = 1000;
const totalRecords = 10000;
let currentId = 1;

const insertData = async () => {
  const value = [];
  for (let i = 0; i < batchSize && currentId <= totalRecords; i++) {
    const name = `Name_${currentId}`;
    const age = currentId;
    const address = `address_${currentId}`;
    value.push([currentId, name, age, address]);
    currentId++;
  }

  if (value.length === 0) {
    await pool.end();
    console.log('Database connection closed.');
    return;
  }

  const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;
  const [results] = await pool.query(sql, [value]);
  console.log(`Inserted ${results.affectedRows} records.`);

  await insertData(); // batch tiếp theo
};

insertData().catch(err => {
  console.error('Error during data insertion:', err);
});
