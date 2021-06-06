import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserAlt} from "@fortawesome/free-solid-svg-icons/faUserAlt";
import { connect } from "react-redux";
import { logoutUser } from "../authorization/userActions";


class Profile extends Component{
	
	constructor(props){
        super(props)
        this.state = {
            posts: []
        }
    }
	
	onLogoutClick = (e) => {
		e.preventDefault();
		this.props.logoutUser();
	};
	
	componentDidMount(){
		const accountName = this.props.match.params.username;
		const currentUser = this.props.authInfo.user.username;
		
		axios.get(`/api/users/user/${currentUser}`).then(res => {
			this.setState({
                user: res.data.user
            })
			console.log(res)
		});
    }
	
	render(){
		const yesAdmin = this.props.authInfo.user.role == "admin";
		const accountName = this.props.match.params.username;
		const currentUser = this.props.authInfo.user.username;
		console.log(this.props);
		
		return(
			<div className="App">
				<h1>{currentUser}'s Profile, Admin Supreme</h1>
				<h3>You are logged in as {currentUser}</h3>
				
				<div className="col-sm-3 p-sm-2">
					<div className="card bg-primary text-white shadow-lg">
						<div className="card-body">
							<h5 className="card-title">Users</h5>
							<p className="card-text">With supporting text below as a natural lead-in to
							 additional content.</p>
							<Link to="/userPanel" className="btn btn-light"><FontAwesomeIcon className="text-primary" icon={faUserAlt}/>Manage Users</Link>
						</div>
					</div>
				</div>
				<div className="col-sm-3 p-sm-2">
					<div className="card bg-primary text-white shadow-lg">
						<div className="card-body">
							<h5 className="card-title">Posts</h5>
							<p className="card-text">With supporting text below as a natural lead-in to
							 additional content.</p>
							<Link to="/postPanel" className="btn btn-light"><FontAwesomeIcon className="text-primary" icon={faUserAlt}/>Manage Posts</Link>
						</div>
					</div>
				</div>
				
				
			</div>
		)
	}
}

const mapStateToProps = state => ({
  authInfo: state.authInfo
});

export default connect(mapStateToProps, {logoutUser})(Profile);