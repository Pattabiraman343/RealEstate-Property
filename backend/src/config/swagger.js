// config/swagger.js
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Real Estate API",
      version: "1.0.0",
      description: "Real Estate Listing Platform API",
    },

    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? "https://realestate-property-jq22.onrender.com" 
          : "http://localhost:5000",
        description: process.env.NODE_ENV === 'production' ? "Production Server" : "Development Server",
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

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;