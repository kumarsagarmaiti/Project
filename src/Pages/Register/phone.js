export default function Mobile({
	setPhone,
	setIsValidPhone,
	isValidPhone,
	setUpdatePhone,
	phone,
}) {
	function stateChange(e) {
		const val = e.target.value;
		setPhone(val);
		setUpdatePhone(val);

		if ((val.length > 0 && val.length != 10) || !checkValidPhone(val))
			setIsValidPhone(false);
		else setIsValidPhone(true);
		return;
	}

	return (
		<div>
			<div className="input-field">
				<input
					type="text"
					placeholder="Mobile Number"
					maxLength="10"
					onChange={(e) => stateChange(e)}
					value={phone}
				/>
			</div>
			{!isValidPhone && (
				<p className="form-error-message">Invalid phone number</p>
			)}
		</div>
	);
}

var checkValidPhone = (number) => {
	const phoneRegex = /^((\+91)?|91)?[789]{1}[0-9]{9}$/;
	console.log(phoneRegex.test(number));
	return phoneRegex.test(number);
};
