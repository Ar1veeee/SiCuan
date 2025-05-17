"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const apiResponse_util_1 = require("../utils/apiResponse.util");
// Middleware untuk validasi request body menggunakan Zod
const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    }
    catch (error) {
        apiResponse_util_1.apiResponse.badRequest(res, error.errors[0].message);
    }
};
exports.validate = validate;
