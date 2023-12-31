import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "tw-elements-react/dist/css/tw-elements-react.min.css";
import '@/styles/main.scss';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
