import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FinanceContext } from "../context/FinanceContext";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./Dashboard.css";
import { formatCurrency } from "../utils/FinanceUtils";

const Dashboard = () => {
  const { user } = useUser();
  const { transactions } = useContext(FinanceContext);
  const navigate = useNavigate();

  // Display user name
  const firstName = user?.email
    ? user.email.split("@")[0]
    : user?.name
    ? user.name.split(" ")[0]
    : "Guest";

  // Separate transactions
  const incomeTransactions = transactions.filter((t) => t.type === "income");
  const expenseTransactions = transactions.filter((t) => t.type === "expense");
  const loanTransactions = transactions.filter((t) => t.type === "loan");

  // Totals
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );
  const totalLoan = loanTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Balance
  const balance = totalIncome + totalLoan - totalExpense;

  /* ---------- EXPENSE PIE CHART ---------- */
  const categories = [...new Set(expenseTransactions.map((e) => e.category))];
  const expenseColors = [
    "#FF6B6B", // Soft Red
    "#50A09B", // Teal
    "#FFD93D", // Yellow
    "#629bc7ff", // Dark Teal
    "#FF9F1C", // Orange
    "#6870b9ff", // Indigo
  ];
  const expenseChartData = {
    labels: categories,
    datasets: [
      {
        data: categories.map((cat) =>
          expenseTransactions
            .filter((e) => e.category === cat)
            .reduce((sum, e) => sum + e.amount, 0)
        ),
        backgroundColor: categories.map(
          (_, idx) => expenseColors[idx % expenseColors.length]
        ),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  /* ---------- INCOME PIE CHART ---------- */
  const incomeSources = [...new Set(incomeTransactions.map((i) => i.source))];
  const incomeColors = [
    "#27C3DC", // Cyan
    "#8EC141", // Lime Green
    "#F59E0B", // Amber
    "#8B5CF6", // Purple
    "#F43F5E", // Rose
    "#0EA5E9", // Light Blue
  ];
  const incomeChartData = {
    labels: incomeSources,
    datasets: [
      {
        data: incomeSources.map((src) =>
          incomeTransactions
            .filter((i) => i.source === src)
            .reduce((sum, i) => sum + i.amount, 0)
        ),
        backgroundColor: incomeSources.map(
          (_, idx) => incomeColors[idx % incomeColors.length]
        ),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  /* ---------- LOAN PIE CHART ---------- */
  const loanLenders = [
    ...new Set(loanTransactions.map((l) => l.name || l.lender)),
  ];
  const loanColors = [
    "#4C8998", // Blue-Gray
    "#10B981", // Emerald
    "#F97316", // Orange
    "#EF4444", // Red
    "#466494", // Navy Blue
    "#A855F7", // Violet
  ];
  const loanChartData = {
    labels: loanLenders,
    datasets: [
      {
        data: loanLenders.map((lender) =>
          loanTransactions
            .filter((l) => (l.name || l.lender) === lender)
            .reduce((sum, l) => sum + l.amount, 0)
        ),
        backgroundColor: loanLenders.map(
          (_, idx) => loanColors[idx % loanColors.length]
        ),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="user-info">
        <h2>Welcome, {firstName} 👋</h2>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card income">
          <h3>Total Income</h3>
          <p>{formatCurrency(totalIncome)}</p>
        </div>
        <div className="card expense">
          <h3>Total Expense</h3>
          <p>{formatCurrency(totalExpense)}</p>
        </div>
        <div className="card loan">
          <h3>Total Loan Taken</h3>
          <p>{formatCurrency(totalLoan)}</p>
        </div>
        <div className="card balance">
          <h3>Balance</h3>
          <p>{formatCurrency(balance)}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div
        className="charts-row"
        style={{
          display: "flex",
          gap: 24,
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 32,
        }}
      >
        <div
          className="chart-container"
          style={{ flex: 1, minWidth: 260, maxWidth: 340 }}
        >
          <h3>Expense by Category</h3>
          {categories.length > 0 ? (
            <Pie data={expenseChartData} />
          ) : (
            <p>No expense data available</p>
          )}
        </div>

        <div
          className="chart-container"
          style={{ flex: 1, minWidth: 260, maxWidth: 340 }}
        >
          <h3>Income by Source</h3>
          {incomeSources.length > 0 ? (
            <Pie data={incomeChartData} />
          ) : (
            <p>No income data available</p>
          )}
        </div>

        <div
          className="chart-container"
          style={{ flex: 1, minWidth: 260, maxWidth: 340 }}
        >
          <h3>Loan by Lender</h3>
          {loanLenders.length > 0 ? (
            <Pie data={loanChartData} />
          ) : (
            <p>No loan data available</p>
          )}
        </div>
      </div>

      {/* Add Transaction Button */}
      <button
        className="add-expense-btn"
        onClick={() => navigate("/add-transaction")}
      >
        + Add Transaction
      </button>
    </div>
  );
};

export default Dashboard;
