import React, { createContext, useState, useEffect } from "react";

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, { ...transaction, id: Date.now() }]);
  };

  // Deduct balance by adding an expense transaction (for transfer)
  const deductBalance = (amount, transaction) => {
    addTransaction({
      ...transaction,
      type: "expense",
      amount: parseFloat(amount),
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        setTransactions,
        totalIncome,
        totalExpense,
        balance,
        addTransaction,
        deductBalance,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
