import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import { logoutUser, deleteAccount } from "../authorization/actions";


class Settings extends Component{
	
	constructor(props){
        super(props)
        this.state = {
            posts: [],
			user: []
        }
    }
	
	onDeleteClick() {
		const currentUser = this.props.auth.user.username;
		axios.post(`/api/auth/delete`, {username: currentUser} )
		.then(res => {this.props.logoutUser()} 
		)
		.catch(err => {
            console.log(err)
        })
	};
	
	onLogoutClick = (e) => {
		e.preventDefault();
		this.props.logoutUser();
	};
	
	componentDidMount(){
		const currentUser = this.props.auth.user.username;
		const notUser = this.props.match.params.username !== this.props.auth.user.username;
		if(notUser){
			this.props.history.push(`/account/${currentUser}`)
		}
    }
	
	renderDeleteButton() {
		return (
			<div>
				<button className="btn btn-danger" data-toggle="modal" data-target="#deleteConfirmModal">Delete My Account</button>
			</div>
		);
	}
	
	renderDeleteConfirmModal() { 
		return (
		  <div className="modal fade" id="deleteConfirmModal" tabIndex="-1" role="dialog" aria-labelledby="deleteConfirmModalLabel" aria-hidden="true">
			<div className="modal-dialog" role="document">
			  <div className="modal-content">
				<div className="modal-header">
				  <h5 className="modal-title" id="deleteConfirmModalLabel">Confirm Delete</h5>
				  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				  </button>
				</div>
				<div className="modal-body">
				  <p>Are you sure you want to delete your account? <strong>Attention! </strong>This will permanently delete all your posts and bookmarks</p>
				</div>
				<div className="modal-footer">
				  <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
				  <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.onDeleteClick.bind(this)}>Delete My Account</button>
				</div>
			  </div>
			</div>
		  </div>
		);
	}
	
	render(){
		const notUser = this.props.match.params.username !== this.props.auth.user.username;
		const currentUser = this.props.match.params.username;
		console.log(this.props);
		
		return(
			<div className="settings">
				<h1>Account Settings</h1>
				
				{notUser ? 
					(null) 
					: 
					(<div>
					{this.renderDeleteButton()}
					{this.renderDeleteConfirmModal()}
					</div>)
				}
				
				<button className="btn btn-danger" onClick={this.onLogoutClick}>
					Logout
				</button>
				
				
				
			</div>
		)
	}
}

Settings.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {logoutUser, deleteAccount})(Settings);