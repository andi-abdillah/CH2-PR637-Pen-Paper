import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser")) || null
  );

  const login = (user) => {
    setLoggedInUser(user);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  };

  const logout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
