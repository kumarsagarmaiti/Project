export default function Email({
	setEmail,
	isValidEmail,
	setIsValidEmail,
	setUpdateEmail,
	email,
}) {
	function stateChange(e) {
		let val = e.target.value.trim();
		setUpdateEmail(val);
		setEmail(val);
		!val.length || !checkValidEmail(val)
			? setIsValidEmail(false)
			: setIsValidEmail(true);

		return;
	}
	return (
		<div>
			<div className="input-field">
				<input
					type="email"
					placeholder="E-mail"
					value={email}
					onChange={(e) => stateChange(e)}
				/>
			</div>
			{!isValidEmail && <p className="form-error-message">Invalid email</p>}
		</div>
	);
}

var checkValidEmail = (val) => {
	const emailRegex = /^([a-z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/;
	return emailRegex.test(val);
};
