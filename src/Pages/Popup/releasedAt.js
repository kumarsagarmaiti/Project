export default function ReleasedAt({
	releasedAt,
	setReleasedAt,
	isValidReleasedAt,
	setIsValidReleasedAt,
}) {
	function stateChange(e) {
		const val = e.target.value;
		setReleasedAt(val);
		val.length && releasedAtRegex.test(val)
			? setIsValidReleasedAt(true)
			: setIsValidReleasedAt(false);
		return;
	}
	return (
		<div>
			<div className="input-field">
				<input
					type="text"
					placeholder="Release Date"
					value={releasedAt}
					onChange={(e) => stateChange(e)}
				></input>
			</div>
			{!isValidReleasedAt && (
				<p className="form-error-message">
					Date should be in YYYY-MM-DD format and a valid date
				</p>
			)}
		</div>
	);
}

const releasedAtRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
