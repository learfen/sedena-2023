{
  "name": "refam_back",
  "version": "1.0.0",
  "description": "REFAM BACK app",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "node.js",
    "api",
    "authentication",
    "express",
    "mysql"
  ],
  "author": "Leonardo Aguilar",
  "license": "",
  "dependencies": {
    "axios": "^0.21.0",
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.19.0",
    "chart.js": "^3.5.0",
    "chartjs": "^0.3.24",
    "cors": "^2.8.5",
    "dom-to-image": "^2.6.0",
    "dotenv": "^8.2.0",
    "ejs": "^3.1.3",
    "ejs-lint": "^1.1.0",
    "exceljs": "^4.2.0",
    "express": "^4.17.1",
    "firebase": "^8.0.2",
    "firebase-admin": "^9.1.1",
    "forever": "^4.0.1",
    "gm": "^1.23.1",
    "gmail-send": "^1.8.10",
    "grapesjs": "^0.16.27",
    "html-to-image": "^0.1.3",
    "https": "^1.0.0",
    "jimp": "^0.16.1",
    "jsonwebtoken": "^8.5.1",
    "jwt-simple": "^0.5.6",
    "moment": "^2.29.1",
    "morgan": "^1.10.0",
    "multer": "^1.3.0",
    "mysql2": "^2.2.5",
    "node-html-to-image": "^3.1.0",
    "nodemailer": "^6.5.0",
    "nodemon": "^2.0.6",
    "otplib": "^12.0.1",
    "sequelize": "^5.22.3",
    "sequelize-cli": "^5.5.1",
    "set-tz": "^0.2.0",
    "validator": "^13.1.17"
  },
  "targets": [
    {
      "target_name": "binding",
      "sources": [
        "src/binding.cc"
      ]
    }
  ]
}
