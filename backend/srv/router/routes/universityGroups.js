/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const express = require("express");

const dbClass = require(global.__base + "utils/dbClass");
//const cloudServices = require(global.__base + "utils/cloudServices");

function _prepareObject(oUser, req) {
    oUser.changedBy = "DebugUser";
    return oUser;
}


module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const sSql = "SELECT * FROM \"UNIVERSITYGROUP\"";
            const unGroups = await db.executeQuery(sSql, []);
            res.type("application/json").status(201).send(JSON.stringify(unGroups));
        } catch (e) {
            next(e);
        }
    });

    app.get("/:unid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const unid = req.params.unid;

            const sSql = "SELECT * FROM \"UNIVERSITYGROUP\" WHERE \"UNID\" = ?";
            const aValues = [ unid ];

            console.log(aValues);
            console.log(sSql);
            const oUnGroup = await db.executeQuery(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oUnGroup));
        } catch (e) {
            next(e);
        }
    });

    app.post("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);

            const oUnGroup = _prepareObject(req.body, req);
            oUnGroup.unid = await db.getNextval("unid");

            const sSql = "INSERT INTO \"UNIVERSITYGROUP\" VALUES(?,?,?,?)";
            const aValues = [ oUnGroup.unid, oUnGroup.name, oUnGroup.studentsCount, oUnGroup.curatorName ];

            console.log(aValues);
            console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oUnGroup));
        } catch (e) {
            next(e);
        }
    });

    app.delete("/:unid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const unid = req.params.unid;

            const sSql = "DELETE FROM \"UNIVERSITYGROUP\" WHERE \"UNID\" = ?";
            const aValues = [ unid ];

            console.log(aValues);
            console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send("Success");
        } catch (e) {
            next(e);
        }
    });

    app.put("/:unid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const unid = req.params.unid;

            const oUnGroup = _prepareObject(req.body, req);
            const sSql = "UPDATE \"STUDENT\" " +
                "SET \"UNID\" = ?, \"NAME\" = ?, \"STUDENTSCOUNT\" = ?, \"CURATORNAME\" = ?" +
                "WHERE \"STID\" = ?";
            const aValues = [ oUnGroup.unid, oUnGroup.name, oUnGroup.studentsCount, oUnGroup.curatorName ];

            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(200).send("Success");
        } catch (e) {
            next(e);
        }
    });

    return app;
};
