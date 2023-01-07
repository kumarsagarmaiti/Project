export default function Street({
	setStreet,
	isValidStreet,
	setIsValidStreet,
	setUpdateStreet,
	street,
}) {
	function stateChange(e) {
		let val = e.target.value.trim();
		setStreet(val);
		setUpdateStreet(val);
		!val.length ? setIsValidStreet(false) : setIsValidStreet(true);
		return;
	}
	return (
		<div>
			<div className="input-field">
				<input
					type="text"
					placeholder="Street"
					value={street}
					onChange={(e) => stateChange(e)}
				/>
			</div>
			{!isValidStreet && (
				<p className="form-error-message">Please enter Street</p>
			)}
		</div>
	);
}
