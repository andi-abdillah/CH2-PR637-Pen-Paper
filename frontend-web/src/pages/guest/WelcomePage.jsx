import { Helmet, HelmetProvider } from "react-helmet-async";
import GuestNavbar from "./GuestNavbar";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen">
      <HelmetProvider>
        <Helmet>
          <title>Welcome – Pen & Paper</title>
        </Helmet>
      </HelmetProvider>

      <GuestNavbar />

      <div className="w-max mx-auto flex flex-col mt-40">
        <h1 className="w-max text-primary text-3xl md:text-5xl lg:text-7xl">
          Pen & Paper:
        </h1>
        <h2 className="text-2xl md:text-4xl lg:text-6xl italic text-primary">
          digital literacy for everyone
        </h2>
        <button
          className="lg:hidden mt-8 px-8 py-3 text-lg text-white m-auto w-max font-semibold bg-primary rounded-lg"
          onClick={() => navigate("sign-in")}
        >
          Join the community
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
