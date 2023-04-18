const createUserName = (firstName, email) => {
  return firstName.slice(0, 1) + email.split("@")[0];
};
module.exports = createUserName;
