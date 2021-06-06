import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { verifyCheck } from "../authorization/userActions";
import { Message, Dimmer, Loader } from 'semantic-ui-react';


class Verification extends Component{
	
	componentDidMount(){
		const userInfo = {
			email: this.props.match.params.email,
			token: this.props.match.params.token
		};
		this.props.verifyCheck(userInfo, this.props.history);
	}
	
	render(){
		const { loading, error, message } = this.props.verifyAccount;
		
		return(
			<div className="registration">
				<h3>hi here's your verification</h3>
				{loading ? (<Dimmer active inverted size="massive"><Loader inverted>Loading...</Loader></Dimmer>)
				: 
				message ? <Message className="success-text" content={message.message} />
				:
				error ? <Message className="error-text" content={error.message} />
				: null}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
  authInfo: state.authInfo,
  verifyAccount: state.verifyAccount
});

export default connect(mapStateToProps, {verifyCheck})(Verification);
