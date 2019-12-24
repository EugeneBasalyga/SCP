/*eslint no-unused-vars: 0, no-undef:0, no-process-exit:0, new-cap:0*/
/*eslint-env node, es6 */
"use strict";

const dbClass = require(global.__base + "utils/dbClass");
const hdbext = require("@sap/hdbext");

const addWhereClause = (req, aWhere) => {
    req.query.SELECT.where = req.query.SELECT.where ?
        req.query.SELECT.where.concat(["and"]).concat(aWhere) :
        aWhere;

};
const getStudentIdClause = sStId => [{ref: ["stid"]}, ">", {val: sStId}];
const getLangClause = sLang => [{ref: ["lang"]}, "=", {val: sLang}];

module.exports = function () {
    // this.before("READ", req => {
    //     req.log.debug(`BEFORE_READ ${req.target["@Common.Label"]}`);
    //
    //
    //     //restrict by lang
    //     // addWhereClause(req, getLangClause("EN"));
    // });

    this.on("CREATE", "Students", async (User) => {
        req.log.debug(`ON CREATE ${req.target["@Common.Label"]}`);

        const {
            data
        } = User;
        if (data.length < 1) {
            return null;
        }

        const dbClass = require(global.__base + "utils/dbPromises");
        var client = await dbClass.createConnection();
        let db = new dbClass(client);

        if (!data.USID) {
            data.USID = await db.getNextval("usid");
//		throw new Error(`Invalid email for ${data.FIRSTNAME}. No Way! E-Mail must be valid and ${data.EMAIL} has problems`);
        }

        const sSql = `INSERT INTO "USER" VALUES(?,?)`
        const aValues = [oUser.usid, oUser.name];

        req.log.debug(aValues);
        req.log.debug(sSql);
        await db.executeUpdate(sSql, aValues);

        return data;
    });


    this.before("READ", "Students", req => {
        addWhereClause(req, getStudentIdClause("0"));
    });

};
