export default function Excerpt({
	excerpt,
	setExcerpt,
	isValidExcerpt,
	setIsValidExcerpt,
}) {
	function stateChange(e) {
		let val = e.target.value;
		setExcerpt(val);
		val.length ? setIsValidExcerpt(true) : setIsValidExcerpt(false);
		return;
	}
	return (
		<div>
			<div className="input-field">
				<input
					type="text"
					placeholder="Excerpt"
					value={excerpt}
					onChange={(e) => stateChange(e)}
				></input>
			</div>
			{!isValidExcerpt && (
				<p className="form-error-message">Please provide excerpt</p>
			)}
		</div>
	);
}
