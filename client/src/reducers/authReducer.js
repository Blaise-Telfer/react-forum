import { 
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SET_CURRENT_USER,
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  FORGOT_REQUEST,
  FORGOT_SUCCESS,
  FORGOT_FAIL,
  RESET_REQUEST,
  RESET_SUCCESS,
  RESET_FAIL,
  VERIFY_REQUEST,
  VERIFY_SUCCESS,
  VERIFY_FAIL
} from "../authorization/types";
const isEmpty = require("is-empty");
const Cookie = require('js-cookie');
const token = localStorage.getItem('jwtToken') || null;

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  authToken: token
};

//register handler
export const authRegisterReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true
      };
    case REGISTER_SUCCESS:
	  return { loading: false, message: action.payload  };
	case REGISTER_FAIL:
	  return { loading: false, error: action.payload };
    default:
      return state;
  }
};

//login handler
export const authLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
		loading: false
      };
	case LOGIN_FAIL:
	  return { loading: false, error: action.payload };
    default:
      return state;
  }
};

//get list of all users
export const fetchUsersReducer = (state = {users: []}, action) => {
  switch (action.type) {
    case FETCH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    case FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

//delete user
export const userDeleteReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DELETE_REQUEST:
      return { ...state, loading: true };
    case USER_DELETE_SUCCESS:
      return { ...state, loading: false, user: action.payload, success: true };
    case USER_DELETE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


//verify the account
export const verifyAccountReducer = (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_REQUEST:
      return {
        ...state,
        loading: true
      };
    case VERIFY_SUCCESS:
      return {
        ...state,
        message: action.payload,
		loading: false
      };
	case VERIFY_FAIL:
	  return { loading: false, error: action.payload };
    default:
      return state;
  }
};

//request new password
export const passwordForgotReducer = (state = initialState, action) => {
  switch (action.type) {
    case FORGOT_REQUEST:
      return {
        ...state,
        loading: true
      };
    case FORGOT_SUCCESS:
      return {
        ...state,
        message: action.payload,
		loading: false
      };
	case FORGOT_FAIL:
	  return { loading: false, error: action.payload };
    default:
      return state;
  }
};

//change password
export const passwordResetReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_REQUEST:
      return {
        ...state,
        loading: true
      };
    case RESET_SUCCESS:
      return {
        ...state,
        message: action.payload,
		loading: false
      };
	case RESET_FAIL:
	  return { loading: false, error: action.payload };
    default:
      return state;
  }
};