import React from "react";
import ReactDOM from "react-dom/client";
import { FormProvider } from "./Context/FormContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
        <FormProvider>
          <App />
        </FormProvider>
);
