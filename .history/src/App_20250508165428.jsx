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
import Settings from "./Pages/Main/Settings";
import Alerts from "./Pages/Main/Alerts";
import InvestigationDetails from "./Pages/Main/InvestigationDetails";
import InvestigationPage from "./Pages/Sub/Investigation";

import "./App.css";

function App() {
  const isAuthenticated = useAuth();

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        {isAuthenticated && <Navbar />}
        <div className="flex-1 flex overflow-hidden">
          {isAuthenticated && <Sidebar />}
          <main
            className={`${
              isAuthenticated ? "p-4" : ""
            } flex-1 overflow-y-auto`}
          >
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/investigation" element={<Investigation />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/entry-details" element={<EntryDetails />} />
                <Route path="/entry-details/investigation" element={<InvestigationPage />} />
                <Route path="/investigation/:fileNumber" element={<InvestigationDetails />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/alerts" element={<Alerts />} />
              </Route>

              <Route element={<PublicRoutes />}>
                <Route path="/login" element={<Login />} />
              </Route>

              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
