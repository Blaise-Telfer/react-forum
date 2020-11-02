import React, { Component, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { logoutUser } from "../authorization/actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookmark} from "@fortawesome/free-regular-svg-icons";


class Navbar extends Component{
	
	constructor(props){
        super(props)
        this.state= {
			
        }
    }
	
	onLogoutClick = e => {
		e.preventDefault();
		this.props.logoutUser();
	};
	
	render() {
		
		console.log(this.props);
		return (
			<nav class="mb-4 navbar navbar-expand-lg navbar-dark bg-unique">
                <a class="navbar-brand" href="/dashboard">Teach Meet</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent-3" aria-controls="navbarSupportedContent-3" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                
				{this.props.auth.isAuthenticated ?
				(
				<div class="collapse navbar-collapse" id="navbarSupportedContent-3">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="/dashboard">Home<span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href={`/account/${this.props.auth.user.username}`} >Account</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav ml-auto nav-flex-icons">
						<li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-user"></i> 
                                </a>
                            <div class="dropdown-menu dropdown-menu-right dropdown-unique" aria-labelledby="navbarDropdownMenuLink">
                                <a class="dropdown-item" onClick={this.onLogoutClick}>Logout</a>
                            </div>
                        </li>
                    </ul>
                </div>
				)
				:
				(
				<div class="collapse navbar-collapse" id="navbarSupportedContent-3">
                    <ul class="navbar-nav ml-auto nav-flex-icons">
						<li class="nav-item">
                            <a class="nav-link" href="/login">Login</a>
                        </li>
						<li class="nav-item">
                            <a class="nav-link" href="/register">Register</a>
                        </li>
                    </ul>
                </div>
				)
				}
            </nav>
		);
	}
	
};


Navbar.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps, {logoutUser})(Navbar);
  
  
  
  