class managerCache {
  checkSession() {
    return (
      sessionStorage.getItem("authToken") && sessionStorage.getItem("userId")
    );
  }
}

module.exports = new managerCache();