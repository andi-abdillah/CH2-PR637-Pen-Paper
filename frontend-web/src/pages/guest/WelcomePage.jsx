import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  return (
    <div className="w-screen h-screen">
      <HelmetProvider>
        <Helmet>
          <title>Pen & Paper</title>
        </Helmet>
      </HelmetProvider>

      <h1 className="fixed top-0 font-bold px-20 py-8 text-2xl md:text-3xl text-primary">
        Pen & Paper
      </h1>

      <div className="flex justify-center items-center h-full">
        <h1 className="text-2xl w-max">
          Welcome to Pen & Paper,{" "}
          <Link to="/sign-in" className="text-primary underline">
            Sign in
          </Link>
        </h1>
      </div>
    </div>
  );
};

export default WelcomePage;
