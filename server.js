const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/expenses', async (req, res) => {
    const expenses = await database.getExpenses();
    res.json(expenses);
});

app.post('/api/expenses', async (req, res) => {
    const { amount, category, date } = req.body;
    await database.addExpense({ amount, category, date });
    res.sendStatus(201);
});

app.get('/api/income', async (req, res) => {
    const income = await database.getIncome();
    res.json(income);
});

app.post('/api/income', async (req, res) => {
    const { income } = req.body;
    await database.setIncome(income);
    res.sendStatus(201);
});

app.post('/api/reset', async (req, res) => {
    await database.resetData();
    res.sendStatus(201);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
