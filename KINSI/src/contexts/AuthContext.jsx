import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenVerified, setTokenVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("user_id");
    const storedUsername = localStorage.getItem("username");

    // If no token, skip the API call
    if (!token) {
      setLoading(false);
      setTokenVerified(true);
      return;
    }

    // Set user from localStorage immediately for initial render
    if (storedRole && storedUserId && storedUsername) {
      setCurrentUser({
        role: storedRole,
        userId: storedUserId,
        username: storedUsername,
      });
    }

    // Then verify with the backend
    fetch("http://localhost:5555/api/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          // Token might be invalid/expired → clear storage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("role");
          localStorage.removeItem("user_id");
          localStorage.removeItem("username");
          setCurrentUser(null);
          throw new Error("Token invalid");
        }
        const data = await res.json();

        // Store in state + localStorage
        setCurrentUser({
          role: data.role,
          userId: data.id,
          username: data.username,
        });
        localStorage.setItem("role", data.role);
        localStorage.setItem("user_id", data.id);
        localStorage.setItem("username", data.username);
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
        setCurrentUser(null);
      })
      .finally(() => {
        setLoading(false);
        setTokenVerified(true);
      });
  }, []);

  const logout = () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      fetch("http://localhost:5555/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch((err) => console.error("Logout error:", err));
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      logout, 
      loading,
      tokenVerified 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);