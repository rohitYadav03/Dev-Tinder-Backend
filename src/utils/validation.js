const validator = require("validator");

const validateSignup = (req) => {
  const { firstName, lastName, EmailId, password } = req.body;

  if (!firstName || firstName.trim().length < 2) {
    throw new Error("First name must be at least 2 characters long");
  }

  if (!lastName || lastName.trim().length < 2) {
    throw new Error("Last name must be at least 2 characters long");
  }

  if (!EmailId || !validator.isEmail(EmailId)) {
    throw new Error("Enter a valid email");
  }

  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password. It must contain at least 8 characters, including uppercase, lowercase, number, and symbol.");
  }
};

module.exports = { validateSignup };
