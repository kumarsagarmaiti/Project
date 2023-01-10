export default function Category({
	subCat,
	setSubCat,
	isValidSubCat,
	setIsValidSubCat,
}) {
	function stateChange(e) {
		let val = e.target.value;
		setSubCat(val);
		val.length ? setIsValidSubCat(true) : setIsValidSubCat(false);
		return;
	}
	return (
		<div>
			<div className="input-field">
				<input
					type="text"
					placeholder="Sub-category"
					value={subCat}
					onChange={(e) => stateChange(e)}
				></input>
			</div>
			{!isValidSubCat && (
				<p className="form-error-message">Please provide Sub-Category</p>
			)}
		</div>
	);
}
