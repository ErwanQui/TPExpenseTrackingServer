const functions = require('@google-cloud/functions-framework');
const { Pool } = require('pg');

functions.http('getcategoriestotal', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const db = new Pool({
    user: 'postgres',
    host: '/cloudsql/expensetracking-405714:us-central1:admin',
    database: 'ExpenseTracking',
    password: 'admin',
    port: 5432
  });

  const query = `
    SELECT SUM(value), category FROM Expense
    GROUP BY category;
  `;

  try {
    const client = await db.connect();
    const result = await client.query(query);
    client.release();

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});