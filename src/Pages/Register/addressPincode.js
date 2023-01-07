export default function Pincode({
	setPincode,
	isValidPincode,
	setIsValidPincode,
	setUpdatePincode,
	pincode,
}) {
	function stateChange(e) {
		let val = e.target.value.trim();
		setUpdatePincode(val);
		setPincode(val);
		!val || !/^[1-9][0-9]{5}$/.test(val)
			? setIsValidPincode(false)
			: setIsValidPincode(true);
		return;
	}
	return (
		<div>
			<div className="input-field">
				<input
					type="text"
					placeholder="Pincode"
					value={pincode}
					onChange={(e) => stateChange(e)}
				/>
			</div>
			{!isValidPincode && (
				<p className="form-error-message">Please enter Pincode</p>
			)}
		</div>
	);
}
