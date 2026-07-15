const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SecureAuth API",
      version: "1.0.0",
      description:
        "Secure authentication API built with Node.js, Express.js, MongoDB, Redis, JWT, Google OAuth and Two-Factor Authentication.",
      contact: {
        name: "Pujan Kadecha",
        email: "pujannk@gmail.com",
      },
    },

    servers: [
      {
        url: "http://localhost:5050",
        description: "Local Development",
      },
      {
        url: "https://secureauth-backend-udsa.onrender.com/api",
        description: "Production",
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

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./routes/*.js", "./docs/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
