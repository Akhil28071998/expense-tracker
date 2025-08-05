import React, { useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { FinanceContext } from "../context/FinanceContext";

const COLORS = ["#00C49F", "#FF8042"];

const Charts = () => {
  const { transactions } = useContext(FinanceContext);

  const data = [
    {
      name: "Income",
      value: transactions
        .filter((t) => t.type === "income")
        .reduce((a, b) => a + b.amount, 0),
    },
    {
      name: "Expense",
      value: transactions
        .filter((t) => t.type === "expense")
        .reduce((a, b) => a + b.amount, 0),
    },
  ];

  return (
    <div className="charts">
      <PieChart width={300} height={300}>
        <Pie data={data} dataKey="value" outerRadius={120}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <BarChart width={300} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#36A2EB" />
      </BarChart>
    </div>
  );
};

export default Charts;
