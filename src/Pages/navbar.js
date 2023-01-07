import "./Home/homePage.css";

export default function Navbar() {
	return (
		<nav className="navbar">
			<div className="container-fluid">
				<a className="navbar-brand" href="/">
					Booksly
				</a>
				<div id="navbarNav">
					<ul className="navbar-nav">
						<li className="nav-item">
							<a className="nav-link" href="/register">
								Register
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/login">
								Login
							</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}
