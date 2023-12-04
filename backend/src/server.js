const Hapi = require("@hapi/hapi");
const Jwt = require("hapi-auth-jwt2");
const routes = require("./routes");
const validate = require("./utils/validate");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register(Jwt);

  server.auth.strategy("jwt", "jwt", {
    key: process.env.secretKey,
    validate,
    verifyOptions: {
      algorithms: ["HS256"],
    },
  });

  server.auth.default("jwt");
  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
