import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Popup from "../Popup/popup";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import BookDashboard from "./book-dashboard";

export default function Dashboard() {
	const navigate = useNavigate();
	let [isOpen, setIsOpen] = useState(false);
	let [flag, setFlag] = useState(true);
	let [books, setBooks] = useState([]);

	const { id } = useParams();
	let userDetails = window.localStorage.getItem(id);
	userDetails = JSON.parse(userDetails);
	const config = {
		headers: { "x-api-key": userDetails.token },
		userId: id,
	};
	let arr = [];

	useEffect(() => {
		axios
			.get("http://localhost:3001/books", config)
			.then((response) => {
				setBooks(response.data.data);
				setFlag(false);
				return;
			})
			.catch((e) => {
				console.log(e)
				if (e.response.data.msg.message == "jwt expired")
					alert("session expired");
				navigate("/login");
			});
	}, []);

	function handleAddBook(e) {
		e.preventDefault();
		setIsOpen(true);
	}

	return (
		<div>
			<div>
				<nav className="navbar">
					<div className="container-fluid">
						<a className="navbar-brand" href="/">
							Booksly
						</a>
						<div id="navbarNav">
							<ul className="navbar-nav">
								<li className="nav-item">
									<a className="nav-link" href="/login">
										Logout
									</a>
								</li>
							</ul>
						</div>
					</div>
				</nav>
				<h1 id="welcome">Welcome {userDetails.name}</h1>
			</div>
			<div className="book-box">
				{!flag &&
					books.map((book) => {
						return (
							<div className="box" key={book["_id"]}>
								<div>
									<p>{book.title}</p>
								</div>
								<button
									onClick={(e) => {
										e.preventDefault();
										navigate(`/dashboard/${id}/${book["_id"]}/books`);
										return;
									}}
								>
									Show Details
								</button>
							</div>
						);
					})}
				<div className="box">
					<button className="add-book" onClick={(e) => handleAddBook(e)}>
						Add Book
					</button>
				</div>
			</div>
			{isOpen && (
				<Popup setIsOpen={setIsOpen} id={id} token={userDetails.token} />
			)}
      <BookDashboard token={userDetails.token}/>
		</div>
	);
}
