import { useState, useEffect } from "react";
import { useAuth } from "../../../provider/AuthContext";
import { useAlert } from "../../../provider/AlertProvider";
import { Link } from "react-router-dom";
import { dateFormater } from "../../../utils/dateFormater";
import AddComment from "./AddComment";
import EditComment from "./EditComment";
import Icon from "../../../components/Icon";
import Divider from "../../../components/Divider";
import { API_URL } from "../../../api/api";
import axios from "axios";

const CommentSection = ({ articleId }) => {
  const { token, user } = useAuth();

  const { showAlert } = useAlert();

  const [comment, setComment] = useState({});

  const [comments, setComments] = useState([]);

  const [commentReplies, setCommentReplies] = useState([]);

  const [totalComments, setTotalComments] = useState(0);

  const [isEditing, setIsEditing] = useState(false);

  const [parentId, setParentId] = useState(null);

  const [mentionedUserId, setmentionedUserId] = useState(null);

  const [mentionedUsername, setmentionedUsername] = useState(null);

  const [isReplying, setIsReplying] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_URL}/${articleId}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const foundComments = response.data.data.comments.filter(
          (comment) => comment.parentId === null
        );

        const foundCommentReplies = response.data.data.comments.filter(
          (comment) => comment.parentId !== null
        );

        setComments(foundComments);

        setCommentReplies(foundCommentReplies);

        setTotalComments(response.data.data.comments.length);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [token, articleId, isEditing, isProcessing]);

  const handleDelete = async (commentId) => {
    setIsProcessing(true);

    try {
      const result = await axios.delete(`${API_URL}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { message, status } = result.data;

      showAlert(message, status);

      setIsProcessing(false);
    } catch (error) {
      const { message, status } = error.response.data;

      showAlert(message, status);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (comment) => {
    setComment(comment);
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  const handleReply = (commentId, userId, username) => {
    setIsReplying(true);
    setParentId(commentId);
    setmentionedUserId(userId);
    setmentionedUsername(username);

    const addCommentElement = document.getElementById("addcomment");
    if (addCommentElement) {
      addCommentElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-xl mt-12">
      <h2 className="text-xl text-black font-semibold">
        {`Responses (${totalComments})`}
      </h2>
      <div className="mt-4">
        {comments.map((comment, index) => (
          <div key={comment.commentId}>
            {index > 0 && <Divider className="mb-6" />}
            <div className="">
              <div className="flex text-sm">
                <div className="flex gap-2 items-center w-full">
                  <h3 className="font-semibold">
                    {comment.userId === user.userId ? (
                      "You"
                    ) : (
                      <>
                        @
                        <Link
                          to={`/dashboard/profile/@${comment.username}`}
                          className="hover:underline"
                        >
                          {comment.username}
                        </Link>
                      </>
                    )}
                  </h3>
                  <span className="text-gray-600">
                    ·{" "}
                    {comment.createdAt ? dateFormater(comment.createdAt) : null}
                  </span>
                </div>
                {comment.userId === user.userId && (
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0}>
                      <Icon className="text-xl cursor-pointer">more_vert</Icon>
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
              <div className="mt-2">
                <p>{comment.comment}</p>
              </div>
              <div className="mt-2">
                <span
                  className="cursor-pointer text-gray-500 hover:text-gray-800"
                  onClick={() =>
                    handleReply(
                      comment.commentId,
                      comment.userId,
                      comment.username
                    )
                  }
                >
                  reply
                </span>
              </div>
            </div>
            <div className="my-8">
              {commentReplies
                .filter(
                  (commentReply) => commentReply.parentId === comment.commentId
                )
                .map((replyComment, index) => (
                  <div className="flex gap-3" key={replyComment.commentId}>
                    <div className="divider divider-horizontal"></div>
                    <div className="w-full">
                      {index > 0 && <Divider className="my-6" />}
                      <div className="flex text-sm">
                        <div className="flex gap-2 items-center w-full">
                          <h3 className="font-semibold">
                            {replyComment.userId === user.userId ? (
                              "You"
                            ) : (
                              <>
                                @
                                <Link
                                  to={`/dashboard/profile/@${replyComment.username}`}
                                  className="hover:underline"
                                >
                                  {replyComment.username}
                                </Link>
                              </>
                            )}
                          </h3>
                          <span className="text-gray-600">
                            ·{" "}
                            {replyComment.createdAt
                              ? dateFormater(replyComment.createdAt)
                              : null}
                          </span>
                        </div>
                        {replyComment.userId === user.userId && (
                          <div className="dropdown dropdown-end">
                            <label tabIndex={0}>
                              <Icon className="text-xl cursor-pointer">
                                more_vert
                              </Icon>
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[1] py-3 text-center text-sm font-semibold drop-shadow-card bg-base-100 rounded-box w-max list-none"
                            >
                              <li className="mx-5 mb-2 cursor-pointer hover:text-primary">
                                <button
                                  className="text-primary"
                                  onClick={() => handleEdit(replyComment)}
                                >
                                  Edit Comment
                                </button>
                              </li>
                              <Divider />
                              <li className="mx-5 mt-2 cursor-pointer hover:text-primary">
                                <button
                                  className="text-red-500"
                                  onClick={() =>
                                    handleDelete(replyComment.commentId)
                                  }
                                >
                                  Delete Comment
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <p>
                          <span className="text-blue-600">
                            {replyComment.mentionedUserId === user.userId ? (
                              "You"
                            ) : (
                              <>
                                @
                                <Link
                                  to={`/dashboard/profile/@${replyComment.mentionedUsername}`}
                                  className="hover:underline"
                                >
                                  {replyComment.mentionedUsername}
                                </Link>
                              </>
                            )}
                          </span>{" "}
                          {replyComment.comment}
                        </p>
                      </div>
                      <div className="mt-2">
                        <span
                          className="cursor-pointer text-gray-500 hover:text-gray-800"
                          onClick={() =>
                            handleReply(
                              comment.commentId,
                              replyComment.userId,
                              replyComment.username
                            )
                          }
                        >
                          reply
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {isEditing && (
        <EditComment
          comment={comment}
          showAlert={showAlert}
          onClose={handleClose}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      )}
      <div className="mt-12">
        <AddComment
          articleId={articleId}
          parentId={parentId}
          mentionedUserId={mentionedUserId}
          mentionedUsername={mentionedUsername}
          isReplying={isReplying}
          setIsReplying={setIsReplying}
          setComments={setComments}
          showAlert={showAlert}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      </div>
    </div>
  );
};

export default CommentSection;
