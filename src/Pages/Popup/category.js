export default function Category({
	category,
	setCategory,
	isValidCategory,
	setIsValidCategory,
}) {
	function stateChange(e) {
		let val = e.target.value;
		setCategory(val);
		val.length ? setIsValidCategory(true) : setIsValidCategory(false);
		return;
	}
	return (
		<div>
			<div className="input-field">
				<input
					type="text"
					placeholder="Category"
					value={category}
					onChange={(e) => stateChange(e)}
				></input>
			</div>
			{!isValidCategory && (
				<p className="form-error-message">Please provide category</p>
			)}
		</div>
	);
}
