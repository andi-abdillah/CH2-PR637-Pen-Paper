import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Read the value from the cookie when the component is loaded
  const [authenticatedUser, setAuthenticatedUser] = useState(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="));

    if (token) {
      // Get the token value from the cookie
      const tokenValue = token.split("=")[1];

      // Decode the token to get user information
      const decodedToken = jwtDecode(tokenValue);

      // Adjust to your token format
      return { token: tokenValue, user: decodedToken };
    }

    return null;
  });

  const token = authenticatedUser?.token;

  const user = authenticatedUser?.user;

  const login = (token) => {
    // Decode the token to get user information
    const decodedToken = jwtDecode(token);

    // Save the token in the cookie
    document.cookie = `authToken=${token}; path=/; Secure`;

    // Save user information in the state
    setAuthenticatedUser({ token, user: decodedToken });
  };

  const logout = () => {
    // Remove the token from the cookie
    document.cookie =
      "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Remove user information from the state
    setAuthenticatedUser(null);

    // Redirect to the login page
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ authenticatedUser, token, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
