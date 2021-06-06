const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  
  // Convert empty fields to an empty string so we can use validator functions
  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.location = !isEmpty(data.location) ? data.location : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : "";
  data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
  data.lastname = !isEmpty(data.lastname) ? data.lastname : "";
  
  // username checks
  if (Validator.isEmpty(data.username)) {
    errors.message = "Username is required";
  }
  if (!Validator.isLength(data.username, { min: 5, max: 30 })) {
    errors.message = "Username must be at least 5 characters";
  }
  
  // firstname checks
  if (Validator.isEmpty(data.firstname)) {
    errors.message = "First name is required";
  }
  // lastname checks
  if (Validator.isEmpty(data.lastname)) {
    errors.message = "Last name is required";
  }
  
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.message = "Email is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.message = "Email is invalid";
  }
  
  // location checks
  if (Validator.isEmpty(data.location)) {
    errors.message = "Location is required";
  }

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
};