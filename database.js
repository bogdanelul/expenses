const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS income (amount REAL)');
    db.run('CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY, amount REAL, category TEXT, date TEXT)');
});

const addExpense = ({ amount, category, date }) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO expenses (amount, category, date) VALUES (?, ?, ?)');
        stmt.run(amount, category, date, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
        stmt.finalize();
    });
};

const getExpenses = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM expenses', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const setIncome = (income) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM income');
        const stmt = db.prepare('INSERT INTO income (amount) VALUES (?)');
        stmt.run(income, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
        stmt.finalize();
    });
};

const getIncome = () => {
    return new Promise((resolve, reject) => {
        db.get('SELECT amount FROM income', [], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row ? row.amount : 0);
            }
        });
    });
};

const resetData = () => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM expenses');
        db.run('DELETE FROM income', [], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

module.exports = {
    addExpense,
    getExpenses,
    setIncome,
    getIncome,
    resetData
};
