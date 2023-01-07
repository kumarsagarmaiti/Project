export default function City({
	setCity,
	isValidCity,
	setIsValidCity,
	setUpdateCity,
	city,
}) {
	function stateChange(e) {
		let val = e.target.value.trim();
		setUpdateCity(val);
		setCity(val);
		!val.length ? setIsValidCity(false) : setIsValidCity(true);
		return;
	}
	return (
		<div>
			<div className="input-field">
				<input
					type="text"
					placeholder="City"
					value={city}
					onChange={(e) => stateChange(e)}
				/>
			</div>
			{!isValidCity && <p className="form-error-message">Please enter city</p>}
		</div>
	);
}
