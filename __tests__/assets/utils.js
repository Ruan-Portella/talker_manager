const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const { cwd } = process;

const info = {
  host: process.env.MYSQL_HOSTNAME || 'localhost',
  port: process.env.MYSQL_PORT || '3306',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'TalkerDB',
  multipleStatements: true,
};

const connect = () => mysql.createPool(info);

const runSql = async (sql) => {
  const db = connect();
  await db.query(sql);
  await db.end();
};

const resetDb = () => runSql(fs.readFileSync(path.resolve(cwd(), 'seed.sql'), 'utf8'));

const addTalker = () => runSql(`
  INSERT INTO
    talkers (id, name, age, talk_watched_at, talk_rate)
  VALUES
    (5, "Zendaya Maree", 17, '25/09/2020', 5);
`);

const removeTalkers = () => runSql(`
  TRUNCATE talkers;
`);

module.exports = {
  addTalker,
  resetDb,
  removeTalkers,
};
