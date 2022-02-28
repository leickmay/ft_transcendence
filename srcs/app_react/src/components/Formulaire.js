import react from "react";
import axios from "axios";

export default function App() {
  const [email, setEmail] = react.useState("");
  const [password, setPassword] = react.useState("");
  const [acceptedTerms, setAcceptedTerms] = react.useState(false);

  const handleSubmit = (event) => {
    console.log(`
      Email: ${email}
      Password: ${password}
      Accepted Terms: ${acceptedTerms}
    `);
	const postData = {
		email: email ,
		password: password
	}
	const apiURL = "http://localhost:3000/users/new";
	axios({
		method: 'get',
		url: apiURL,
		data: postData,
	})
		.then(response => console.log('Success: ', response))
		.catch(error => console.log('Error: ', error));

    event.preventDefault();
  }


  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Account</h1>

      <label>
        Email:
        <input
          name="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required />
      </label>
      <br/>
      <label>
        Password:
        <input
          name="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required />
      </label>
<br/>
      <label>
        <input
          name="acceptedTerms"
          type="checkbox"
          onChange={e => setAcceptedTerms(e.target.value)}
          required />
        I accept the terms of service        
      </label>
<br/>
      <button>Submit</button>
    </form>
  );
}
