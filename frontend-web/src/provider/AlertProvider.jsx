import { createContext, useContext, useState } from "react";
import Alert from "../components/Alert";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {alert && (
        <Alert message={alert.message} type={alert.type} onClose={closeAlert} />
      )}
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  return useContext(AlertContext);
};
