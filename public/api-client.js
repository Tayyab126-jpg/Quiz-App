(function () {
  window.apiFetch = async function (url, options) {
    const token = localStorage.getItem("authToken");
    const requestOptions = options ? { ...options } : {};
    const headers = new Headers(requestOptions.headers || {});
    if (token) headers.set("Authorization", `Bearer ${token}`);
    requestOptions.headers = headers;

    const response = await fetch(url, requestOptions);
    if (response.status === 401 && token) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      window.location.href = "login.html";
    }
    return response;
  };
})();
