import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Verification from "./Pages/Main/Verification";
import Investigation from "./Pages/Main/Investigation";
import EntryDetails from "./Pages/Main/EntryDetails";
import Dashboard from "./Pages/Main/Dashboard";
import Login from "./Pages/Main/Login";
import PrivateRoutes from "./Utils/Auth/PrivateRoutes";
import PublicRoutes from "./Utils/Auth/PublicRoutes";
import { useAuth } from "./Utils/Auth/useAuth";
import ErrorPage from "./Pages/Main/ErrorPage";

import "./App.css";

function App() {
  const isAuthenticated = useAuth();

  return (
    <BrowserRouter>
      <div className="flex flex-col w-full">
        {isAuthenticated && <Navbar />}
        <div className="flex flex-row ">
          {isAuthenticated && <Sidebar />}
          <div className={`${isAuthenticated ? "p-4" : ""}`}>
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/investigation" element={<Investigation />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/entry-details" element={<EntryDetails />} />
              </Route>

              <Route element={<PublicRoutes />}>
                <Route path="/login" element={<Login />} />
              </Route>

              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
