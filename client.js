"use strict";

const axios = require("axios");
const BASE_URL = process.env.BASE_URL || "https://eu1.anypoint.mulesoft.com/designcenter/api-designer";

module.exports = {
    get(credentials) {
        return axios.create({
            baseURL: BASE_URL,
            timeout: 5000,
            headers: {
                'Authorization': `Bearer ${credentials.token}`,
                "x-organization-id": credentials.organizationId,
                "x-owner-id": credentials.userId,
                "Accept": "application/json",
                "x-origin": "API Designer",
                "Content-Type": "application/json",
                "Accept-Encoding": "gzip, deflate, br"
            }
        });;
    }
};