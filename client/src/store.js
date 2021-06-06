import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import {
  authRegisterReducer,
  authLoginReducer,
  fetchUsersReducer,
  verifyAccountReducer,
  passwordForgotReducer,
  passwordResetReducer,
  userDeleteReducer
} from "./reducers";


const reducer = combineReducers({
  authRegister: authRegisterReducer,
  authInfo: authLoginReducer,
  userList: fetchUsersReducer,
  verifyAccount: verifyAccountReducer,
  passwordForgot: passwordForgotReducer,
  passwordReset: passwordResetReducer,
  userDelete: userDeleteReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunk))
);