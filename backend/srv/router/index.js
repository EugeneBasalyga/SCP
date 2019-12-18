"use strict";

module.exports = (app, server) => {
    app.use("/students", require("./routes/students")());
    app.use("/universityGroups", require("./routes/universityGroups")());
};
