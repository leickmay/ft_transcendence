import './signin.scss'

export function SignIn() {
	return (
		<main className="form-signin">
			<img className="mb-4" src="https://getbootstrap.com/docs/5.1/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" />
			<form>
				<h2 className="h3 mb-3 fw-normal">Sign in with email</h2>
				<div className="form-floating">
					<input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
					<label>Email address</label>
				</div>
				<div className="form-floating">
					<input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
					<label>Password</label>
				</div>
				<div className="checkbox mb-3">
					<label>
						<input type="checkbox" value="remember-me"/> Remember me
					</label>
				</div>
				<button className="w-100 btn btn-sm btn-secondary" type="submit">Sign in</button>
			</form>
			<p className="mt-3 mb-3 text-muted">&copy; 1961–2967</p>
		</main>
	);
}
