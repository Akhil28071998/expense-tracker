export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getTotalExpenses = (expenses) => {
  return expenses.reduce((total, expense) => total + Number(expense.amount), 0);
};

export const getTotalExpensesByCategory = (expenses) => {
  const categories = {
    food: 0,
    transport: 0,
    entertainment: 0,
    shopping: 0,
    utilities: 0,
    other: 0,
    health: 0,
  };

  expenses.forEach((expense) => {
    if (categories.hasOwnProperty(expense.category)) {
      categories[expense.category] += Number(expense.amount);
    } else {
      categories.other += Number(expense.amount);
    }
  });

  return categories;
};

export const getChartData = (expenses) => {
  const totalByCategory = getTotalExpensesByCategory(expenses);

  return Object.entries(totalByCategory)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
};

export const getCategoryTextColor = (category) => {
  const colors = {
    food: "#FF6384",
    transport: "#36A2EB",
    entertainment: "#FFCE56",
    shopping: "#8E44AD",
    utilities: "#00C49F",
    health: "#E67E22",
    other: "#95A5A6",
  };

  return colors[category] || "#000000";
};

export const getMonthName = (date) => {
  return new Date(date).toLocaleString("default", { month: "long" });
};

export const getExpensesByMonth = (expenses, numMonths = 6) => {
  const now = new Date();
  const result = {};

  for (let i = 0; i < numMonths; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthYear = `${getMonthName(d)} ${d.getFullYear()}`;
    result[monthYear] = 0;
  }

  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.date);
    const monthYear = `${getMonthName(
      expenseDate
    )} ${expenseDate.getFullYear()}`;

    if (result[monthYear] === undefined) {
      result[monthYear] = 0;
    }

    result[monthYear] += Number(expense.amount);
  });

  return result;
};
