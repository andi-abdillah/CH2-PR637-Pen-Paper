import { createContext, useContext, useState, useEffect } from "react";
import Alert from "../components/Alert";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const [response, setResponse] = useState({
    status: "",
    message: "",
  });

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    if (response.message && response.status) {
      showAlert(response.message, response.status);
    }
  }, [response]);

  console.log(response);

  return (
    <AlertContext.Provider value={{ setResponse }}>
      {alert && (
        <Alert type={alert.type} onClose={closeAlert} message={alert.message} />
      )}
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  return useContext(AlertContext);
};
