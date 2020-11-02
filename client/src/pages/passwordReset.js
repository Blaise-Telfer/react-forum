import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { passwordReset } from "../authorization/actions";
import { alertService } from '../authorization/alertServices';


class PasswordReset extends Component{
	
	constructor() {
		super();
		this.state = {
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
	
	onSubmit = (e) => {
		e.preventDefault();

		const newPassword = {
			password: this.state.password,
			confirmPassword: this.state.confirmPassword,
			email: this.props.match.params.email,
			token: this.props.match.params.token
		};
		this.props.passwordReset(newPassword, this.props.history);
	};
	
	render(){
		const { errors } = this.state;
		
		return(
			<div className="reset-container">
				<div>
				  <h3>Password Change</h3>
				  <p>Enter your new password below</p>
				  <p>Note: this link can only be used once. Resubmit for a password change if needed.</p>
				</div>
				
				<form onSubmit={this.onSubmit} className="reset-form">
				  
				  <div className="input-field col s12">
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
				  
				  <button type="submit" className="auth-button">
					Submit
				  </button>
				  
				</form>
				
				<span className="red-text">
					{errors.noUser}
					{errors.usedToken}
					{errors.noToken}
					{errors.expired}
				</span>
			</div>
		);
	}
}


PasswordReset.propTypes = {
	passwordReset: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps, {passwordReset})(PasswordReset);
