import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./Pages/Home/homePage";
import RegisterPage from "./Pages/Register/registerPage";
import LoginPage from "./Pages/Login/loginPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="register" element={<RegisterPage />} />
			<Route path="login" element={<LoginPage />} />
		</Routes>
	</BrowserRouter>
);
