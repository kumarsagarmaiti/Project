export default function Password({
	setPassword,
	isValidPassword,
	setIsValidPassword,
	password,
	setUpdatePassword,
}) {
	function stateChange(e) {
		let val = e.target.value.trim();
		setUpdatePassword(val);
		setPassword(val);
		!val.length || !passwordRegex.test(val) || val.length < 8
			? setIsValidPassword(false)
			: setIsValidPassword(true);

		return;
	}
	return (
		<div>
			<div className="input-field">
				<input
					type="email"
					placeholder="Password"
					maxLength="15"
					onChange={(e) => stateChange(e)}
					value={password}
				/>
			</div>
			{!isValidPassword && (
				<p className="form-error-message">
					Password should be of minimum 8 characters containing uppercase,
					lowercase, special characters and a number
				</p>
			)}
		</div>
	);
}

var passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,15})/;
