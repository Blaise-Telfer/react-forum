import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { resetPassword } from "../authorization/userActions";
import { Message, Dimmer, Loader } from 'semantic-ui-react';


class PasswordReset extends Component{
	
	constructor() {
		super();
		this.state = {
			password: "",
			confirmPassword: ""
		};
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
		this.props.resetPassword(newPassword, this.props.history);
	};
	
	render(){
		const { password, confirmPassword } = this.state;
		const { loading, error, message } = this.props.resetPassword;
		
		return(
			<div className="reset-container">
				<div>
				  <h3>Password Change</h3>
				  <p>Enter your new password below</p>
				  <p>Note: this link can only be used once. Resubmit for a password change if needed.</p>
				</div>
				
				<form onSubmit={this.onSubmit} className="reset-form">
				  {loading ? (<Dimmer active inverted size="massive"><Loader inverted>Loading...</Loader></Dimmer>)
				  : 
				  message ? <Message className="success-text" content={message.message} />
				  :
				  error ? <Message className="error-text" content={error.message} />
				  : null}
			
				  <div className="input-field col s12">
					<input
					  placeholder="Password"
					  onChange={this.onChange}
					  value={password}
					  id="password"
					  type="password"
					  required
					/>
				  </div>
				  
				  <div className="input-field col s12">
					<input
					  placeholder="Confirm Password"
					  onChange={this.onChange}
					  value={confirmPassword}
					  id="confirmPassword"
					  type="password"
					  required
					/>
				  </div>
				  
				  <button type="submit" className="auth-button">
					Submit
				  </button>
				  
				</form>
				
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
  authInfo: state.authInfo,
  passwordReset: state.passwordReset
});

export default connect(mapStateToProps, {resetPassword})(PasswordReset);
