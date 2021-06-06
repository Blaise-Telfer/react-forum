import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { logoutUser } from "../authorization/userActions";


class Navbar extends Component{

  onLogoutClick = (e) => {
	e.preventDefault();
	this.props.logoutUser();
  };
  
  render() {
	const { onLogoutClick, authInfo } = this.props;
	
	return (
	  <nav className="mb-4 navbar navbar-expand-md navbar-dark bg-unique">
	    <a className="navbar-brand" href="/dashboard">Teach Meet</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent-3" aria-controls="navbarSupportedContent-3" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
		
		{!authInfo.isAuthenticated ? (
		  <div className="collapse navbar-collapse" id="navbarSupportedContent-3">
			<ul className="navbar-nav ml-auto nav-flex-icons">
			  <li className="nav-item">
			    <a className="nav-link" href="/">Home</a>
			  </li>
			  <li className="nav-item">
			    <a className="nav-link" href="/login">Login</a>
			  </li>
			  <li className="nav-item">
			    <a className="nav-link" href="/register">Register</a>
			  </li>
			</ul>
		  </div>
		)
		:
		authInfo.isAuthenticated && authInfo.user.role == "admin" ? (
		  <div className="collapse navbar-collapse" id="navbarSupportedContent-3">
			<ul className="navbar-nav ml-auto nav-flex-icons">
			  <li className="nav-item">
			    <a className="nav-link" href="/">Home</a>
			  </li>
			  <li className="nav-item">
			    <a className="nav-link" href="/dashboard">Dashboard</a>
			  </li>
			  <li className="nav-item">
			    <a className="nav-link" href={`/profile/${authInfo.user.username}`} >Admin Panel</a>
			  </li>
			  <li className="nav-item">
			    <a className="nav-link" onClick={this.onLogoutClick}>Logout</a>
			  </li>
			</ul>
		  </div>
		) 
		:
		authInfo.isAuthenticated ? (
		  <div className="collapse navbar-collapse" id="navbarSupportedContent-3">
			<ul className="navbar-nav ml-auto nav-flex-icons">
			  <li className="nav-item">
			    <a className="nav-link" href="/">Home</a>
			  </li>
			  <li className="nav-item">
			    <a className="nav-link" href="/dashboard">Dashboard</a>
			  </li>
			  <li className="nav-item">
			    <a className="nav-link" href={`/account/${authInfo.user.username}`} >Account</a>
			  </li>
			  <li className="nav-item">
			    <a className="nav-link" onClick={this.onLogoutClick}>Logout</a>
			  </li>
			</ul>
		  </div>
		)
		:
		( null )}
		
	  </nav>
	);
  }
};


const mapStateToProps = state => ({
  authInfo: state.authInfo
});


export default connect(mapStateToProps, {logoutUser})(Navbar);