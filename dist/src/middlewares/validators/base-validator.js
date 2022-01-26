"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const express_validator_1 = require("express-validator");
const validation = (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors);
    }
    else
        next();
};
exports.validation = validation;
//# sourceMappingURL=base-validator.js.map