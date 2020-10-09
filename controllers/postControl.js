const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validatePost(data) {
  let errors = {};
  data.title = !isEmpty(data.title) ? data.title : "";
  data.body = !isEmpty(data.body) ? data.body : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.salary = !isEmpty(data.salary) ? data.salary : "";
  data.city = !isEmpty(data.city) ? data.city : "";
  data.category = !isEmpty(data.city) ? data.category : "";
  
  // title checks
  if (Validator.isEmpty(data.title)) {
    errors.title = "title is required";
  }
  // body checks
  if (Validator.isEmpty(data.body)) {
    errors.body = "body is required";
  }
  // email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "email is required";
  }
  
  // salary checks
  if (Validator.isEmpty(data.salary)) {
    errors.salary = "salary is required";
  }
  // city checks
  if (Validator.isEmpty(data.city)) {
    errors.city = "city is required";
  }
  // category checks
  if (Validator.isEmpty(data.category)) {
    errors.category = "category is required";
  }
  
  
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
