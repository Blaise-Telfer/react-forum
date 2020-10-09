import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { loginUser } from "../authorization/actions";


class Login extends Component{
	 
	constructor() {
		super();
		this.state = {
			email: "",
			password: "",
			errors: {}
		};
	}
	
	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push("/dashboard");
		}
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.auth.isAuthenticated) {
			this.props.history.push("/dashboard");
		}
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
		const userData = {
			email: this.state.email,
			password: this.state.password
		};
		this.props.loginUser(userData);
	};
	
	render(){
		const { errors } = this.state;
		
		return(
			<div className="login">
				
				<div className="col s12" style={{ paddingLeft: "11.250px" }}>
				  <h4>
					<b>Login</b> below
				  </h4>
				  <p className="grey-text text-darken-1">
					Don't have an account? <Link to="/register">Register</Link>
				  </p>
				</div>
				
				<form onSubmit={this.onSubmit} className="login-form">
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
						invalid: errors.email || errors.emailnotfound
					  })}
					/>
					<br/>
					<span className="red-text">
					  {errors.email}
					  {errors.emailnotfound}
					</span>
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
						invalid: errors.password || errors.passwordincorrect
					  })}
					/>
					<br/>
					<span className="red-text">
					  {errors.password}
					  {errors.passwordincorrect}
					</span>
				  </div>
				  
				  <button className="btn btn-primary" type="submit">
						Login
				  </button>
				  
				</form>
			</div>
		)
	}
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);