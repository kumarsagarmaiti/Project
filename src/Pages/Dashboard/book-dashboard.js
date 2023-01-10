import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import EditPopup from "../Popup/editPopup";
import DeletePopup from "../Popup/deletePopup";

export default function BookDashboard() {
	const navigate = useNavigate();

	let [book, setBook] = useState(null);
	let [flag, setFlag] = useState(true);
	let [edit, setEdit] = useState(false);
	let [onDelete, setOnDelete] = useState(false);

	const { bookId, id } = useParams();
	let userDetails = window.localStorage.getItem(id);
	userDetails = JSON.parse(userDetails);
	const config = {
		headers: { "x-api-key": userDetails.token },
	};
	useEffect(() => {
		if (!book) {
			axios
				.get(`http://localhost:3001/${bookId}/books`, config)
				.then((response) => {
					setFlag(false);
					setBook(response.data.data);
					return;
				})
				.catch((e) => {
					if (e.response.data.message.message == "jwt expired") {
						alert("session expired");
						navigate("/login");
					}
				});
		}
	}, []);

	return (
		<div>
			{!flag && (
				<div>
					<h1>{book.title}</h1>
					<button
						onClick={(e) => {
							e.preventDefault();
							setEdit(true);
						}}
					>
						Edit
					</button>
					{edit && (
						<EditPopup
							setEdit={setEdit}
							token={userDetails.token}
							bookId={bookId}
						/>
					)}
					<button
						onClick={(e) => {
							e.preventDefault();
							setOnDelete(true);
						}}
					>
						Delete
					</button>
					{onDelete && (
						<DeletePopup
							setOnDelete={setOnDelete}
							token={userDetails.token}
							id={id}
							bookId={bookId}
						/>
					)}
				</div>
			)}
		</div>
	);
}
