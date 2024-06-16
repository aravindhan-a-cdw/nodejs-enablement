const swaggerAutogen = require("swagger-autogen")();

// Swagger docs
const doc = {
  info: {
    title: "CDW Connect API",
    description: "This is an api for CDW Connect application",
  },
  host: "localhost:4000",
  definitions: {
    AddUser: {
      name: "Kokki Kumar",
      employeeId: "1007",
      email: "kokki.kumar@cdw.com",
      gender: "male",
      password: "SuperSecret",
      role: "user",
    },
    LoginUser: {
      email: "kokki.kumar@cdw.com",
      password: "SuperSecret",
    },
  },
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      in: "header", // can be 'header', 'query' or 'cookie'
      name: "Authorization", // name of the header, query parameter or cookie
      description:
        'Enter the token with the `Bearer: ` prefix, e.g. "Bearer abcde12345".',
    },
  },
  // components: {
  //   securitySchemes: {
  //     bearerAuth: {
  //       type: "http",
  //       scheme: "bearer",
  //     },
  //   },
  // },
};

const outputFile = "./public/swagger.json";
const routes = ["./app.js"];

swaggerAutogen(outputFile, routes, doc);
