import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { verifyEmail } from "../authorization/actions";
import { alertService } from '../authorization/alertServices';
import Alert from "../components/alert";


class Verification extends Component{
	
	constructor() {
		super();
		this.state = {
			errors: {}
		};
	}
	
	componentDidMount(){
		const userInfo = {
			email: this.props.match.params.email,
			token: this.props.match.params.token
		};
		this.props.verifyEmail(userInfo, this.props.history);
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({
			errors: nextProps.errors
			});
		}
	}
	
	render(){
		const { errors, loading } = this.state;
		
		return(
			<div className="registration">
				<h3>hi here's your verification</h3>
				<span className="red-text">
					{alertService.error(errors.linkExpired)}
					{alertService.error(errors.alreadyUsed)}
					{errors.noToken}
					{errors.emailnotfound}
				</span>
			</div>
		);
	}
}


Verification.propTypes = {
	verifyEmail: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps, {verifyEmail})(Verification);
