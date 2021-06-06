import axios from "axios";
import jwt_decode from "jwt-decode";
import cookie from 'js-cookie';
import setAuthToken from "./token";
import { 
  GET_ERRORS, 
  SET_CURRENT_USER, 
  USER_LOADING, 
  DELETE_POST, 
  GET_POSTS, 
  POST_LOADING, 
  VERIFY_EMAIL_ERROR 
} from "./types";


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



