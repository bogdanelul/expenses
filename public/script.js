async function setIncome() {
    const income = parseFloat(document.getElementById('income-input').value);
    await fetch('/api/income', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ income })
    });
    updateBalance();
}

async function addExpense() {
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;

    await fetch('/api/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, category, date })
    });
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-category').value = '';
    document.getElementById('expense-date').value = '';
    updateBalance();
    renderExpenses();
}

async function updateBalance() {
    const incomeResponse = await fetch('/api/income');
    const income = await incomeResponse.json();
    const expensesResponse = await fetch('/api/expenses');
    const expenses = await expensesResponse.json();
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    const balance = income - totalExpenses;
    document.getElementById('balance').textContent = balance.toFixed(2);
}

async function renderExpenses() {
    const response = await fetch('/api/expenses');
    const expenses = await response.json();
    const tbody = document.getElementById('expenses-table-body');
    tbody.innerHTML = '';

    expenses.forEach(expense => {
        const tr = document.createElement('tr');

        const tdDate = document.createElement('td');
        tdDate.textContent = expense.date;
        tr.appendChild(tdDate);

        const tdCategory = document.createElement('td');
        tdCategory.textContent = expense.category;
        tr.appendChild(tdCategory);

        const tdAmount = document.createElement('td');
        tdAmount.textContent = expense.amount.toFixed(2);
        tr.appendChild(tdAmount);

        tbody.appendChild(tr);
    });
}

async function resetData() {
    await fetch('/api/reset', {
        method: 'POST'
    });
    updateBalance();
    renderExpenses();
}

function sortExpenses(key) {
    expenses.sort((a, b) => {
        if (key === 'amount') {
            return a[key] - b[key];
        } else {
            return a[key].localeCompare(b[key]);
        }
    });
    renderExpenses();
}

document.addEventListener('DOMContentLoaded', () => {
    updateBalance();
    renderExpenses();
});
