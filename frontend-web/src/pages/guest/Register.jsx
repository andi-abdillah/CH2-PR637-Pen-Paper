import { Link } from "react-router-dom";
import TextInput from "../../components/TextInput";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useEffect, useState } from "react";
import Alert from "../../components/Alert";
import axios from "axios";

const Register = () => {
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [response, setResponse] = useState({
    status: "",
    message: "",
  });

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

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post("http://localhost:9000/users", formData);
      const successMessage = result.data;

      setResponse({
        status: successMessage.status,
        message: successMessage.message,
      });

      setFormData({
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      const errorMessage = error.response.data;
      setResponse({
        status: errorMessage.status,
        message: errorMessage.message,
      });
    }
  };

  useEffect(() => {
    if (response.message && response.status) {
      showAlert(response.message, response.status);
    }
  }, [response]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Register</title>
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
            <form
              action=""
              onSubmit={handleRegister}
              className="flex flex-col gap-4"
            >
              <TextInput
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="text-center"
                required
                isFocused
              />
              <TextInput
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="text-center"
                required
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
                className="text-primary text-lg font-semibold"
              >
                Create Account
              </button>
            </form>
          </div>
          <center className="my-6 text-lg">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-primary font-semibold inline-block"
            >
              Sign In
            </Link>
          </center>
        </div>
      </div>
    </>
  );
};

export default Register;
