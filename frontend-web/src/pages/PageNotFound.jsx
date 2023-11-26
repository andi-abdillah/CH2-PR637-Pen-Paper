import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>404 Page Not Found</title>
        </Helmet>
      </HelmetProvider>

      <div class="text-center m-20">
        <h1 class="mb-4 text-6xl font-semibold text-red-500">404</h1>
        <p class="mb-4 text-lg text-gray-600">Oops! Looks like you're lost.</p>
        <div class="animate-bounce">
          <svg
            class="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            ></path>
          </svg>
        </div>
        <p class="mt-4 text-gray-600">
          Let's get you{" "}
          <Link to={-1} class="text-blue-500">
            back
          </Link>
          .
        </p>
      </div>
    </>
  );
};

export default PageNotFound;
