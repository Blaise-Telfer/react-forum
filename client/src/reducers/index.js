import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import { reducer as formReducer } from 'redux-form';


export default combineReducers({
	auth: authReducer,
	errors: errorReducer,
	form: formReducer
});
