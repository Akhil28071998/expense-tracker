import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./Layout/DashboardLayout";
import Dashboard from "./Pages/Dashboard";
import Expenses from "./Pages/Expenses";
import Loans from "./Pages/Loans";
import TransferMoney from "./Pages/TransferMoney";
import AddTransaction from "./Components/AddTransaction";
import NotFound from "./Pages/NotFound";
import EmiCalculator from "./Pages/EmiCalculator";
import Login from "./Pages/Login";
import { UserProvider } from "./context/UserContext";
import { FinanceProvider } from "./context/FinanceContext";

const App = () => {
  return (
    <UserProvider>
      <FinanceProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="loans" element={<Loans />} />
              <Route path="transferMoney" element={<TransferMoney />} />
              <Route path="add-transaction" element={<AddTransaction />} />
              <Route path="emicalculator" element={<EmiCalculator />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FinanceProvider>
    </UserProvider>
  );
};

export default App;
