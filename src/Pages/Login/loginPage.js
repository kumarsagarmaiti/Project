import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import Email from "../Register/email";
import Password from "../Register/password";
import "./loginPage.css";
import axios from "axios";

export default function LoginPage() {
	const navigate = useNavigate();
	let [email, setEmail] = useState("");
	let [isValidEmail, setIsValidEmail] = useState(true);
	let [updateEmail, setUpdateEmail] = useState("");

	let [password, setPassword] = useState("");
	let [isValidPassword, setIsValidPassword] = useState(true);
	let [updatePassword, setUpdatePassword] = useState("");

	function handleSubmit(e) {
		e.preventDefault();
		if (!(email || password) || !isValidPassword || !isValidEmail)
			alert("Fill the login details to proceed");

		axios
			.post("http://localhost:3001/login", { email, password })
			.then((response) => {
				const userId = response.data.message.userId;
				const obj = {
					token: response.data.message.token,
					name: response.data.message.name,
				};
				window.localStorage.setItem(userId, JSON.stringify(obj));
				navigate(`/dashboard/${userId}`);
			})
			.catch((e) => alert(e.response.data.message));
	}

	return (
		<div>
			<Navbar />
			<div className="container">
				<div className="form-box">
					<h1>Login</h1>
					<form>
						<Email
							setEmail={setEmail}
							setIsValidEmail={setIsValidEmail}
							isValidEmail={isValidEmail}
							email={email}
							setUpdateEmail={setUpdateEmail}
						/>
						<Password
							setPassword={setPassword}
							setIsValidPassword={setIsValidPassword}
							isValidPassword={isValidPassword}
							password={password}
							setUpdatePassword={setUpdatePassword}
						/>
						<div className="btn-field">
							<button type="button" onClick={(e) => handleSubmit(e)}>
								Login
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
