module.exports = (sequelize, {STRING , INTEGER}) => {
    const User = sequelize.define("users", {
        grade: {
            type: STRING
        },
        speciality: {
            type: STRING
        },
        completeName: {
            type: STRING
        },
        status: {
            type: INTEGER
        },
        enrollment: {
            type: STRING
        },
        email: {
            type: STRING
        },
        militarRegion: {
            type: STRING
        },
        militarZone: {
            type: STRING
        },
        militarUnity: {
            type: STRING
        },
        birthDate: {
            type: STRING
        },
        gender: {
            type: STRING
        },
        password: {
            type: STRING
        },
        tokenFirebase:{
            type: STRING
        },
        role:{
            type: STRING
        },
        os:{
            type: STRING
        }
    });

    return User;
};
