import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./Pages/homePage";
import RegisterPage from "./Pages/registerPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="register" element={<RegisterPage />} />
		</Routes>
	</BrowserRouter>
);
