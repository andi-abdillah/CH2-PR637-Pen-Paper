import { Link, useNavigate } from "react-router-dom";
import TextInput from "../../components/TextInput";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useState } from "react";
import { useAuth } from "../../provider/AuthContext";
import axios from "axios";
import Alert from "../../components/Alert";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value.trim(),
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post("http://localhost:9000/login", formData);
      const { message, status, token } = result.data;

      login(token);

      showAlert(message, status);

      navigate("/dashboard");
    } catch (error) {
      const { message, status } = error.response.data;

      showAlert(message, status);
    }
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Sign In</title>
        </Helmet>
      </HelmetProvider>

      {alert && (
        <Alert
          type={alert.type}
          onClose={handleCloseAlert}
          message={alert.message}
        />
      )}

      <div className="flex justify-center w-screen min-h-screen bg-primary">
        <div className="mx-6 my-auto lg:my-24 p-8 md:p-20 bg-neutral-50 rounded-3xl drop-shadow-card">
          <h1 className="max-w-md text-primary text-4xl sm:text-5xl md:text-6xl">
            <Link to="/">Join the community.</Link>
          </h1>
          <div className="w-full sm:max-w-xs mx-auto mt-16">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <TextInput
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="text-center"
                required
                isFocused
              />
              <TextInput
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="text-center"
                required
              />
              <button
                type="submit"
                className="text-primary text-lg font-semibold mx-auto w-max"
              >
                Sign In
              </button>
            </form>
          </div>
          <center className="my-6 text-lg">
            No account yet?{" "}
            <Link
              to="/register"
              className="text-primary font-semibold inline-block"
            >
              Create one
            </Link>
          </center>
        </div>
      </div>
    </>
  );
};

export default Login;
