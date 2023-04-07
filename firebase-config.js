var admin = require("firebase-admin");
console.log(admin)
var serviceAccount = require("./firebase-config.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: serviceAccount.databaseURL
})

module.exports.admin = admin