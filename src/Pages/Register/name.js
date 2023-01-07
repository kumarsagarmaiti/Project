export default function Name({
	setName,
	isValidName,
	setIsValidName,
	setUpdateName,
	name,
}) {
	function stateChange(e) {
		let val = e.target.value.trim();
		setName(val);
		setUpdateName(val);
		val.length ? setIsValidName(true) : setIsValidName(false);
		return;
	}

	return (
		<div>
			<div className="input-field">
				<input
					type="text"
					placeholder="Name"
					onChange={(e) => stateChange(e)}
					value={name}
				/>
			</div>
			{!isValidName && (
				<p className="form-error-message">Please provide name</p>
			)}
		</div>
	);
}
