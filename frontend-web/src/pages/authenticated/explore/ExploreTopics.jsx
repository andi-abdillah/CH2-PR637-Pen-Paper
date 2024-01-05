import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Loading from "../../../components/Loading";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import { API_URL } from "../../../api/api";
import axios from "axios";

const ExploreTopics = ({ token, searchQuery }) => {
  const [topics, setTopics] = useState([]);

  const [visibleTopics, setVisibleTopics] = useState(12);

  const [loading, setLoading] = useState(true);

  const handleLoadMore = () => {
    setVisibleTopics((prevVisibleArticles) => prevVisibleArticles + 12);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let foundTopics = [];
        if (searchQuery) {
          const response = await axios.get(
            `${API_URL}/topics/search-by-name?query=${searchQuery}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          foundTopics = response.data.data.topics;
        } else {
          const response = await axios.get(`${API_URL}/topics`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          foundTopics = response.data.data.topics;
        }

        setTopics(foundTopics);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, searchQuery]);

  if (loading && searchQuery) {
    return <Loading />;
  }

  if (topics?.length === 0 && searchQuery) {
    return (
      <p>
        We couldn't find any topics matching "<b>{searchQuery}</b>".
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {topics.slice(0, visibleTopics).map((topic, index) => (
          <Link
            to={`/dashboard/topic/${topic.name}`}
            key={index}
            className="flex flex-wrap gap-1 h-max mb-2 px-4 py-2 bg-neutral-50 rounded-3xl font-semibold drop-shadow capitalize"
          >
            {topic.name}
            <span className="text-gray-400 inline-block">
              {` `}(
              {topic?.totalArticles > 1
                ? topic.totalArticles + " articles"
                : topic.totalArticles + " article"}
              )
            </span>
          </Link>
        ))}
      </div>
      {visibleTopics < topics.length && (
        <PrimaryButton className="m-auto mt-4" onClick={handleLoadMore}>
          Load More<Icon>arrow_circle_down</Icon>
        </PrimaryButton>
      )}
    </>
  );
};

export default ExploreTopics;
