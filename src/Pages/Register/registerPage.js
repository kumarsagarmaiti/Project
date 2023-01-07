import { useState } from "react";
import Navbar from "../navbar";
import City from "./addressCity";
import Pincode from "./addressPincode";
import Street from "./addressStreet";
import Email from "./email";
import Name from "./name";
import Password from "./password";
import Mobile from "./phone";
import "./registerPage.css";
import axios from "axios";

export default function RegisterPage() {
	let [phone, setPhone] = useState("");
	let [isValidPhone, setIsValidPhone] = useState(true);
	let [updatePhone, setUpdatePhone] = useState("");

	let [name, setName] = useState("");
	let [isValidName, setIsValidName] = useState(true);
	let [updateName, setUpdateName] = useState("");

	let [email, setEmail] = useState("");
	let [isValidEmail, setIsValidEmail] = useState(true);
	let [updateEmail, setUpdateEmail] = useState("");

	let [password, setPassword] = useState("");
	let [isValidPassword, setIsValidPassword] = useState(true);
	let [updatePassword, setUpdatePassword] = useState("");

	let [street, setStreet] = useState("");
	let [isValidStreet, setIsValidStreet] = useState(true);
	let [updateStreet, setUpdateStreet] = useState("");

	let [city, setCity] = useState("");
	let [isValidCity, setIsValidCity] = useState(true);
	let [updateCity, setUpdateCity] = useState("");

	let [pincode, setPincode] = useState("");
	let [isValidPincode, setIsValidPincode] = useState(true);
	let [updatePincode, setUpdatePincode] = useState("");

	let [next, setNext] = useState(false);

	let [success, setSuccess] = useState(false);

	function handleNext(e) {
		e.preventDefault();
		if (
			!(email || phone || password || name) ||
			!isValidPhone ||
			!isValidName ||
			!isValidPassword ||
			!isValidEmail
		) {
			alert("Fill the registration form to proceed");
			return;
		}
		setPassword(updatePassword);
		setEmail(updateEmail);
		setName(updateName);
		setPhone(updatePhone);
		setNext(true);
		return;
	}

	function handlePrevious(e) {
		e.preventDefault();
		setCity(updateCity);
		setStreet(updateStreet);
		setPincode(updatePincode);
		setNext(false);
		return;
	}

	function handleSubmit(e) {
		e.preventDefault();
		if (
			!(street || city || pincode) ||
			!isValidPincode ||
			!isValidStreet ||
			!isValidCity
		) {
			alert("Fill the registration form to proceed");
		}
		setCity(updateCity);
		setStreet(updateStreet);
		setPincode(updatePincode);
		setNext(false);
		const obj = {
			name,
			phone,
			email,
			password,
			address: { street, pincode, city },
		};

		axios
			.post("http://localhost:3001/register", obj)
			.then((response) => {
				setSuccess(true);
			})
			.catch((e) => alert(e.response.data.message));
		return;
	}

	return (
		<div>
			<Navbar />
			<div className="container">
				<div className="form-box">
					<h1>Sign Up</h1>
					{success && (
						<h2>
							Registered. Go to <a href="/login">Login</a>
						</h2>
					)}
					{!next && !success && (
						<form>
							<div className="input-group">
								<Name
									setName={setName}
									isValidName={isValidName}
									setIsValidName={setIsValidName}
									name={name}
									setUpdateName={setUpdateName}
								/>
								<Mobile
									setPhone={setPhone}
									setIsValidPhone={setIsValidPhone}
									isValidPhone={isValidPhone}
									phone={phone}
									setUpdatePhone={setUpdatePhone}
								/>
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
							</div>
							<div className="btn-field">
								<button type="button" onClick={(e) => handleNext(e)}>
									Next
								</button>
							</div>
						</form>
					)}
					{next && !success && (
						<form>
							<h2>Address:</h2>
							<div className="input-group">
								<City
									setCity={setCity}
									setIsValidCity={setIsValidCity}
									isValidCity={isValidCity}
									city={city}
									setUpdateCity={setUpdateCity}
								/>
								<Street
									setStreet={setStreet}
									setIsValidStreet={setIsValidStreet}
									isValidStreet={isValidStreet}
									street={street}
									setUpdateStreet={setUpdateStreet}
								/>
								<Pincode
									setPincode={setPincode}
									setIsValidPincode={setIsValidPincode}
									isValidPincode={isValidPincode}
									pincode={pincode}
									setUpdatePincode={setUpdatePincode}
								/>
							</div>
							<div className="btn-field">
								<button type="button" onClick={(e) => handlePrevious(e)}>
									Previous
								</button>
								<button type="button" onClick={(e) => handleSubmit(e)}>
									Sign Up
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
