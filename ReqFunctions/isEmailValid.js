const EmailValidator = require("email-deep-validator");

module.exports = async function isEmailValid(email) {
  const emailValidator = new EmailValidator();
  return emailValidator.verify(email);
};
