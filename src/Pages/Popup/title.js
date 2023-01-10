export default function Category({
	title,
	setTitle,
	isValidTitle,
	setIsValidTitle,
}) {
	function stateChange(e) {
		let val = e.target.value;
		setTitle(val);
		val.length ? setIsValidTitle(true) : setIsValidTitle(false);
		return;
	}
	return (
		<div>
			<div className="input-field">
				<input
					type="text"
					placeholder="Title"
					value={title}
					onChange={(e) => stateChange(e)}
				></input>
			</div>
			{!isValidTitle && (
				<p className="form-error-message">Please provide title</p>
			)}
		</div>
	);
}
