export default function Isbn({ ISBN, setISBN, isValidISBN, setIsValidISBN }) {
	function stateChange(e) {
		const val = e.target.value;
		setISBN(val);
		val.length && ISBNregex.test(val)
			? setIsValidISBN(true)
			: setIsValidISBN(false);
		return;
	}
	return (
		<div>
			<div className="input-field">
				<input
					type="text"
					placeholder="ISBN"
					value={ISBN}
					onChange={(e) => stateChange(e)}
				></input>
			</div>
			{!isValidISBN && (
				<p className="form-error-message">Please provide a valid ISBN</p>
			)}
		</div>
	);
}

const ISBNregex =
	/^(?:ISBN(?:-13)?:?\ )?(?=[0-9]{13}$|(?=(?:[0-9]+[-\ ]){4})[-\ 0-9]{17}$)97[89][-\ ]?[0-9]{1,5}[-\ ]?[0-9]+[-\ ]?[0-9]+[-\ ]?[0-9]$/;
