"use strict";

module.exports = (app, server) => {
    app.use("/students", require("./routes/students")());
    app.use("/universityGroups", require("./routes/universityGroups")());
    app.use("/address", require("./routes/address")());
    app.use("/dest", require("./routes/dest")());
    app.use("/business-partners", require("./routes/business-partners")());
};
