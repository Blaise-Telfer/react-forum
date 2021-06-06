import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const AdminRoute = ({ component: Component, authInfo, ...rest }) => (
  <Route
    {...rest}
    render = {props =>
      authInfo.user == null ? (  <Redirect to="/login" /> )
	  :
	  authInfo.user.role == "admin" ? ( <Component {...props} /> ) 
	  :
	  (  <Redirect to="/login" /> )
    }
  />
);


const mapStateToProps = state => ({
  authInfo: state.authInfo
});

export default connect(mapStateToProps)(AdminRoute);