import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Membaca nilai dari cookie saat komponen dimuat
  const [authenticatedUser, setAuthenticatedUser] = useState(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="));

    if (token) {
      // Mengambil nilai token dari cookie
      const tokenValue = token.split("=")[1];

      // Decode token untuk mendapatkan informasi pengguna
      const decodedToken = jwtDecode(tokenValue);

      // Sesuaikan dengan format token Anda
      return { token: tokenValue, user: decodedToken };
    }

    return null;
  });

  const token = authenticatedUser?.token;

  const user = authenticatedUser?.user;

  const login = (token) => {
    // Decode token untuk mendapatkan informasi pengguna
    const decodedToken = jwtDecode(token);

    // Simpan token dalam cookie
    document.cookie = `authToken=${token}; path=/; Secure`;

    // Simpan informasi pengguna dalam state
    setAuthenticatedUser({ token, user: decodedToken });
  };

  const logout = () => {
    // Hapus token dari cookie
    document.cookie =
      "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Hapus informasi pengguna dari state
    setAuthenticatedUser(null);

    // Redirect ke halaman login
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
