const {
  getAllUsersHandler,
  searchUsersHandler,
  getUserByIdHandler,
  getUserByUsernameHandler,
  editUserProfileHandler,
  editUserPasswordHandler,
  editUserDescriptionsHandler,
  deleteUserByIdHandler,
} = require("./../controller/userController");

const {
  addArticleHandler,
  getAllArticlesHandler,
  searchArticlesHandler,
  getArticlesByUserIdHandler,
  getArticleBySlugHandler,
  editArticleBySlugHandler,
  deleteArticleBySlugHandler,
} = require("./../controller/articleController");

const loginHandler = require("./../controller/loginController");

const registerHandler = require("./../controller/registerController");

const loginWithOauth = require("./../controller/OauthController");

const sendResetPasswordMail = require("./../controller/sendResetPasswordMail");

const {
  addLikeHandler,
  removeLikeHandler,
} = require("./../controller/likeController");

const {
  addBookmarkHandler,
  getBookmarksForUserHandler,
  removeBookmarkHandler,
} = require("./../controller/bookmarkController");

const routes = [
  {
    method: "GET",
    path: "/",
    handler: () => "Welcome to Pen & Paper API",
  },

  {
    method: "POST",
    path: "/reset-password",
    config: {
      auth: false,
    },
    handler: sendResetPasswordMail,
  },

  //Login Route
  {
    method: "POST",
    path: "/login",
    config: {
      auth: false,
    },
    handler: loginHandler,
  },

  // OAuth Route to Initiate Google Sign-In
  {
    method: "POST",
    path: "/auth/google",
    config: {
      auth: false,
    },
    handler: loginWithOauth,
  },

  //Register Route
  {
    method: "POST",
    path: "/register",
    config: {
      auth: false,
    },
    handler: registerHandler,
  },

  // Start of Users Routes
  {
    method: "GET",
    path: "/users",
    handler: getAllUsersHandler,
  },
  {
    method: "GET",
    path: "/users/search",
    handler: searchUsersHandler,
  },
  {
    method: "GET",
    path: "/articles/user/{userId}",
    handler: getArticlesByUserIdHandler,
  },
  {
    method: "GET",
    path: "/users/id/{userId}",
    handler: getUserByIdHandler,
  },
  {
    method: "GET",
    path: "/users/username/{username}",
    handler: getUserByUsernameHandler,
  },
  {
    method: "PUT",
    path: "/users/{userId}/profile",
    handler: editUserProfileHandler,
  },
  {
    method: "PUT",
    path: "/users/{userId}/password",
    handler: editUserPasswordHandler,
  },
  {
    method: "PUT",
    path: "/users/{userId}/descriptions",
    handler: editUserDescriptionsHandler,
  },
  {
    method: "DELETE",
    path: "/users/{userId}",
    handler: deleteUserByIdHandler,
  },
  // End of Users Routes

  // Start of Articles Routes
  {
    method: "GET",
    path: "/articles",
    handler: getAllArticlesHandler,
  },
  {
    method: "GET",
    path: "/articles/search",
    handler: searchArticlesHandler,
  },
  {
    method: "POST",
    path: "/articles",
    handler: addArticleHandler,
  },
  {
    method: "GET",
    path: "/articles/{slug}",
    handler: getArticleBySlugHandler,
  },
  {
    method: "PUT",
    path: "/articles/{slug}",
    handler: editArticleBySlugHandler,
  },
  {
    method: "DELETE",
    path: "/articles/{slug}",
    handler: deleteArticleBySlugHandler,
  },
  // End of Articles Routes

  // Start of Like Routes
  {
    method: "POST",
    path: "/article/likes",
    handler: addLikeHandler,
  },
  {
    method: "DELETE",
    path: "/article/likes",
    handler: removeLikeHandler,
  },

  // Start of Bookmark Routes
  {
    method: "POST",
    path: "/bookmarks",
    handler: addBookmarkHandler,
  },
  {
    method: "GET",
    path: "/bookmarks",
    handler: getBookmarksForUserHandler,
  },
  {
    method: "DELETE",
    path: "/bookmarks",
    handler: removeBookmarkHandler,
  },
  // End of Bookmark Routes

  // Not Found Handler
  {
    method: "*",
    path: "/{any*}",
    config: {
      auth: false,
    },
    handler: (request, h) =>
      h.response({ status: "fail", message: "Resource not found" }).code(404),
  },
];

module.exports = routes;
