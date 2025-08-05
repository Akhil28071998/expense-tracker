import React from "react";
import { ExpenseProvider } from "../context/ExpenseContext";
import DashboardLayout from "../Layout/DashboardLayout";
import Dashboard from "../Components/Dashboard";

const Index = () => {
  return (
    <ExpenseProvider>
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </ExpenseProvider>
  );
};

export default Index;
