const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = {
	validateEmail: function(data) {
	  let errors = {};
	  
	  // Convert empty fields to an empty string so we can use validator functions
	  data.email = !isEmpty(data.email) ? data.email : "";
	  // Email checks
	  if (Validator.isEmpty(data.email)) {
		errors.message = "Email is required";
	  } else if (!Validator.isEmail(data.email)) {
		errors.message = "Email is invalid";
	  }
	  
	  return {
		errors,
		isValid: isEmpty(errors)
	  };
	},

	validatePassword: function(data) {
	  let errors = {};
  
	  // Convert empty fields to an empty string so we can use validator functions
	  data.password = !isEmpty(data.password) ? data.password : "";
	  data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : "";
	  // Password checks
	  if (Validator.isEmpty(data.password)) {
		errors.message = "Password is required";
	  }
	  if (Validator.isEmpty(data.confirmPassword)) {
		errors.message = "Confirm password is required";
	  }
	  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.message = "Password must be at least 6 characters";
	  }
	  if (!Validator.equals(data.password, data.confirmPassword)) {
		errors.message = "Passwords must match";
	  }

	  return {
		errors,
		isValid: isEmpty(errors)
	  };
	}
}