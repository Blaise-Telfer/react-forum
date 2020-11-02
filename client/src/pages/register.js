import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { registerUser } from "../authorization/actions";
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
			confirmPassword: "",
			errors: {}
		};
	}
	
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({
			errors: nextProps.errors
			});
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
		const { errors } = this.state;
		
		return(
			<div className="register-container">
				
				<div>
				  <h1>Sign Up</h1>
				</div>
				
				<form onSubmit={this.onSubmit} className="register-form">
				  
				  <div>
					<input
					  placeholder="First Name"
					  onChange={this.onChange}
					  value={this.state.firstname}
					  error={errors.firstname}
					  id="firstname"
					  type="text"
					  className={classnames("register-input", {
						invalid: errors.firstname
					  })}
					/>
					<br/>
					<span className="red-text">{errors.firstname}</span>
				  </div>
				  
				  <div>
					<input
					  placeholder="Last Name"
					  onChange={this.onChange}
					  value={this.state.lastname}
					  error={errors.lastname}
					  id="lastname"
					  type="text"
					  className={classnames("register-input", {
						invalid: errors.lastname
					  })}
					/>
					<br/>
					<span className="red-text">{errors.lastname}</span>
				  </div>
				  
				  <div>
					<input
					  placeholder="Username"
					  onChange={this.onChange}
					  value={this.state.username}
					  error={errors.username}
					  id="username"
					  type="text"
					  className={classnames("register-input", {
						invalid: errors.username
					  })}
					/>
					<br/>
					<span className="red-text">{errors.username}</span>
				  </div>
				  
				  <div>
					<input
					  placeholder="Email"
					  onChange={this.onChange}
					  value={this.state.email}
					  error={errors.email}
					  id="email"
					  type="email"
					  className={classnames("register-input", {
						invalid: errors.email
					  })}
					/>
					<br/>
					<span className="red-text">{errors.email}</span>
				  </div>
				  
				  <div>
					<input
					  placeholder="City"
					  onChange={this.onChange}
					  value={this.state.location}
					  error={errors.location}
					  id="location"
					  type="text"
					  className={classnames("register-input", {
						invalid: errors.location
					  })}
					/>
					<br/>
					<span className="red-text">{errors.location}</span>
				  </div>
				  
				  <div>
					<input
					  placeholder="Password"
					  onChange={this.onChange}
					  value={this.state.password}
					  error={errors.password}
					  id="password"
					  type="password"
					  className={classnames("register-input", {
						invalid: errors.password
					  })}
					/>
					<br/>
					<span className="red-text">{errors.password}</span>
				  </div>
				  
				  <div>
					<input
					  placeholder="Confirm Password"
					  onChange={this.onChange}
					  value={this.state.confirmPassword}
					  error={errors.confirmPassword}
					  id="confirmPassword"
					  type="password"
					  className={classnames("register-input", {
						invalid: errors.confirmPassword
					  })}
					/>
					<br/>
					<span className="red-text">{errors.confirmPassword}</span>
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

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));