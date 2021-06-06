import React, { Component } from "react";
import { Link, withRouter  } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../authorization/userActions";
import { Message, Dimmer, Loader } from 'semantic-ui-react';
import Accordion from "../components/accordion";


class Register extends Component{
	
	constructor() {
		super();
			this.state = {
			username: "",
			firstname: "",
			lastname: "",
			email: "",
			location: "",
			password: "",
			confirmPassword: ""
		};
	}
	
	componentDidMount() {
		if (this.props.authInfo.isAuthenticated) {
	    	this.props.history.push("/");
		}
	}
	
	onChange = e => {
		this.setState({ [e.target.id]: e.target.value });
	};
	
	onSubmit = e => {
		e.preventDefault();

		const newUser = {
			username: this.state.username,
			firstname: this.state.firstname,
			lastname: this.state.lastname,
			email: this.state.email,
			location: this.state.location,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword
		};
		this.props.registerUser(newUser, this.props.history);
	};
	
	
	render(){
	  const { username, firstname, lastname, email, location, password, confirmPassword } = this.state;
	  const { loading, error } = this.props.authRegister;
		
		return(
			<div className="register-container">
				
				<div>
				  <h1>Sign Up</h1>
				</div>
				
				<form onSubmit={this.onSubmit} className="register-form">
				  {loading ? (<Dimmer active inverted size="massive"><Loader inverted>Loading...</Loader></Dimmer>)
				  : 
				  error ? <Message className="error-text" content={error.message} />
				  : null}
				  
				  <div>
					<input
					  placeholder="First Name"
					  onChange={this.onChange}
					  value={firstname}
					  id="firstname"
					  type="text"
					  required
					/>
				  </div>
				  
				  <div>
					<input
					  placeholder="Last Name"
					  onChange={this.onChange}
					  value={lastname}
					  id="lastname"
					  type="text"
					  required
					/>
				  </div>
				  
				  <div>
					<input
					  placeholder="Username"
					  onChange={this.onChange}
					  value={username}
					  id="username"
					  type="text"
					  required
					/>
				  </div>
				  
				  <div>
					<input
					  placeholder="Email"
					  onChange={this.onChange}
					  value={email}
					  id="email"
					  type="email"
					  required
					/>
				  </div>
				  
				  <div>
					<input
					  placeholder="City"
					  onChange={this.onChange}
					  value={location}
					  id="location"
					  type="text"
					  required
					/>
				  </div>
				  
				  <div>
					<input
					  placeholder="Password"
					  onChange={this.onChange}
					  value={password}
					  id="password"
					  type="password"
					  required
					/>
				  </div>
				  
				  <div>
					<input
					  placeholder="Confirm Password"
					  onChange={this.onChange}
					  value={confirmPassword}
					  id="confirmPassword"
					  type="password"
					  required
					/>
				  </div>
				  
				  <div className="agreement">
					  <input type="checkbox" required />
					  <a href="#terms">Accept Terms & Conditions</a>
				  </div>
				  
				  <button type="submit" className="auth-button">
					Sign up
				  </button>
				  
				  <p>Already have an account?</p>
				  <Link to="/login">Sign In</Link>
				  
				</form>
				
				<div id="terms">
					<Accordion />
				</div>
				
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
  authRegister: state.authRegister,
  authInfo: state.authInfo
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));