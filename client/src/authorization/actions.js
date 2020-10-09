import axios from "axios";
import jwt_decode from "jwt-decode";
import setAuthToken from "./token";
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING, DELETE_POST, GET_POSTS, POST_LOADING } from "./types";



//create post
export const createPost = (userData, history) => dispatch => {
  axios.post("/api/posts/create", userData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


//delete their own account
export const deleteAccount = (currentUser, history) => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    axios.delete(`/api/users/${currentUser}`)
      .then(res =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};


// Register User
export const registerUser = (userData, history) => dispatch => {
  axios.post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// Login - get user token
export const loginUser = (userData) => dispatch => {
  axios.post("/api/users/login", userData)
    .then(res => {
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


//update info
export const updateInfo = (userData, history) => dispatch => {
	axios.post(`/api/users/update/info`, userData )
	.then(response => {
		window.location.reload()
	})
	.catch(err =>
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	);
}


//update resume
export const updateResume = (userData, history) => dispatch => {
	axios.post(`/api/users/update/resume`, userData )
	.then(response => {
		window.location.reload()
	})
	.catch(err =>
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	);
}


// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};


// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};


// Post loading
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};


// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};




