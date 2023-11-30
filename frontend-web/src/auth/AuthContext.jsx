import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [authenticatedUser, setAuthenticatedUser] = useState(
    JSON.parse(localStorage.getItem("authenticatedUser")) || null
  );

  const login = (user) => {
    setAuthenticatedUser(user);
    localStorage.setItem("authenticatedUser", JSON.stringify(user));
  };

  const logout = () => {
    setAuthenticatedUser(null);
    localStorage.removeItem("authenticatedUser");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ authenticatedUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
