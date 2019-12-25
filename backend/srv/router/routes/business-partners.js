"use strict";
const { BusinessPartner } = require('@sap/cloud-sdk-vdm-business-partner-service');
const express = require("express");


async function getAllBusinessPartners() {
    return BusinessPartner.requestBuilder()
        .getAll()
        .execute({
            destinationName: 'S4G'
        });
}

module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        getAllBusinessPartners()
        .then(businessPartners => {
            res.status(200).send(businessPartners);
        })
        .catch(error => {
            res.status(500).send(error.message);
        })
    });

    return app;
};