import React, { useContext } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import Charts from "./Charts";
import "./ExpenseSummary.css";

const ExpenseSummary = () => {
  const contextValue = useContext(ExpenseContext);
  const transactions =
    contextValue && Array.isArray(contextValue.transactions)
      ? contextValue.transactions
      : [];
  const safeTransactions = transactions;

  const totalIncome = safeTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = safeTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="expenses-container">
      <h2>Overview</h2>

      {safeTransactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <>
          <div className="expense-form">
            <div>
              <h3>Income</h3>
              <p>₹{totalIncome}</p>
            </div>
            <div>
              <h3>Expense</h3>
              <p>₹{totalExpense}</p>
            </div>
            <div>
              <h3>Balance</h3>
              <p>₹{balance}</p>
            </div>
          </div>
          <Charts income={totalIncome} expense={totalExpense} />
        </>
      )}
    </div>
  );
};

export default ExpenseSummary;
