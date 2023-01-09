import React, { useState } from "react";
import "./popup.css";

export default function Popup({ setIsOpen }) {
	let [title, setTitle] = useState("");
	let [excerpt, setExcerpt] = useState("");
	let [ISBN, setISBN] = useState("");
	let [category, setCategory] = useState("");
	let [subCat, setSubCat] = useState("");
	let [releasedAt, setReleasedAt] = useState("");

	return (
		<div className="popup-box">
			<div id="popup-box">
				<span className="close-icon" onClick={(_) => setIsOpen(false)}>
					x
				</span>
				<h3 id="heading-addbook">Add Book</h3>
				<form className="addBook">
					<div className="input-field">
						<input
							type="text"
							placeholder="Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						></input>
					</div>
					<div className="input-field">
						<input
							type="text"
							placeholder="Excerpt"
							value={excerpt}
							onChange={(e) => setExcerpt(e.target.value)}
						></input>
					</div>
					<div className="input-field">
						<input
							type="text"
							placeholder="ISBN"
							value={ISBN}
							onChange={(e) => setISBN(e.target.value)}
						></input>
					</div>
					<div className="input-field">
						<input
							type="text"
							placeholder="Category"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
						></input>
					</div>
					<div className="input-field">
						<input
							type="text"
							placeholder="Sub-category"
							value={subCat}
							onChange={(e) => setSubCat(e.target.value)}
						></input>
					</div>
					<div className="input-field">
						<input
							type="text"
							placeholder="Title"
							value={releasedAt}
							onChange={(e) => setReleasedAt(e.target.value)}
						></input>
					</div>
				</form>
					<button className="add-book-button">Add Book</button>
			</div>
		</div>
	);
}
