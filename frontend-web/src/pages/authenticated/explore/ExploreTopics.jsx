import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Loading from "../../../components/Loading";
import { API_URL } from "../../../api/api";
import axios from "axios";

const ExploreTopics = ({ token, searchQuery }) => {
  const [topics, setTopics] = useState([]);

  const [loading, setLoading] = useState(true);

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
    <div className="flex flex-wrap gap-4 max-w-3xl">
      {topics?.map((topic, index) => (
        <Link
          to={`/dashboard/topic/${topic.name}`}
          key={index}
          className="mb-2 px-4 py-2 w-max bg-neutral-50 rounded-3xl font-semibold drop-shadow capitalize"
        >
          {topic.name}
          <span className="text-gray-400">
            {` `}(
            {` with ${
              topic?.totalArticles > 1
                ? topic.totalArticles + " articles"
                : topic.totalArticles + " article"
            }`}
            )
          </span>
        </Link>
      ))}
    </div>
  );
};

export default ExploreTopics;
