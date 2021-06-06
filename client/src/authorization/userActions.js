import axios from "axios";
import jwt_decode from "jwt-decode";
import cookie from 'js-cookie';
import setAuthToken from "./token";
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_REQUEST,
  LOGIN_FAIL,
  SET_CURRENT_USER,
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAIL,
  FORGOT_REQUEST,
  FORGOT_SUCCESS,
  FORGOT_FAIL,
  RESET_REQUEST,
  RESET_SUCCESS,
  RESET_FAIL,
  VERIFY_REQUEST,
  VERIFY_SUCCESS,
  VERIFY_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL
} from "./types";


//register function
export const registerUser = (userData, history) => async (dispatch) => {
  try{
    dispatch({ type: REGISTER_REQUEST });
    const { data } = await axios.post(`/api/auth/register`, userData);
    dispatch({ type: REGISTER_SUCCESS, payload: data });
	history.push(`/login`);
  }
  catch(error){
    console.log("error is: ", error.response.data)
	dispatch({ type: REGISTER_FAIL, payload: error.response.data });
  }
};

//login function
export const loginUser = (userData, history) => async (dispatch) => {
  try{
    dispatch({ type: LOGIN_REQUEST });
    const { data } = await axios.post(`/api/auth/login`, userData);
    const token = data.token;
	const decoded = jwt_decode(token);
    dispatch({ type: SET_CURRENT_USER, payload: decoded });
	cookie.set("userCookie", token);
    localStorage.setItem("jwtToken", token);
    setAuthToken(token);
	history.push(`/dashboard`);
  }
  catch(error){
    dispatch({ type: LOGIN_FAIL, payload: error.response.data });
  }
};

//logout function
export const logoutUser = () => (dispatch) => {
  cookie.remove("userCookie");
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch({ type: SET_CURRENT_USER, payload: {} });
};

//exported to store.js and App.js
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};


//fetch user list
export const fetchUsers = () => async (dispatch, getState) => {
  try {
    const { authInfo: { authToken } } = getState();
	dispatch({ type: FETCH_REQUEST });
    const {data} = await axios.get(`/api/users`,
	  {headers: {Authorization: authToken} }
	);
    dispatch({ type: FETCH_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: FETCH_FAIL, payload: error.message });
  }
}

//delete user
export const deleteUser = (userId) => async (dispatch, getState) => {
  try {
    const { authInfo: { authToken } } = getState();
	dispatch({ type: USER_DELETE_REQUEST, payload: userId });
    const { data } = await axios.delete(`/api/auth/${userId}`, 
	  {headers: {Authorization: authToken} }
	);
    dispatch({ type: USER_DELETE_SUCCESS, payload: data, success: true });
	window.location.reload()
  } catch (error) {
	dispatch({ type: USER_DELETE_FAIL, payload: error.response.data });
  }
};


//verify account
export const verifyCheck = (userData) => async (dispatch, getState) => {
  try {
	dispatch({ type: VERIFY_REQUEST });
    const {data} = await axios.post(`/api/verify`, userData);
    dispatch({ type: VERIFY_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: VERIFY_FAIL, payload: error.response.data });
  }
}

//reset password request
export const forgotPassword = (email) => async (dispatch, getState) => {
  try {
	dispatch({ type: FORGOT_REQUEST });
    const {data} = await axios.post(`/api/verify/request/${email.email}`);
    dispatch({ type: FORGOT_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: FORGOT_FAIL, payload: error.response.data });
  }
}

//reset password change
export const resetPassword = (userData) => async (dispatch, getState) => {
  try {
	dispatch({ type: RESET_REQUEST });
    const {data} = await axios.post(`/api/verify/reset-password`, userData);
    dispatch({ type: RESET_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: RESET_FAIL, payload: error.response.data });
  }
}