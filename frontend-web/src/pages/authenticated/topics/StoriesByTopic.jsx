import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useAuth } from "../../../provider/AuthContext";
import { useParams } from "react-router-dom";
import Card from "../../../components/Card";
import Loading from "../../../components/Loading";
import BackButton from "../../../components/BackButton";
import Divider from "../../../components/Divider";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import { API_URL } from "../../../api/api";
import axios from "axios";

const StoriesByTopic = () => {
  const { token } = useAuth();

  const { name } = useParams();

  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [visibleArticles, setVisibleArticles] = useState(1);

  const handleLoadMore = () => {
    setVisibleArticles((prevVisibleArticles) => prevVisibleArticles + 1);
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/topic/articles?query=${name}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const foundArticles = response.data.data.articles;

        setArticles(foundArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [token, name]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>
            Stories In{" "}
            {name
              ?.split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}{" "}
            – Pen & Paper
          </title>
        </Helmet>
      </HelmetProvider>

      <div>
        <h1 className="text-3xl xs:text-5xl mb-8 capitalize">
          Stories In {name}
        </h1>

        <Divider />

        <BackButton />

        <div className="flex flex-wrap justify-between mt-8">
          {articles.slice(0, visibleArticles).map((item, index) => (
            <Card key={index} token={token} {...item} />
          ))}
          {visibleArticles < articles.length && (
            <PrimaryButton className="m-auto" onClick={handleLoadMore}>
              Load More<Icon>arrow_circle_down</Icon>
            </PrimaryButton>
          )}
          {articles.length === 0 && (
            <p className="md:text-xl font-semibold">
              There are no articles in {name} yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default StoriesByTopic;
