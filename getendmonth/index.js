const functions = require('@google-cloud/functions-framework');
const { Pool } = require('pg');

function getDays(year, month) {
  return new Date(year, month, 0).getDate();
};

functions.http('getendmonth', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const db = new Pool({
    user: 'postgres',
    host: '/cloudsql/expensetracking-405714:us-central1:admin',
    database: 'ExpenseTracking',
    password: 'admin',
    port: 5432
  });

  const currentDate = new Date();

  const query = `
    SELECT SUM(value) FROM Expense
    WHERE extract(month FROM date) = ${currentDate.getMonth() + 1};
  `;
  try {
    const client = await db.connect();
    const result = await client.query(query);
    client.release();

    const expectedTotalExpense = (getDays(currentDate.getFullYear(), currentDate.getMonth() + 1)/currentDate.getDate())*result.rows[0].sum;

    res.status(200).json(expectedTotalExpense);
  } catch (err) {
    res.status(500).json(err);
  }
});