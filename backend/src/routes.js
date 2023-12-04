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

const loginController = require("./../controller/loginController");

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
    handler: loginController,
    config: {
      auth: false,
    },
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
    method: "POST",
    path: "/users",
    handler: addUserHandler,
    config: {
      auth: false,
    },
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
    handler: (request, h) =>
      h.response({ status: "fail", message: "Resource not found" }).code(404),
    config: {
      auth: false,
    },
  },
];

module.exports = routes;
