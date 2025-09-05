import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    // Fetch current user from backend
    fetch("http://localhost:5555/api/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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
          return;
        }
        const data = await res.json();

        // Store in state + localStorage (so ProtectedRoute can read role quickly)
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
      .finally(() => setLoading(false));
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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
