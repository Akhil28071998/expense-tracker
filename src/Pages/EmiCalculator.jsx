import React, { useState } from "react";
import "./EmiCalculator.css";

const EmiCalculator = () => {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState(null);

  const calculateEMI = (e) => {
    e.preventDefault();
    if (!amount || !rate || !tenure) {
      setEmi(null);
      return;
    }
    const principal = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const months = parseInt(tenure);
    const monthlyRate = annualRate / 12 / 100;
    const emiValue =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    setEmi(emiValue ? emiValue.toFixed(2) : 0);
  };

  return (
    <div className="emi-calculator-container">
      <h2>EMI Calculator</h2>
      <form onSubmit={calculateEMI}>
        <input
          type="number"
          placeholder="Loan Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          required
        />
        <input
          type="number"
          placeholder="Interest Rate (%)"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          min="0.1"
          step="0.01"
          required
        />
        <input
          type="number"
          placeholder="Tenure (months)"
          value={tenure}
          onChange={(e) => setTenure(e.target.value)}
          min="1"
          required
        />
        <button type="submit">Calculate EMI</button>
      </form>
      {emi !== null && <div className="emi-result">Monthly EMI: ₹{emi}</div>}
    </div>
  );
};

export default EmiCalculator;
