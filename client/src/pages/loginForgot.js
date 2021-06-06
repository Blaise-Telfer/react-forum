import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { forgotPassword } from "../authorization/userActions";
import { Message, Dimmer, Loader } from 'semantic-ui-react';


class LoginForgot extends Component{
	
	constructor() {
		super();
		this.state = {
			email: ""
		};
	}
	
	onChange = (e) => {
		this.setState({ [e.target.id]: e.target.value });
	};
	
	onSubmit = (e) => {
		e.preventDefault();
		const userData = {email: this.state.email};
		this.props.forgotPassword(userData, this.props.history);
		
	};
	
	render(){
		const { email } = this.state;
		const { loading, error, message } = this.props.passwordForgot;
		
		return(
			<div className="forgot-container">
				<div>
				  <h3>Forgot Your Password?</h3>
				</div>
				
				<form onSubmit={this.onSubmit} className="forgot-form">
				  {loading ? (<Dimmer active inverted size="massive"><Loader inverted>Loading...</Loader></Dimmer>)
				  : 
				  message ? <Message className="success-text" content={message.message} />
				  :
				  error ? <Message className="error-text" content={error.message} />
				  : null}
				  
				  <div className="input-field col s12">
					<label htmlFor="email">Enter your email and check you inbox for the reset link</label>
					<br/>
					<input
					  placeholder="Email"
					  onChange={this.onChange}
					  value={email}
					  id="email"
					  type="email"
					  required
					/>
				  </div>
				  
				  <button type="submit">
					Submit
				  </button>
				  <Link to="/login"><button className="cancel-button">Cancel</button></Link>
				  
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
  authInfo: state.authInfo,
  passwordForgot: state.passwordForgot
});

export default connect(mapStateToProps, {forgotPassword})(LoginForgot);
