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
exports.TelepresencaController = void 0;
const core_1 = require("@overnightjs/core");
const TelepresencaRepository_1 = __importDefault(require("@src/repository/TelepresencaRepository"));
const validator = __importStar(require("@src/middlewares/validators/telepresenca-validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthService = __importStar(require("@src/middlewares/services/AuthenticateService"));
const ListOfAttendanceRoomMemberRepository_1 = __importDefault(require("@src/repository/ListOfAttendanceRoomMemberRepository"));
let TelepresencaController = class TelepresencaController {
    async store(req, res) {
        try {
            const { name, login, password } = req.body;
            const loginAlreadyExists = await TelepresencaRepository_1.default.getByLogin(login);
            if (loginAlreadyExists) {
                res.status(409).send({
                    msg: 'Login already exists',
                    code: 409,
                    error: 'Conflit',
                });
                return;
            }
            const result = await TelepresencaRepository_1.default.store({
                name,
                login,
                password,
            });
            res.status(201).send({ ...result, password: undefined });
        }
        catch (err) {
            res.status(500).send({
                msg: 'Falha internar',
                code: 500,
                error: 'Internal Server Error',
            });
        }
    }
    async checkToken(req, res) {
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
        const token = await jsonwebtoken_1.default.sign({ id: telepresenca.id }, process.env.TOKEN || 'ola');
        res.status(200).send({
            token,
            data: {
                login: telepresenca.login,
                name: telepresenca.name,
                id: telepresenca.id,
            },
        });
    }
    async getMany(req, res) {
        try {
            const { name, login } = req.query;
            const telepresenca = await TelepresencaRepository_1.default.getMany({
                name,
                login,
            });
            if (telepresenca) {
                res
                    .status(200)
                    .send(telepresenca.map((element) => ({ ...element, password: undefined })));
                return;
            }
            res.status(500).send({
                msg: 'Falha internar',
                code: 500,
                error: 'Internal Server Error',
            });
        }
        catch (err) {
            res.status(500).send({
                msg: 'Falha internar',
                code: 500,
                error: 'Internal Server Error',
            });
        }
    }
    async signin(req, res) {
        try {
            const { login, password } = req.body;
            const telepresencaToAutheticate = await TelepresencaRepository_1.default.getWithPassword(login);
            if (!telepresencaToAutheticate) {
                res.status(404).send({
                    error: 'Not found',
                    code: 404,
                    msg: 'Login or password invalid',
                });
                return;
            }
            const isValidPassword = await bcryptjs_1.default.compare(password, telepresencaToAutheticate.password);
            if (!isValidPassword) {
                res.status(404).send({
                    error: 'Not found',
                    code: 404,
                    msg: 'Login or password invalid',
                });
                return;
            }
            const token = await jsonwebtoken_1.default.sign({ id: telepresencaToAutheticate.id }, process.env.TOKEN || 'ola');
            res.status(200).send({
                token,
                data: {
                    login: telepresencaToAutheticate.login,
                    name: telepresencaToAutheticate.name,
                    id: telepresencaToAutheticate.id,
                },
            });
        }
        catch (err) {
            res.status(500).send({
                msg: 'Falha internar',
                code: 500,
                error: 'Internal Server Error',
            });
        }
    }
    async getRoom(req, res) {
        try {
            const id = req.decoded.id || '';
            const itemListOfAttendanceRoomMember = await ListOfAttendanceRoomMemberRepository_1.default.findOne({ id_member_telepresenca: id });
            res.status(200).send(itemListOfAttendanceRoomMember);
        }
        catch (err) {
            res.status(500).send({
                msg: 'Falha internar',
                code: 500,
                error: 'Internal Server Error',
            });
        }
    }
    async getById(req, res) {
        try {
            const id = req.params.id;
            if (!id || typeof id !== 'string') {
                res.status(400).send({
                    msg: 'Bad request',
                    code: 400,
                    error: 'Not Found',
                });
            }
            const telepresenca = await TelepresencaRepository_1.default.getById(id);
            if (telepresenca) {
                res.status(200).send(telepresenca);
                return;
            }
            res.status(404).send({
                msg: 'Request not found',
                code: 404,
                error: 'Not Found',
            });
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
            const { id, password } = req.body;
            const isSetPassowrd = await TelepresencaRepository_1.default.setPassword(id, password);
            if (isSetPassowrd) {
                res.status(200).send({ msg: 'Request Success' });
                return;
            }
            res.status(404).send({
                msg: 'Telepresenca not found',
                code: 404,
                error: 'Not found',
            });
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
    core_1.Post(),
    core_1.Middleware(AuthService.authenticate),
    core_1.Middleware(AuthService.isMaster),
    core_1.Middleware(validator.store),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelepresencaController.prototype, "store", null);
__decorate([
    core_1.Get('checkMe'),
    core_1.Middleware(AuthService.authenticate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelepresencaController.prototype, "checkToken", null);
__decorate([
    core_1.Get(),
    core_1.Middleware(AuthService.authenticate),
    core_1.Middleware(validator.getMany),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelepresencaController.prototype, "getMany", null);
__decorate([
    core_1.Post('signin'),
    core_1.Middleware(validator.authenticate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelepresencaController.prototype, "signin", null);
__decorate([
    core_1.Get('room'),
    core_1.Middleware([AuthService.authenticate, AuthService.isTelepresenca]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelepresencaController.prototype, "getRoom", null);
__decorate([
    core_1.Get(':id'),
    core_1.Middleware(AuthService.authenticate),
    core_1.Middleware(validator.getById),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelepresencaController.prototype, "getById", null);
__decorate([
    core_1.Put('password'),
    core_1.Middleware(AuthService.authenticate),
    core_1.Middleware(AuthService.isMaster),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelepresencaController.prototype, "setPassword", null);
TelepresencaController = __decorate([
    core_1.Controller('telepresenca')
], TelepresencaController);
exports.TelepresencaController = TelepresencaController;
//# sourceMappingURL=TelepresencaController.js.map