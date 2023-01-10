import React, { useState } from "react";
import Excerpt from "./excerpt";
import "./popup.css";
import Title from "./title";
import ReleasedAt from "./releasedAt";
import Isbn from "./ISBN";
import axios from "axios";

export default function EditPopup({ setEdit, bookId, token }) {
	let [title, setTitle] = useState("");
	let [isValidTitle, setIsValidTitle] = useState(true);

	let [excerpt, setExcerpt] = useState("");
	let [isValidExcerpt, setIsValidExcerpt] = useState(true);

	let [ISBN, setISBN] = useState("");
	let [isValidISBN, setIsValidISBN] = useState(true);

	let [category, setCategory] = useState("");
	let [isValidCategory, setIsValidCategory] = useState(true);

	let [subCat, setSubCat] = useState("");
	let [isValidSubCat, setIsValidSubCat] = useState(true);

	let [releasedAt, setReleasedAt] = useState("");
	let [isValidReleasedAt, setIsValidReleasedAt] = useState(true);

	const config = {
		headers: { "x-api-key": token },
	};
	const obj = {
		title,
		excerpt,
		ISBN,
		releasedAt,
		bookId,
	};
	function handleSubmit(e) {
		e.preventDefault();
		if (!(isValidTitle || isValidExcerpt || isValidISBN || isValidReleasedAt)) {
			alert("Please fill the form to add book");
			return;
		}

		axios
			.put("http://localhost:3001/books", obj, config)
			.then((response) => {
				alert("book updated successfully");
				window.location.reload();
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
						setEdit(false);
					}}
				>
					x
				</span>
				<h3 id="heading-addbook">Add Book</h3>
				<form className="addBook">
					<Title
						title={title}
						setTitle={setTitle}
						isValidTitle={isValidTitle}
						setIsValidTitle={setIsValidTitle}
					/>
					<Excerpt
						excerpt={excerpt}
						setExcerpt={setExcerpt}
						isValidExcerpt={isValidExcerpt}
						setIsValidExcerpt={setIsValidExcerpt}
					/>
					<Isbn
						ISBN={ISBN}
						setISBN={setISBN}
						isValidISBN={isValidISBN}
						setIsValidISBN={setIsValidISBN}
					/>
					<ReleasedAt
						releasedAt={releasedAt}
						setReleasedAt={setReleasedAt}
						isValidReleasedAt={isValidReleasedAt}
						setIsValidReleasedAt={setIsValidReleasedAt}
					/>
				</form>
				<button className="add-book-button" onClick={(e) => handleSubmit(e)}>
					Edit Book
				</button>
			</div>
		</div>
	);
}
