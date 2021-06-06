import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loginUser } from "../authorization/userActions";
import { Message, Dimmer, Loader } from 'semantic-ui-react';


class Login extends Component{
	 
	constructor() {
		super();
		this.state = {
			email: "",
			password: ""
		};
	}
	
	componentDidMount() {
		if (this.props.authInfo.isAuthenticated) {
			this.props.history.push("/dashboard");
		}
	}
	
	onChange = e => {
		this.setState({ [e.target.id]: e.target.value });
	};
	
	onSubmit = e => {
		e.preventDefault();
		// create a string for an HTTP body message
		const email = encodeURIComponent(this.state.email);
		const password = encodeURIComponent(this.state.password);
		const formData = `email=${email}&password=${password}`;
		this.props.loginUser(formData, this.props.history);
	};
	
	render(){
		const { errors, email, password } = this.state;
		const { loading, error } = this.props.authInfo;
		const { message } = this.props.authRegister;
		
		return(
			<div className="login-container">
				
				<div>
				  <h1>Sign In</h1>
				</div>
				
				<form onSubmit={this.onSubmit} className="login-form">
				  {loading ? (<Dimmer active inverted size="massive"><Loader inverted>Loading...</Loader></Dimmer>)
				  : 
				  message ? <Message className="success-text" content={message.message} />
				  :
				  error ? <Message className="error-text" content={error.message} />
				  : null}
				  
				  <div >
					<input
					  placeholder="Email"
					  onChange={this.onChange}
					  value={email}
					  id="email"
					  type="email"
					  required
					/>
				  </div>
				  
				  <div >
					<input
					  placeholder="Password"
					  onChange={this.onChange}
					  value={password}
					  id="password"
					  type="password"
					  required
					/>
				  </div>
				  
				  <button type="submit" className="auth-button">
					Login
				  </button>
				  
				  <div>
					<p>Don't have an account yet?</p>
					<Link to="/register">Sign Up</Link>
					<br/>
					<Link to="/forgot-password">Forgot Password?</Link>
				  </div>
				</form>
				
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
  authRegister: state.authRegister,
  authInfo: state.authInfo
});


export default connect(mapStateToProps, { loginUser })(Login);