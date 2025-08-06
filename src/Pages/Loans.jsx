import React, { useState, useContext, useEffect } from "react";
import { FinanceContext } from "../context/FinanceContext"; //expenses aur income ka record
import "./Loans.css";

// EMI calculation
function calculateEMI(amount, rate, tenure) {
  const monthlyRate = rate / 12 / 100;
  return (
    (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  ).toFixed(2);
}

const Loans = () => {
  const { addTransaction } = useContext(FinanceContext);

  //loan data store in one array
  const [loans, setLoans] = useState(() => {
    const saved = localStorage.getItem("loans");
    return saved ? JSON.parse(saved) : [];
  });

  //new loan add
  const [form, setForm] = useState({
    lender: "",
    amount: "",
    rate: "",
    tenure: "",
    startDate: "",
  });

  //loan edit or update
  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({
    lender: "",
    amount: "",
    rate: "",
    tenure: "",
    startDate: "",
  });

  //loan delete
  const handleDeleteLoan = (idx) => {
    if (window.confirm("Delete this loan?")) {
      setLoans(loans.filter((_, i) => i !== idx));
    }
  };

  // open edit mode
  const handleEditLoan = (idx) => {
    setEditIdx(idx);
    const loan = loans[idx];
    setEditForm({
      lender: loan.lender,
      amount: loan.amount,
      rate: loan.rate,
      tenure: loan.tenure,
      startDate: loan.startDate,
    });
  };

  // edit save
  const handleSaveEdit = (idx) => {
    const loanAmount = Number(editForm.amount);
    const emi = calculateEMI(
      loanAmount,
      Number(editForm.rate),
      Number(editForm.tenure)
    );
    setLoans(
      loans.map((loan, i) =>
        i === idx
          ? {
              ...loan,
              lender: editForm.lender,
              amount: loanAmount,
              rate: Number(editForm.rate),
              tenure: Number(editForm.tenure),
              startDate: editForm.startDate,
              emi: Number(emi),
            }
          : loan
      )
    );
    setEditIdx(null);
  };

  //edit cancel
  const handleCancelEdit = () => {
    setEditIdx(null);
  };

  //data save in localStorage Auto save
  useEffect(() => {
    localStorage.setItem("loans", JSON.stringify(loans));
  }, [loans]);

  //form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //Add loan
  const handleAddLoan = (e) => {
    e.preventDefault();

    if (
      !form.lender ||
      !form.amount ||
      !form.rate ||
      !form.tenure ||
      !form.startDate
    ) {
      alert("Please fill in all fields");
      return;
    }

    const loanAmount = Number(form.amount);
    const emi = calculateEMI(
      loanAmount,
      Number(form.rate),
      Number(form.tenure)
    );

    const newLoan = {
      ...form,
      amount: loanAmount,
      rate: Number(form.rate),
      tenure: Number(form.tenure),
      emi: Number(emi),
      remaining: loanAmount,
      status: "Active",
      paidEMIs: 0,
      lastEMIPaidDate: null,
    };

    setLoans([...loans, newLoan]);

    addTransaction({
      type: "loan",
      name: `Loan from ${form.lender}`,
      category: "Loan Credit",
      amount: loanAmount,
      date: form.startDate,
    });

    setForm({ lender: "", amount: "", rate: "", tenure: "", startDate: "" });
  };

  // pay EMI
  const handleDeductEMI = (idx) => {
    const currentMonth = new Date().toISOString().slice(0, 7);

    const updatedLoans = loans.map((loan, i) => {
      if (i !== idx || loan.status === "Completed") return loan;

      if (loan.lastEMIPaidDate === currentMonth) {
        return loan;
      }

      const newRemaining = loan.remaining - loan.emi;
      const newPaidEMIs = loan.paidEMIs + 1;

      addTransaction({
        type: "expense",
        name: `EMI for ${loan.lender}`,
        category: "Loan EMI",
        amount: loan.emi,
        date: new Date().toISOString().split("T")[0],
      });

      return {
        ...loan,
        remaining: newRemaining > 0 ? newRemaining : 0,
        paidEMIs: newPaidEMIs,
        lastEMIPaidDate: currentMonth,
        status:
          newRemaining <= 0 || newPaidEMIs >= loan.tenure
            ? "Completed"
            : "Active",
      };
    });

    setLoans(updatedLoans);
  };

  return (
    <div className="loans-page">
      <h2>💳 Loan Manager</h2>

      <form onSubmit={handleAddLoan} className="loan-form">
        <input
          name="lender"
          value={form.lender}
          onChange={handleChange}
          placeholder="Lender Name"
        />
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="Loan Amount"
        />
        <input
          name="rate"
          type="number"
          value={form.rate}
          onChange={handleChange}
          placeholder="Interest Rate (%)"
        />
        <input
          name="tenure"
          type="number"
          value={form.tenure}
          onChange={handleChange}
          placeholder="Tenure (months)"
        />
        <input
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleChange}
        />
        <button type="submit">Add Loan</button>
      </form>

      {loans.length === 0 ? (
        <p className="no-loan-text">No loans added yet.</p>
      ) : (
        <>
          <table className="loans-table">
            <thead>
              <tr>
                <th>Lender</th>
                <th>Amount</th>
                <th>Rate (%)</th>
                <th>Tenure</th>
                <th>EMI</th>
                <th>Start Date</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, idx) => (
                <tr
                  key={idx}
                  className={
                    loan.status === "Completed"
                      ? "completed-loan"
                      : "active-loan"
                  }
                >
                  <td>
                    {editIdx === idx ? (
                      <input
                        name="lender"
                        value={editForm.lender}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lender: e.target.value })
                        }
                      />
                    ) : (
                      loan.lender
                    )}
                  </td>
                  <td>
                    {editIdx === idx ? (
                      <input
                        name="amount"
                        type="number"
                        value={editForm.amount}
                        onChange={(e) =>
                          setEditForm({ ...editForm, amount: e.target.value })
                        }
                      />
                    ) : (
                      `₹${loan.amount}`
                    )}
                  </td>
                  <td>
                    {editIdx === idx ? (
                      <input
                        name="rate"
                        type="number"
                        value={editForm.rate}
                        onChange={(e) =>
                          setEditForm({ ...editForm, rate: e.target.value })
                        }
                      />
                    ) : (
                      loan.rate
                    )}
                  </td>
                  <td>
                    {editIdx === idx ? (
                      <input
                        name="tenure"
                        type="number"
                        value={editForm.tenure}
                        onChange={(e) =>
                          setEditForm({ ...editForm, tenure: e.target.value })
                        }
                      />
                    ) : (
                      loan.tenure
                    )}
                  </td>
                  <td>₹{loan.emi}</td>
                  <td>
                    {editIdx === idx ? (
                      <input
                        name="startDate"
                        type="date"
                        value={editForm.startDate}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            startDate: e.target.value,
                          })
                        }
                      />
                    ) : (
                      loan.startDate
                    )}
                  </td>
                  <td>₹{loan.remaining.toFixed(2)}</td>
                  <td>{loan.status}</td>
                  <td>
                    {editIdx === idx ? (
                      <>
                        <button
                          className="save-btn"
                          onClick={() => handleSaveEdit(idx)}
                        >
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="save-btn"
                          onClick={() => handleEditLoan(idx)}
                        >
                          Edit
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => handleDeleteLoan(idx)}
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
        </>
      )}
    </div>
  );
};

export default Loans;
