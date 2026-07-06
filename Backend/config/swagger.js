const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Authentication API",
      version: "1.0.0",
      description:
        "Secure Authentication API built using Express, MongoDB and JWT",
    },

    servers: [
      {
        url: "http://localhost:5050/api",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./routes/*.js"],
};

module.exports = swaggerJsDoc(options);
