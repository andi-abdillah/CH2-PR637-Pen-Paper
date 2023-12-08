import { Link } from "react-router-dom";
import TextInput from "../../components/TextInput";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useState } from "react";
import { useAlert } from "../../provider/AlertProvider";
import GoogleRegisterButton from "../../components/GoogleRegisterButton";
import axios from "axios";

const Register = () => {
  const { showAlert } = useAlert();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "username" ? value.toLowerCase() : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(
        "http://localhost:9000/register",
        formData
      );
      const { message, status } = result?.data;

      showAlert(message, status);

      setFormData({
        fullName: "",
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      const { message, status } = error.response?.data;

      showAlert(message, status);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Register</title>
        </Helmet>
      </HelmetProvider>

      <div className="flex justify-center w-screen min-h-screen bg-primary">
        <div className="mx-6 my-auto lg:my-24 p-8 md:p-20 bg-neutral-50 rounded-3xl drop-shadow-card">
          <h1 className="max-w-md text-primary text-4xl sm:text-5xl md:text-6xl">
            <Link to="/">Join the community.</Link>
          </h1>
          <div className="w-full sm:max-w-xs mx-auto mt-16">
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <TextInput
                id="fullname"
                name="fullName"
                type="text"
                value={formData?.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="text-center"
                required
                isFocused
              />
              <TextInput
                id="username"
                name="username"
                type="text"
                value={formData?.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="text-center"
                required
              />
              <TextInput
                id="email"
                name="email"
                type="email"
                value={formData?.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="text-center"
                required
              />
              <TextInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData?.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="text-center"
                required
              />
              <span className="flex gap-2">
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                />
                Show Password
              </span>

              <button
                type="submit"
                className="text-primary text-lg font-semibold mx-auto w-max mt-4"
              >
                Create Account
              </button>
            </form>
            <div className="divider my-8">OR</div>
            <GoogleRegisterButton setFormData={setFormData} />
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
