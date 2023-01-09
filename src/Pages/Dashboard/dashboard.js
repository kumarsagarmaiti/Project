import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "./dashboard.css";
import Popup from "./popup";

export default function Dashboard() {
	let [isOpen, setIsOpen] = useState(false);

	const { id } = useParams();
	let userDetails = window.localStorage.getItem(id);
	userDetails = JSON.parse(userDetails);
	const config = {
		headers: { "x-api-key": userDetails.token },
		userId: id,
	};
	let arr = [];
	let flag = false;
	axios
		.get("http://localhost:3001/books", config)
		.then((response) => {
			arr = response.data.data;
			flag = arr.length == 0 ? false : true;
		})
		.catch((e) => console.log(e));

	function handleAddBook(e) {
    e.preventDefault()
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
				<div className="box">
					<button className="add-book" onClick={(e) => handleAddBook(e)}>
						Add Book
					</button>
				</div>
			</div>
			{isOpen && <Popup setIsOpen={setIsOpen}/>}
		</div>
	);
}
