import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./styles/base/styles.css";

const root = document.getElementById("root");
createRoot(root).render(<App />);
