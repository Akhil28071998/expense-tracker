import React, { useContext, useState, useEffect } from "react";
import { FinanceContext } from "../context/FinanceContext";
import "../Pages/Expenses.css";
import { formatCurrency } from "../utils/FinanceUtils";

const Expenses = () => {
  const { transactions, setTransactions } = useContext(FinanceContext);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    source: "",
    category: "",
    amount: "",
    date: "", // <-- add date field
  });

  // Prevent adding expenses with a future date
  const isFutureDate = (dateStr) => {
    const inputDate = new Date(dateStr);
    const today = new Date();
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return inputDate > today;
  };

  // Wrap setTransactions to prevent future date expenses
  const safeSetTransactions = (newTransactions) => {
    // If adding/editing, check for future date
    if (editId !== null) {
      const edited = newTransactions.find((t) => t.id === editId);
      if (edited && isFutureDate(edited.date)) {
        alert("You cannot add or edit an expense with a future date.");
        return;
      }
    } else {
      // For new transaction, check last added
      const last = newTransactions[newTransactions.length - 1];
      if (last && isFutureDate(last.date)) {
        alert("You cannot add an expense with a future date.");
        return;
      }
    }
    setTransactions(newTransactions);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      safeSetTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  // Add date field to editData for editing
  const handleEdit = (transaction) => {
    setEditId(transaction.id);
    setEditData({
      name: transaction.name,
      source: transaction.source,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date, // <-- add date field
    });
  };

  const handleSave = () => {
    safeSetTransactions(
      transactions.map((t) =>
        t.id === editId
          ? { ...t, ...editData, amount: parseFloat(editData.amount) }
          : t
      )
    );
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Month/year selection state
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  // Get all years present in transactions
  const years = Array.from(
    new Set(transactions.map((t) => new Date(t.date).getFullYear()))
  ).sort((a, b) => b - a);

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Filter transactions for selected month/year
  const filteredTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 8;
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  // Add a stub for handleDownloadPDF to prevent error
  const handleDownloadPDF = () => {
    // TODO: Implement PDF download logic
    alert("Download PDF feature coming soon!");
  };

  // Prevent adding expenses with a future date in editData
  useEffect(() => {
    if (editData.date && isFutureDate(editData.date)) {
      alert("You cannot select a future date for expense.");
      setEditData((prev) => ({
        ...prev,
        date: new Date().toISOString().split("T")[0],
      }));
    }
  }, [editData.date]);

  return (
    <div className="expenses-page">
      <h1 className="expenses-title">Mini Statement</h1>
      <div className="expenses-header">
        <select
          className="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {monthNames.map((name, idx) => (
            <option key={name} value={idx}>
              {name}
            </option>
          ))}
        </select>
        <select
          className="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      {filteredTransactions.length === 0 ? (
        <p className="no-transactions">No transactions for selected month</p>
      ) : (
        <>
          <div className="table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Source / Name</th>
                  <th>Category</th>
                  <th>Amount (₹)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>
                      {editId === t.id ? (
                        <input
                          type="date"
                          name="date"
                          value={editData.date}
                          onChange={handleChange}
                          max={new Date().toISOString().split("T")[0]}
                        />
                      ) : (
                        t.date
                      )}
                    </td>
                    <td
                      className={
                        t.type === "income" ? "type-income" : "type-expense"
                      }
                    >
                      {t.type}
                    </td>
                    <td>
                      {editId === t.id ? (
                        <input
                          type="text"
                          name={t.type === "income" ? "source" : "name"}
                          value={
                            t.type === "income"
                              ? editData.source
                              : editData.name
                          }
                          onChange={handleChange}
                        />
                      ) : t.type === "income" ? (
                        t.source
                      ) : (
                        t.name
                      )}
                    </td>
                    <td>
                      {t.type === "income" ? (
                        "Income"
                      ) : editId === t.id ? (
                        <select
                          name="category"
                          value={editData.category}
                          onChange={handleChange}
                        >
                          <option value="General">General</option>
                          <option value="Food">Food</option>
                          <option value="Travel">Travel</option>
                          <option value="Shopping">Shopping</option>
                          <option value="Bills">Bills</option>
                          <option value="Health">Health</option>
                        </select>
                      ) : (
                        t.category
                      )}
                    </td>
                    <td className={t.type === "income" ? "income" : "expense"}>
                      {editId === t.id ? (
                        <input
                          type="number"
                          name="amount"
                          value={editData.amount}
                          onChange={handleChange}
                        />
                      ) : (
                        `${formatCurrency(t.amount)}`
                      )}
                    </td>
                    <td className="actions">
                      {editId === t.id ? (
                        <>
                          <button className="save-btn" onClick={handleSave}>
                            Save
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => setEditId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(t)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(t.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="download-btn" onClick={handleDownloadPDF}>
            Download PDF
          </button>
          {/* Pagination Controls */}
          <div
            className="pagination-controls"
            style={{ textAlign: "center", margin: "18px 0" }}
          >
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span style={{ margin: "0 12px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Expenses;
