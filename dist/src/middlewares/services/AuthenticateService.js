"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTelepresenca = exports.isOperator = exports.isMaster = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("@src/models/User"));
const OperatorRepository_1 = __importDefault(require("@src/repository/OperatorRepository"));
const TelepresencaRepository_1 = __importDefault(require("@src/repository/TelepresencaRepository"));
async function authenticate(req, res, next) {
    var _a;
    const token = (_a = req.headers) === null || _a === void 0 ? void 0 : _a['x-access-token'];
    if (!token) {
        res.status(401).send({
            msg: 'Restricted access',
            code: 401,
            error: 'Unauthorized',
        });
        return;
    }
    try {
        const decoded = (await jsonwebtoken_1.default.verify(token, process.env.TOKEN || 'ola'));
        req.decoded = { id: decoded.id };
        next();
    }
    catch (err) {
        res.status(401).send({
            msg: 'Restricted access',
            code: 401,
            error: 'Unauthorized',
        });
    }
}
exports.authenticate = authenticate;
async function isMaster(req, res, next) {
    const { id } = req.decoded;
    if (!id) {
        res.status(401).send({
            msg: 'Restricted access',
            code: 401,
            error: 'Unauthorized',
        });
        return;
    }
    try {
        const repository = typeorm_1.getRepository(User_1.default);
        const user = await repository.findOne({ where: { id } });
        if (!user) {
            res.status(401).send({
                msg: 'Restricted access',
                code: 401,
                error: 'Unauthorized',
            });
            return;
        }
        if (user.type !== 'master') {
            res.status(401).send({
                msg: 'Restricted function',
                code: 401,
                error: 'Unauthorized',
            });
            return;
        }
        next();
    }
    catch (err) {
        res.status(401).send({
            msg: 'Restricted access',
            code: 401,
            error: 'Unauthorized',
        });
    }
}
exports.isMaster = isMaster;
async function isOperator(req, res, next) {
    try {
        const { id } = req.decoded;
        if (!id) {
            res.status(401).send({
                msg: 'Restricted access',
                code: 401,
                error: 'Unauthorized',
            });
            return;
        }
        const operator = await OperatorRepository_1.default.getByID(id);
        if (!operator) {
            res.status(401).send({
                msg: 'Restricted access',
                code: 401,
                error: 'Unauthorized',
            });
            return;
        }
        next();
    }
    catch (err) {
        res.status(401).send({
            msg: 'Restricted access',
            code: 401,
            error: 'Unauthorized',
        });
    }
}
exports.isOperator = isOperator;
async function isTelepresenca(req, res, next) {
    try {
        const { id } = req.decoded;
        if (!id) {
            res.status(401).send({
                msg: 'Restricted access',
                code: 401,
                error: 'Unauthorized',
            });
            return;
        }
        const telepresenca = await TelepresencaRepository_1.default.getById(id);
        if (!telepresenca) {
            res.status(401).send({
                msg: 'Restricted access',
                code: 401,
                error: 'Unauthorized',
            });
            return;
        }
        next();
    }
    catch (err) {
        res.status(401).send({
            msg: 'Restricted access',
            code: 401,
            error: 'Unauthorized',
        });
    }
}
exports.isTelepresenca = isTelepresenca;
//# sourceMappingURL=AuthenticateService.js.map