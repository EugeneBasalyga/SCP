/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";

const request = require('request-promise');
const xsenv = require("@sap/xsenv");

//begin----------GETTING CONFIGURATIONS-------------
const zbas_uaa = xsenv.getServices({
    xsuaa: {
        tag: "xsuaa"
    }
}).xsuaa;

const zbas_conn = xsenv.getServices({
    conn: {
        tag: "connectivity"
    }
}).conn;

const zbas_dest = xsenv.getServices({
    dest: {
        tag: "destination"
    }
}).dest;

const sUaaUrl = zbas_uaa.url;

const sConnProxy = `http://${zbas_conn.onpremise_proxy_host}:${zbas_conn.onpremise_proxy_port}`;
const sConnSecret = `${zbas_conn.clientid}:${zbas_conn.clientsecret}`;
const sConnCredentials = Buffer.from(sConnSecret).toString('base64');

const sDestUrl = zbas_dest.url;
const sDestSecret = `${zbas_dest.clientid}:${zbas_dest.clientsecret}`;
const sDestCredentials = Buffer.from(sDestSecret).toString('base64');
//end----------GETTING CONFIGURATIONS-------------


//begin----------PREPARING REQUEST DATA TO GET AUTENTIFICATION TOKEN-------------
const _getUaaTokenOptions = (credentials, clientid) => {
    return {
        url: `${sUaaUrl}/oauth/token`,
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + credentials,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'client_id': clientid,
            'grant_type': 'client_credentials'
        }
    };
};
//end----------PREPARING REQUEST DATA TO GET AUTENTIFICATION TOKEN-------------

//begin----------SEND REQEST TO GET AUTENTIFICATION TOKEN-------------
const getUaaToken = async (sCredentials, clientId) => {
    const oAccessTokenOptions = _getUaaTokenOptions(sCredentials, clientId);
    return JSON.parse(await request(oAccessTokenOptions));
};
//end----------SEND REQEST TO GET AUTENTIFICATION TOKEN-------------


//begin----------GET LIST OF ON PREMISE SYSTEMS DEFINED IN CLOUD-------------
const getOnPremiseSystems = async () => {
    const sDestAccessToken = (await getUaaToken(sDestCredentials, zbas_dest.clientid)).access_token;

    const oRequestOptions = {
        url: `${zbas_dest.uri}/destination-configuration/v1/subaccountDestinations`,
        headers: {
            'Authorization': 'Bearer ' + sDestAccessToken
        }
    };

    return JSON.parse(await request(oRequestOptions));
};
//end----------GET LIST OF ON PREMISE SYSTEMS DEFINED IN CLOUD-------------


//begin----------GET ON PREMISE SYSTEMS DEFINED IN CLOUD BY ID-------------
const getOnPremiseSystemById = async systemId => {
    const sDestAccessToken = (await getUaaToken(sDestCredentials, zbas_dest.clientid)).access_token;

    const oRequestOptions = {
        url: `${zbas_dest.uri}/destination-configuration/v1/destinations/${systemId}`,
        headers: {
            'Authorization': 'Bearer ' + sDestAccessToken
        }
    };

    return JSON.parse(await request(oRequestOptions));
};
//end----------GET ON PREMISE SYSTEMS DEFINED IN CLOUD BY ID-------------


//begin----------GETTING DATA FROM ON PREMISE SYSTEM-------------
const getOnPremiseSystemData = async (onPremiseSystem, sLang) => {
    if(!onPremiseSystem.authTokens) {
        throw new Error("Error");
    }

    const sConnAccessToken = (await getUaaToken(sConnCredentials, zbas_conn.clientid)).access_token;

    const sEndpoint = onPremiseSystem.destinationConfiguration.URL +
//-----------change code here to get another data
        "/sap/opu/odata/sap/ZLX_CC_GW_EXAMPLE_SRV/CarSet" +
        "?sap-language=" + sLang.toLowerCase() +
        "&$format=json";

    const oRequestOptions = {
        url: sEndpoint,
        method: 'GET',
        headers: {
            'Proxy-Authorization': 'Bearer ' + sConnAccessToken,
            'Authorization': `${onPremiseSystem.authTokens[0].type} ${onPremiseSystem.authTokens[0].value}`
        },
        proxy: sConnProxy
    };

    return JSON.parse(await request(oRequestOptions));
};


module.exports = {
    getUaaToken: getUaaToken,

    getOnPremiseSystems: getOnPremiseSystems,
    getOnPremiseSystemById: getOnPremiseSystemById,

    getOnPremiseSystemData: getOnPremiseSystemData
};
