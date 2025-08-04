import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const profile = await getProfile(token);
          setUser(profile);
        } catch (error) {
          setUser(null);
          setToken("");
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  // Solo recibe el token
  const login = async (token) => {
    setToken(token);
    localStorage.setItem("token", token);
    try {
      const profile = await getProfile(token);
      setUser(profile);
    } catch (error) {
      setUser(null);
      setToken("");
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
