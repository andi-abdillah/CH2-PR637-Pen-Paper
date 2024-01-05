import { useState } from "react";
import Icon from "../../../components/Icon";
import TextInput from "../../../components/TextInput";
import InputLabel from "../../../components/InputLabel";
import PrimaryButton from "../../../components/PrimaryButton";
import { API_URL } from "../../../api/api";
import { debounce } from "lodash";
import axios from "axios";
import { formatNumber } from "../../../utils/formatNumber";

const TopicsInput = ({ token, topics, setTopics }) => {
  const [topicInput, setTopicInput] = useState("");

  const [suggestedTopics, setSuggestedTopics] = useState([]);

  const searchTopicsDebounced = debounce(async (inputValue) => {
    try {
      const result = await axios.get(
        `${API_URL}/topics/search?query=${inputValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },  
        }
      );

      const slicedTopics = result.data.data.topics.slice(0, 3);

      const filteredSuggestedTopics = slicedTopics.filter(
        (slicedTopic) => !topics.includes(slicedTopic.name)
      );

      setSuggestedTopics(filteredSuggestedTopics);
    } catch (error) {
      console.error("Error while searching for topics:", error);
    }
  }, 1000);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    setTopicInput(inputValue);

    if (inputValue.length > 2) {
      searchTopicsDebounced(inputValue);
    } else {
      setSuggestedTopics([]);
    }
  };

  const parse = () => {
    const inputVal = topicInput.toLowerCase().trim();
    const noCommaVal = inputVal.replace(/,/g, "");

    if (inputVal.slice(-1) === "," && noCommaVal.length > 0) {
      const newTopic = compileTopic(noCommaVal);

      // Check if the topic already exists
      if (!topics.includes(newTopic)) {
        // Check if the number of topics is less than 5 before adding a new one
        if (topics.length < 5) {
          setTopics([...topics, newTopic]);
        }
      }
      setTopicInput("");
    }
  };

  const compileTopic = (topicContent) => topicContent;

  const removeTopic = (topicContent) => {
    const updatedTopics = topics.filter((topic) => topic !== topicContent);
    setTopics(updatedTopics);
  };

  const handleSuggestedTopicClick = (event, topic) => {
    event.preventDefault();

    // Check if the suggested topic already exists
    if (!topics.includes(topic)) {
      // Check if the number of topics is less than 5 before adding a new one
      if (topics.length < 5) {
        setTopics([...topics, topic]);
      }
    }
    setTopicInput("");
  };

  return (
    <div className="row">
      <div>
        <InputLabel
          htmlFor="topics_input"
          value="Add or change topics (up to 5) so readers know what your story is about:"
        />
        <TextInput
          onKeyUp={parse}
          type="text"
          id="topics_input"
          placeholder="Enter topics separated by commas"
          maxLength="100"
          className="border-0 mt-2 font-semibold"
          value={topicInput}
          onChange={handleInputChange}
        />
      </div>
      {topicInput && (
        <div className="flex flex-col gap-2 my-2">
          {suggestedTopics.map((suggestedTopic) => (
            <PrimaryButton
              className="w-max capitalize"
              key={suggestedTopic.topicId}
              onClick={(event) =>
                handleSuggestedTopicClick(event, suggestedTopic.name)
              }
            >
              {suggestedTopic.name}
              <span className="text-gray-500">
                (
                {suggestedTopic.totalArticles
                  ? formatNumber(suggestedTopic.totalArticles)
                  : "0"}
                )
              </span>
            </PrimaryButton>
          ))}
        </div>
      )}
      <div id="topics" className="flex flex-wrap gap-2 my-3">
        {topics.map((topic) => (
          <PrimaryButton
            key={topic}
            className="capitalize"
            onClick={(e) => e.preventDefault()}
          >
            <span>{topic}</span>
            <Icon id="remove" onClick={() => removeTopic(topic)}>
              close
            </Icon>
          </PrimaryButton>
        ))}
      </div>
    </div>
  );
};

export default TopicsInput;
