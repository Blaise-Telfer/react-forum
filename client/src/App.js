import React, { Component } from 'react';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Layout } from 'react-mdl';
import { createBrowserHistory } from "history";
import jwt_decode from "jwt-decode";

//pages
import Landing from "./pages/landing";
import Login from "./pages/login";
import Register from "./pages/register";
import Verification from "./pages/verification";
import NotFound from "./components/notFound";
import PrivateRoute from "./components/privateRoute";
import AdminRoute from "./components/adminRoute";
import Dashboard from "./pages/dashboard";
import Account from "./pages/account";
import NewPost from "./pages/newPost";
import PostPage from "./pages/postPage";
import IndividualPost from "./pages/individualPost";
import Navbar from "./components/navbar";
import Settings from "./pages/settings";
import EditProfile from "./pages/editProfile";
import LoginForgot from "./pages/loginForgot";
import PasswordReset from "./pages/passwordReset";

//admin pages
import Profile from "./pages/profile";
import Users from "./components/userPanel"
import Posts from "./components/postPanel"


import { setCurrentUser, logoutUser } from "./authorization/userActions";
import setAuthToken from "./authorization/token";
import { store } from "./store";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

export const history = createBrowserHistory();

class App extends Component {
  render() {
	
    return (
      <Provider store={store}>
        <Router history={history}>
          <div className="App">
            <Navbar />
	    <Switch>
		<Route exact path="/" component={Landing} />
          	<Route exact path="/register" component={Register} />
		<Route exact path="/login" component={Login} />
		<Route exact path="/verify/:email/:token" component={Verification} />
		<Route exact path="/forgot-password" component={LoginForgot} />
		<Route exact path="/reset-password/:email/:token" component={PasswordReset} />
       		<Route exact path="/dashboard" component={Dashboard} />
			  
		<PrivateRoute exact path="/account/:username" component={Account} />
		<PrivateRoute exact path="/editProfile" component={EditProfile} />
		<PrivateRoute exact path="/settings/:username" component={Settings} />
		<PrivateRoute exact path="/newPost" component={NewPost} />
		<PrivateRoute exact path="/postPage" component={PostPage} />
		<PrivateRoute exact path="/post/:id" component={IndividualPost} />
			  
		<AdminRoute exact path="/profile/:username" component={Profile} />
		<AdminRoute exact path="/userPanel" component={Users} />
		<AdminRoute exact path="/postPanel" component={Posts} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
