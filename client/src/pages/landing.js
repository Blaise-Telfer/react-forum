import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";


class Landing extends Component{
	
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

const mapStateToProps = (state) => ({
  authinfo: state.authinfo
});

export default connect(mapStateToProps)(Landing);