import React, { useContext, useState } from "react";
import { FinanceContext } from "../context/FinanceContext";
import "./TransferMoney.css";

const TransferMoney = () => {
  const { balance, deductBalance, addTransaction, transactions } =
    useContext(FinanceContext);
  const [transferType, setTransferType] = useState("bank");
  const [formData, setFormData] = useState({
    recipient: "",
    account: "",
    confirmAccount: "",
    upiId: "",
    mobile: "",
    amount: "",
    note: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (transferType === "bank") {
      if (formData.account !== formData.confirmAccount) {
        alert("The account numbers do not match. Please re-enter and confirm.");
        return;
      }
    }

    //account validation
    const transferAmount = parseFloat(formData.amount);
    if (!transferAmount || transferAmount <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }

    if (transferAmount > 100000) {
      alert("Money transfer limit is ₹1,00,000 per transaction.");
      return;
    }

    if (transferAmount > balance) {
      alert("Insufficient balance.");
      return;
    }

    deductBalance(transferAmount, {
      name: formData.recipient,
      category:
        transferType === "bank"
          ? "Bank Transfer"
          : transferType === "upi"
          ? "UPI"
          : "Mobile Transfer",
      note: formData.note,
    });

    alert(
      `₹${Number(
        formData.amount
      ).toLocaleString()} has been successfully transferred via ${transferType.toUpperCase()} to ${
        formData.recipient
      }.`
    );

    setFormData({
      recipient: "",
      account: "",
      confirmAccount: "",
      upiId: "",
      mobile: "",
      amount: "",
      note: "",
    });
    setTransferType("bank");
  };

  const transferTransactions = transactions.filter(
    (t) =>
      t.type === "expense" &&
      ["Bank Transfer", "UPI", "Mobile Transfer"].includes(t.category)
  );

  return (
    <div className="transfer-page">
      <h2>Money Transfer</h2>

      <form onSubmit={handleSubmit} className="transfer">
        <label>
          Transfer Method:
          <select
            value={transferType}
            onChange={(e) => setTransferType(e.target.value)}
          >
            <option value="bank">Bank Transfer</option>
            <option value="upi">UPI</option>
            <option value="mobile">Mobile No</option>
          </select>
        </label>

        <label>
          Recipient Name:
          <input
            type="text"
            name="recipient"
            value={formData.recipient}
            onChange={handleChange}
            required
          />
        </label>

        {transferType === "bank" && (
          <>
            <label>
              Account No:
              <input
                type="text"
                name="account"
                value={formData.account}
                onChange={handleChange}
                required
                pattern="[0-9]{1,}"
                inputMode="numeric"
              />
            </label>

            <label>
              Confirm Account No:
              <input
                type="text"
                name="confirmAccount"
                value={formData.confirmAccount}
                onChange={handleChange}
                required
                pattern="[0-9]{1,}"
                inputMode="numeric"
              />
            </label>
          </>
        )}

        {transferType === "upi" && (
          <label>
            UPI ID:
            <input
              type="text"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              required
              placeholder="example@upi"
            />
          </label>
        )}

        {transferType === "mobile" && (
          <label>
            Mobile No:
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              placeholder="10-digit mobile no"
            />
          </label>
        )}

        <label>
          Amount (₹):
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="1"
          />
        </label>

        <label>
          Note:
          <input
            type="text"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="(optional)"
          />
        </label>

        <button type="submit">Transfer</button>
      </form>
    </div>
  );
};

export default TransferMoney;
