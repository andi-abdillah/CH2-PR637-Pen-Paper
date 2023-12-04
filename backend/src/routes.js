const {
  addUserHandler,
  getAllUsersHandler,
  searchUsersHandler,
  getUserByIdHandler,
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
  getArticleByIdHandler,
  editArticleByIdHandler,
  deleteArticleByIdHandler,
} = require("./../controller/articleController");

const loginHandler = require("./../controller/loginController");

const registerHandler = require("./../controller/registerController");

const routes = [
  {
    method: "GET",
    path: "/",
    handler: () => "Welcome to Pen & Paper API",
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
    path: "/users/{userId}",
    handler: getUserByIdHandler,
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
    path: "/articles/{articleId}",
    handler: getArticleByIdHandler,
  },
  {
    method: "PUT",
    path: "/articles/{articleId}",
    handler: editArticleByIdHandler,
  },
  {
    method: "DELETE",
    path: "/articles/{articleId}",
    handler: deleteArticleByIdHandler,
  },
  // End of Articles Routes

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
