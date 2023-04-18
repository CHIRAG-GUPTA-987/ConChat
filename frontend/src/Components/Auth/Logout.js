const Logout = (history) => {
  localStorage.removeItem("userInfo");
  history.push("/");
};

export { Logout };
