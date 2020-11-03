import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { forgotPassword } from "../authorization/actions";
import { alertService } from '../authorization/alertServices';


class LoginForgot extends Component{
	
	constructor() {
		super();
		this.state = {
			email: "",
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
	
	onChange = (e) => {
		this.setState({ [e.target.id]: e.target.value });
	};
	
	onSubmit = (e) => {
		e.preventDefault();
		const userData = {email: this.state.email};
		this.props.forgotPassword(userData, this.props.history);
		
	};
	
	render(){
		const { errors } = this.state;
		
		return(
			<div className="forgot-container">
				<div>
				  <h3>Forgot Your Password?</h3>
				</div>
				
				<form onSubmit={this.onSubmit} className="forgot-form">
				  <div className="input-field col s12">
					<label htmlFor="email">Enter your email and check you inbox for the reset link</label>
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
				  
				  <button type="submit">
					Submit
				  </button>
				  <Link to="/login"><button className="cancel-button">Cancel</button></Link>
				  
				</form>
			</div>
		);
	}
}


LoginForgot.propTypes = {
	forgotPassword: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps, {forgotPassword})(LoginForgot);
