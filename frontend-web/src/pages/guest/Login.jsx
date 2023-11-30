import { Link, useNavigate } from "react-router-dom";
import TextInput from "../../components/TextInput";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:9000/users");
        setUsers(response.data.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find((userData) => userData.email === formData.email);

    if (user && user.password === formData.password) {
      login(user);
      navigate("/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Sign In</title>
        </Helmet>
      </HelmetProvider>

      <div className="flex justify-center w-screen min-h-screen bg-primary">
        <div className="mx-6 my-auto lg:my-24 p-8 md:p-20 bg-neutral-50 rounded-3xl drop-shadow-card">
          <h1 className="max-w-md text-primary text-4xl sm:text-5xl md:text-6xl">
            <Link to="/">Join the community.</Link>
          </h1>
          <div className="w-full sm:max-w-xs mx-auto mt-16">
            <form
              action=""
              onSubmit={handleLogin}
              className="flex flex-col gap-4"
            >
              <TextInput
                id="email"
                name="email"
                type="email"
                defaultValue={formData.email}
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
                defaultValue={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="text-center"
                required
              />
              <button
                type="submit"
                className="text-primary text-lg font-semibold"
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
