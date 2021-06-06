import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({ component: Component, authInfo, ...rest }) => (
  <Route
    {...rest}
    render = {props =>
      authInfo.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

const mapStateToProps = state => ({
  authInfo: state.authInfo
});

export default connect(mapStateToProps)(PrivateRoute);