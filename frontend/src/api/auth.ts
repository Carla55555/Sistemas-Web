const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

//function to log in a user
export async function login(email: string, password: string) {
  const res = await fetch(API_BASE + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (!res.ok) {
    let message = "Login failed: " + res.status;
    try {
      const data = await res.json();
      if (data && data.detail) {
        message = String(data.detail);
      }
    } 
    catch (e) {
      // ignore
    }
    throw new Error(message);
  }

  const data = await res.json();
  //save the token in local storage to keep the user logged in
  localStorage.setItem("access_token", data.access_token);
}

//function to register a new user
export async function register(email: string, password: string) {
  const res = await fetch(API_BASE + "/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (!res.ok) {
    let message = "Register failed: " + res.status;
    try {
      const data = await res.json();
      if (data && data.detail) {
        message = String(data.detail);
      }
    } 
    catch (e) {
      // ignore
    }
    throw new Error(message);
  }

  // we dont save the token here because register only creates the user
  return res.json();
}

//function to check who is logged in using the saved token
export async function me() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  const res = await fetch(API_BASE + "/auth/me", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!res.ok) return null;
  return await res.json();
}
