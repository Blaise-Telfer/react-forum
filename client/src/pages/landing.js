import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";


class Landing extends Component{
	
	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push("/dashboard");
		}
	}
	
	render(){
		return(
			<div className="landing-page">
				<h1>Welcome to Teach Meet</h1>
				<Link to="/login"><button> Login </button></Link>
				<Link to="/register"><button> Register </button></Link>
				<br/>
				<a href="/dashboard">Or check out our dashboard first!</a>
				
				<div className="description">
					<p>A forum for teachers, tutors and students alike!</p>
					<p>Find and hire a new teacher for any subject</p>
					<p>or</p>
					<p>Advertise your skills and land a new teaching gig</p>
				</div>
			</div>
		)
	}
}


Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);