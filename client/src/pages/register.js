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
	
	handleSubmit = e => {
		console.log("Trying to submit");
		e.preventDefault();
	};
	
	
	render(){
		const { errors } = this.state;
		
		return(
			<div className="registration">
				
				<div>
				  <h4>
					<b>Register</b> below
				  </h4>
				  <p className="grey-text text-darken-1">
					Already have an account? <Link to="/login">Log in</Link>
				  </p>
				</div>
				
				<form onSubmit={this.onSubmit} className="registry">
				  
				  <div className="input-field col s12">
					<label htmlFor="firstname">First Name</label>
					<br/>
					<input
					  placeholder="First Name"
					  onChange={this.onChange}
					  value={this.state.firstname}
					  error={errors.firstname}
					  id="firstname"
					  type="text"
					  className={classnames("", {
						invalid: errors.firstname
					  })}
					/>
					<br/>
					<span className="red-text">{errors.firstname}</span>
				  </div>
				  
				  <div className="input-field col s12">
					<label htmlFor="lastname">Last Name</label>
					<br/>
					<input
					  placeholder="Last Name"
					  onChange={this.onChange}
					  value={this.state.lastname}
					  error={errors.lastname}
					  id="lastname"
					  type="text"
					  className={classnames("", {
						invalid: errors.lastname
					  })}
					/>
					<br/>
					<span className="red-text">{errors.lastname}</span>
				  </div>
				  
				  <div className="input-field col s12">
					<label htmlFor="username">Username</label>
					<br/>
					<input
					  placeholder="Username"
					  onChange={this.onChange}
					  value={this.state.username}
					  error={errors.username}
					  id="username"
					  type="text"
					  className={classnames("", {
						invalid: errors.username
					  })}
					/>
					<br/>
					<span className="red-text">{errors.username}</span>
				  </div>
				  
				  <div className="input-field col s12">
					<label htmlFor="email">Email</label>
					<br/>
					<input
					  placeholder="Email"
					  onChange={this.onChange}
					  value={this.state.email}
					  error={errors.email}
					  id="email"
					  type="email"
					  className={classnames("", {
						invalid: errors.email
					  })}
					/>
					<br/>
					<span className="red-text">{errors.email}</span>
				  </div>
				  
				  <div className="input-field col s12">
					<label htmlFor="location">Your Location</label>
					<br/>
					<input
					  placeholder="City"
					  onChange={this.onChange}
					  value={this.state.location}
					  error={errors.location}
					  id="location"
					  type="text"
					  className={classnames("", {
						invalid: errors.location
					  })}
					/>
					<br/>
					<span className="red-text">{errors.location}</span>
				  </div>
				  
				  <div className="input-field col s12">
					<label htmlFor="password">Password</label>
					<br/>
					<input
					  placeholder="Password"
					  onChange={this.onChange}
					  value={this.state.password}
					  error={errors.password}
					  id="password"
					  type="password"
					  className={classnames("", {
						invalid: errors.password
					  })}
					/>
					<br/>
					<span className="red-text">{errors.password}</span>
				  </div>
				  
				  <div className="input-field col s12">
					<label htmlFor="confirmPassword">Confirm Password</label>
					<br/>
					<input
					  placeholder="Confirm Password"
					  onChange={this.onChange}
					  value={this.state.confirmPassword}
					  error={errors.confirmPassword}
					  id="confirmPassword"
					  type="password"
					  className={classnames("", {
						invalid: errors.confirmPassword
					  })}
					/>
					<br/>
					<span className="red-text">{errors.confirmPassword}</span>
				  </div>
				  
				<div className="agreement">
					  <a href="#terms">Please read our Terms and Conditions</a>
					  <br/>
					  <input type="checkbox" required />
					  <a> I agree to the Terms and Conditions</a>
				</div>
				  
				<button className="btn btn-primary" type="submit">
					Sign up
				</button>
				  
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