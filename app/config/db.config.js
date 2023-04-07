module.exports = {
  HOST: "127.0.0.1",
  port: "3306",
  HOST:"localhost",
  USER: "padmin",
  PASSWORD: "r3v1staS3d3na*", // It will come from SO enviroment:)
  DB: "database_development_refam",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
