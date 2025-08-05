import React, { useState, useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";
import "./AddTransaction.css";
import { toast } from "react-hot-toast";

const AddTransaction = () => {
  const { transactions, addTransaction } = useContext(FinanceContext);

  const [formData, setFormData] = useState({
    type: "income",
    source: "",
    name: "",
    category: "General",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Calculate current balance
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.type === "expense" && balance < parseFloat(formData.amount)) {
      toast.error("Insufficient balance! Cannot add this expense.");
      return;
    }

    addTransaction({
      type: formData.type,
      source: formData.type === "income" ? formData.source : "",
      name: formData.type === "expense" ? formData.name : "",
      category: formData.type === "expense" ? formData.category : "Income",
      amount: parseFloat(formData.amount),
      date: formData.date,
    });

    setFormData({
      type: "income",
      source: "",
      name: "",
      category: "General",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="add-transaction">
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit} className="transaction-form">
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {formData.type === "income" && (
          <input
            type="text"
            name="source"
            placeholder="Income Source (e.g., Salary)"
            value={formData.source}
            onChange={handleChange}
          />
        )}

        {formData.type === "expense" && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Expense Name"
              value={formData.name}
              onChange={handleChange}
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="General">General</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Health">Health</option>
            </select>
          </>
        )}

        <input
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          value={formData.amount}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddTransaction;
