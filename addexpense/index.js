const functions = require('@google-cloud/functions-framework');
const { Pool } = require('pg');

functions.http('addexpense', async (req, res) => {
  const { expense } = req.body

  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    const db = new Pool({
      user: 'postgres',
      host: '/cloudsql/expensetracking-405714:us-central1:admin',
      database: 'ExpenseTracking',
      password: 'admin',
      port: 5432
    });

    const currentDate = new Date(expense.date);

    const formattedDate = currentDate.toISOString().split('T')[0];

    const query = `
      INSERT INTO Expense (value, name, category, date
        ${expense.place_number !== undefined ? ', place_number' : ''}
        ${expense.place_address !== undefined ? ', place_address' : ''}
        ${expense.place_postal_code !== undefined ? ', place_postal_code' : ''}
        ${expense.city !== undefined ? ', city' : ''}
        ) 
      VALUES (${expense.value}, '${expense.name}', '${expense.category}', '${formattedDate}'
        ${expense.place_number !== undefined ? `, ${expense.place_number}` : ''}
        ${expense.place_address !== undefined ? `, '${expense.place_address}'` : ''}
        ${expense.place_postal_code !== undefined ? `, ${expense.place_postal_code}` : ''}
        ${expense.city !== undefined ? `, '${expense.city}'` : ''}
      );
    `;

    try {
      const client = await db.connect();
      await client.query(query);
      client.release();

      res.status(200).json('Table créée avec succès');
    } catch (err) {
      res.status(500).json(err);
    }
  }
});