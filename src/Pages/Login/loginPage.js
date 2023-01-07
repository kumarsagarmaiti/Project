import "./loginPage.css";

export default function LoginPage() {
	return (
		<div>
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
			<div className="container">
				<div className="form-box">
					<h1>Login</h1>
					<form>
						<div className="input-group">
							<div className="input-field">
								<input type="email" placeholder="E-mail" />
							</div>
							<div className="input-field">
								<input type="password" placeholder="Password" />
							</div>
						</div>
						<div className="btn-field">
							<button type="button">Login</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
