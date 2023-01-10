import "./popup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DeletePopup({ setOnDelete, bookId, token, id }) {
	const navigate = useNavigate();

	const config = {
		headers: { "x-api-key": token },
	};

	function handleSubmit(e) {
		e.preventDefault();
		axios
			.delete(`http://localhost:3001/books/${bookId}`, config)
			.then((response) => {
				alert("book deleted successfully");
				navigate(`/dashboard/${id}`);
				return;
			})
			.catch((e) => console.log(e));
		return;
	}

	return (
		<div className="popup-box">
			<div id="popup-box">
				<span
					className="close-icon"
					onClick={(e) => {
						e.preventDefault();
						setOnDelete(false);
					}}
				>
					x
				</span>
				<h3 id="heading-addbook">Are you sure you want to delete book?</h3>
				<button className="add-book-button" onClick={(e) => handleSubmit(e)}>
					Confirm
				</button>
			</div>
		</div>
	);
}
