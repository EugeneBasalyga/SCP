/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const express = require("express");

const dbClass = require(global.__base + "utils/dbClass");


function _prepareObject(oUser, req) {
    oUser.changedBy = "DebugUser";
    return oUser;
}


module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        const logger = req.loggingContext.getLogger("/Application");
        logger.info('address get request');
        let tracer = req.loggingContext.getTracer(__filename);
        tracer.entering("/address", req, res);

        try {
            const db = new dbClass(req.db);
            const sSql = "SELECT * FROM \"ADDRESS_ST\"";
            const addresses = await db.executeQuery(sSql, []);
            tracer.exiting("/address", "address Get works");
            res.type("application/json").status(201).send(JSON.stringify(addresses));
        } catch (e) {
            tracer.catching("/address", e);
            next(e);
        }
    });

    app.get("/:adid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const adid = req.params.adid;

            const sSql = "SELECT * FROM \"ADDRESS_ST\" WHERE \"ADID\" = ?";
            const aValues = [ adid ];

            console.log(aValues);
            console.log(sSql);
            const oAddress = await db.executeQuery(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oAddress));
        } catch (e) {
            next(e);
        }
    });

    app.post("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);

            const oAddress = _prepareObject(req.body, req);
            oAddress.adid = await db.getNextval("adid");

            const sSql = "INSERT INTO \"ADDRESS_ST\" VALUES(?,?,?,?,?,?)";
            const aValues = [ oAddress.adid, oAddress.stid, oAddress.city, oAddress.street, oAddress.housenum, oAddress.flatnum ];

            console.log(aValues);
            console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oAddress));
        } catch (e) {
            next(e);
        }
    });

    app.delete("/:adid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const adid = req.params.adid;

            const sSql = "DELETE FROM \"ADDRESS_ST\" WHERE \"ADID\" = ?";
            const aValues = [ adid ];

            console.log(aValues);
            console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send("Success");
        } catch (e) {
            next(e);
        }
    });

    app.put("/:adid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const adid = req.params.stid;

            const oAddress = _prepareObject(req.body, req);
            const sSql = "UPDATE \"ADDRESS_ST\" " +
                "SET \"UNID\" = ?, \"NAME\" = ?, \"SURNAME\" = ?, \"EMAIL\" = ?, \"PHONENUMBER\" = ?" +
                "WHERE \"ADID\" = ?";
            const aValues = [ oAddress.unid, oAddress.city, oAddress.street, oAddress.housenum, oAddress.flatnum, adid ];

            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(200).send("Success");
        } catch (e) {
            next(e);
        }
    });

    return app;
};
