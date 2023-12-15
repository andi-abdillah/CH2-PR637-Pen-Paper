import { useState, useEffect } from "react";
import { useAuth } from "../../../provider/AuthContext";
import { useAlert } from "../../../provider/AlertProvider";
import { Link } from "react-router-dom";
import { dateFormater } from "../../../utils/dateFormater";
import AddComment from "./AddComment";
import EditComment from "./EditComment";
import Icon from "../../../components/Icon";
import Divider from "../../../components/Divider";
import axios from "axios";

const CommentSection = ({ articleId }) => {
  const { token, user } = useAuth();

  const { showAlert } = useAlert();

  const [comments, setComments] = useState([]);

  const [comment, setComment] = useState({});

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/${articleId}/comments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const foundComments = response.data.data.comments;
        setComments(foundComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [token, articleId, comments, isEditing]);

  const handleDelete = async (commentId) => {
    try {
      const result = await axios.delete(
        `http://localhost:9000/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { message, status } = result.data;

      showAlert(message, status);
    } catch (error) {
      const { message, status } = error.response.data;

      showAlert(message, status);
    }
  };

  const handleEdit = (comment) => {
    setComment(comment);
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-xl mt-12">
      <h2 className="text-xl text-black font-semibold">
        {`Responses (${comments?.length})`}
      </h2>
      <div className="mt-4">
        {comments.map((comment) => (
          <div key={comment.commentId} className="my-4">
            <div className="flex">
              <div className="w-full">
                <p>
                  By:{" "}
                  <Link
                    to={`/dashboard/profile/@${comment.username}`}
                    className="hover:underline"
                  >
                    {comment.username}
                  </Link>
                </p>
                <p>
                  {comment.createdAt ? dateFormater(comment.createdAt) : null}
                </p>
              </div>
              {comment.userId === user.userId && (
                <div className="dropdown dropdown-end">
                  <label tabIndex={0}>
                    <Icon className="text-4xl cursor-pointer">more_horiz</Icon>
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] py-3 text-center text-sm font-semibold drop-shadow-card bg-base-100 rounded-box w-max list-none"
                  >
                    <li className="mx-5 mb-2 cursor-pointer hover:text-primary">
                      <button
                        className="text-primary"
                        onClick={() => handleEdit(comment)}
                      >
                        Edit Comment
                      </button>
                    </li>
                    <Divider />
                    <li className="mx-5 mt-2 cursor-pointer hover:text-primary">
                      <button
                        className="text-red-500"
                        onClick={() => handleDelete(comment.commentId)}
                      >
                        Delete Comment
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="">
              <p>{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>
      {isEditing && (
        <EditComment
          comment={comment}
          showAlert={showAlert}
          onClose={handleClose}
        />
      )}

      <AddComment
        articleId={articleId}
        setComments={setComments}
        showAlert={showAlert}
      />
    </div>
  );
};

export default CommentSection;