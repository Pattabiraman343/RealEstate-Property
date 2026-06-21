// config/swagger.js
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
      },
    ],
    // ... rest of your config
  },
  apis: ["./src/routes/*.js"],
};