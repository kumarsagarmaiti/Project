import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./Pages/Home/homePage";
import RegisterPage from "./Pages/Register/registerPage";
import LoginPage from "./Pages/Login/loginPage";
import Dashboard from "./Pages/Dashboard/dashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="dashboard" element={<Dashboard />}>
				<Route path=":id" element={<Dashboard />} />
			</Route>
			<Route path="register" element={<RegisterPage />} />
			<Route path="login" element={<LoginPage />} />
		</Routes>
	</BrowserRouter>
);
