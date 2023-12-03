import { Helmet, HelmetProvider } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Icon from "../../components/Icon";
import PrimaryButton from "../../components/PrimaryButton";
import Banner from "../../assets/banner.jpeg";
import Loading from "../../components/Loading";
import axios from "axios";

const Home = () => {
  const topics = [
    "Programming",
    "Self Improvement",
    "Relationship",
    "Politics",
  ];

  const [loading, setLoading] = useState(true);

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/articles");
        setArticles(response.data.data.articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Home</title>
        </Helmet>
      </HelmetProvider>

      <div className="mb-24">
        <div
          className="hero min-w-full min-h-[24rem] rounded-[20px]"
          style={{
            backgroundImage: `url(${Banner})`,
          }}
        >
          <div className="hero-overlay bg-white bg-opacity-30 rounded-[20px]"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-4xl">
              <h1 className="mt-20 mb-10 text-4xl xs:text-5xl lg:text-6xl">
                Learn something new today.
              </h1>
              <Link
                to="explore"
                className="px-10 py-3.5 text-xl text-white font-semibold bg-primary rounded-lg"
              >
                Browse Stories
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between">
        <div>
          <h2 className="mb-6 text-center xs:text-start text-xl text-primary font-semibold">
            Might for you
          </h2>
          {articles?.map((article, index) => (
            <Card key={index} {...article} />
          ))}
        </div>

        {!loading ? (
          <div className="fixed bottom-3 right-3 text-center dropdown dropdown-top dropdown-end z-[1] md:hidden">
            <PrimaryButton
              tabIndex={0}
              className="bg-white focus:bg-primary focus:text-white btn-circle m-2 drop-shadow"
            >
              <Icon className="text-3xl">expand_circle_up</Icon>
            </PrimaryButton>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] mb-2 mx-3 p-4 drop-shadow-card bg-base-100 rounded-box w-60"
            >
              <h2 className="mb-6 text-primary font-semibold">
                Discover by topics
              </h2>
              {topics?.map((topic, index) => (
                <li
                  key={index}
                  className="mb-2 px-4 py-2 bg-neutral-50 rounded-3xl drop-shadow"
                >
                  <Link>{topic}</Link>
                </li>
              ))}
              <Link
                to="explore"
                className="flex justify-center items-center mt-8 text-primary font-semibold transition duration-300 ease-in-out hover:scale-[1.025]"
              >
                Browse more topics
                <svg
                  className="w-3.5 h-3.5 ml-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </Link>
            </ul>
          </div>
        ) : (
          <Loading />
        )}

        <div className="w-max hidden md:block">
          <h2 className="mb-6 text-xl text-primary font-semibold">
            Discover by topics
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {topics?.map((topic, index) => (
              <div
                key={index}
                className="card w-60 h-14 mb-2 bg-neutral-50 rounded-3xl drop-shadow-card"
              >
                <div className="card-body p-0">
                  <h4 className="font-semibold m-auto text-lg text-gray-400">
                    {topic}
                  </h4>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="explore"
            className="flex items-center mt-3 text-xl text-primary font-semibold transition duration-300 ease-in-out hover:scale-[1.025]"
          >
            Browse more topics
            <svg
              className="w-3.5 h-3.5 ml-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
