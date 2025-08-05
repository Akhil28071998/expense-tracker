import React, { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";
import "./TransactionTable.css";

const TransactionTable = () => {
  const { transactions } = useContext(FinanceContext);

  return (
    <div className="transaction-table-container">
      <h2>Mini Statement</h2>
      {transactions.length === 0 ? (
        <p className="no-transactions">No transactions yet</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name/Category</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr
                key={t.id}
                className={t.type === "expense" ? "expense-row" : "income-row"}
              >
                <td>{t.type}</td>
                <td>{t.name || t.category}</td>
                <td>₹{t.amount}</td>
                <td>{t.date || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionTable;
