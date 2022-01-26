"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const core_1 = require("@overnightjs/core");
const UserRepository_1 = __importDefault(require("@src/repository/UserRepository"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validator = __importStar(require("@src/middlewares/validators/user-validator"));
const AuthenticateService_1 = require("@src/middlewares/services/AuthenticateService");
let UserController = class UserController {
    async signin(req, res) {
        try {
            const { login, password } = req.body;
            const user = await UserRepository_1.default.getByEmailOrLogin(login);
            if (!user) {
                res.status(401).send({
                    msg: `Unauthorized access`,
                    code: 401,
                    error: 'Unauthorized',
                });
                return;
            }
            const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
            if (!isValidPassword) {
                res.status(401).send({
                    msg: `Unauthorized access`,
                    code: 401,
                    error: 'Unauthorized',
                });
                return;
            }
            const token = await jsonwebtoken_1.default.sign({ id: user.id }, process.env.TOKEN || 'ola');
            res.status(200).send({
                data: { id: user.id, name: user.name },
                token,
            });
            res.status(200).send();
        }
        catch (err) {
            res.status(500).send({
                msg: 'Falha internar',
                code: 500,
                error: 'Internal Server Error',
            });
        }
    }
    async setPassword(req, res) {
        try {
            const { old_password, new_password } = req.body;
            const { id } = req.decoded;
            if (!id) {
                res.status(401).send({
                    msg: 'Restricted access',
                    code: 401,
                    error: 'Unauthorized',
                });
                return;
            }
            const user = await UserRepository_1.default.getById(id);
            if (!user) {
                res.status(403).send({
                    msg: 'Restricted access',
                    code: 401,
                    error: 'Unauthorized',
                });
                return;
            }
            const isValidPassword = await bcryptjs_1.default.compare(old_password, user.password);
            if (!isValidPassword) {
                res.status(401).send({
                    msg: `Unauthorized access`,
                    code: 401,
                    error: 'Unauthorized',
                });
                return;
            }
            const setPassoword = await bcryptjs_1.default.hashSync(new_password, 8);
            const result = await UserRepository_1.default.setPassoword(setPassoword, id);
            if (result) {
                res.status(200).send({
                    msg: 'Successful process',
                });
            }
            res.status(200).send();
        }
        catch (err) {
            res.status(500).send({
                msg: 'Falha internar',
                code: 500,
                error: 'Internal Server Error',
            });
        }
    }
};
__decorate([
    core_1.Post('signin'),
    core_1.Middleware(validator.signin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signin", null);
__decorate([
    core_1.Put('password'),
    core_1.Middleware(AuthenticateService_1.authenticate),
    core_1.Middleware(validator.setPassword),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setPassword", null);
UserController = __decorate([
    core_1.Controller('user')
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map