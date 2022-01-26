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
exports.OperatorController = void 0;
const core_1 = require("@overnightjs/core");
const OperatorRepository_1 = __importDefault(require("@src/repository/OperatorRepository"));
const Validator = __importStar(require("@src/middlewares/validators/operator-validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthService = __importStar(require("@src/middlewares/services/AuthenticateService"));
const AttendanceRoomRepository_1 = __importDefault(require("@src/repository/AttendanceRoomRepository"));
const ListOfAttendanceRoomMemberRepository_1 = __importDefault(require("@src/repository/ListOfAttendanceRoomMemberRepository"));
const AttendanceRoomController_1 = require("@src/controllers/AttendanceRoomController");
let OperatorController = class OperatorController {
    async store(req, res) {
        const { name, email, password } = req.body;
        const alreadyExist = await OperatorRepository_1.default.findByEmail(email);
        if (alreadyExist) {
            res.status(409).send({
                msg: 'Email already exists',
                code: 409,
                error: 'Conflit',
            });
            return;
        }
        const result = await OperatorRepository_1.default.store({
            name,
            email,
            password,
        });
        res.status(201).send({ ...result, password: undefined });
    }
    async signin(req, res) {
        try {
            const { email, password } = req.body;
            let operator = await OperatorRepository_1.default.findOne({ email });
            if (!operator) {
                res.status(401).send({
                    msg: `Unauthorized access`,
                    code: 401,
                    error: 'Unauthorized',
                });
                return;
            }
            const isValidPassword = await bcryptjs_1.default.compare(password, operator.password);
            if (!isValidPassword) {
                res.status(401).send({
                    msg: `Unauthorized access`,
                    code: 401,
                    error: 'Unauthorized',
                });
                return;
            }
            const token = await jsonwebtoken_1.default.sign({ id: operator.id }, process.env.TOKEN || 'ola');
            res.status(200).send({
                operator: { ...operator, password: undefined },
                token,
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
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const isRequested = await OperatorRepository_1.default.forgotPassword(email);
            if (isRequested) {
                res.status(201).send({
                    msg: 'Request success',
                });
            }
            else {
                res.status(404).send({
                    code: 404,
                    msg: 'Email not found',
                    error: 'Not Found',
                });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).send({
                msg: 'Falha internar',
                code: 500,
                error: 'Internal Server Error',
            });
        }
    }
    async setForgotPassword(req, res) {
        try {
            const { request, email, password } = req.body;
            const operator = await OperatorRepository_1.default.findByEmail(email);
            if (!operator) {
                res.status(404).send({
                    msg: 'Email not found',
                    code: 404,
                    error: 'Not Found',
                });
                return;
            }
            if (!operator.request || operator.request !== request) {
                res.status(404).send({
                    msg: 'Request not found',
                    code: 404,
                    error: 'Not Found',
                });
                return;
            }
            const isSetForgotPassowrd = await OperatorRepository_1.default.setForgotPassword(email, password);
            if (isSetForgotPassowrd) {
                res.status(200).send({ msg: 'Request Success' });
                return;
            }
            res.status(500).send({
                msg: 'Falha internar',
                code: 500,
                error: 'Internal Server Error',
            });
        }
        catch (err) {
            console.log(err);
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
            const isMemberOfAnyListOfAttendance = await ListOfAttendanceRoomMemberRepository_1.default.findOne({ id_member_operator: id });
            if (!isMemberOfAnyListOfAttendance) {
                res.status(404).send({
                    code: 404,
                    error: 'Not Found',
                    msg: 'Attendance Room not found',
                });
                return;
            }
            const attendanceRoomWithMembers = await AttendanceRoomRepository_1.default.getByIdWithMember(isMemberOfAnyListOfAttendance.id_attendanceRoom);
            if (!attendanceRoomWithMembers) {
                res.status(404).send({
                    code: 404,
                    error: 'Not Found',
                    msg: 'Attendance Room not found',
                });
                return;
            }
            const members = (attendanceRoomWithMembers === null || attendanceRoomWithMembers === void 0 ? void 0 : attendanceRoomWithMembers.members) || [];
            const prettyAttendanceListWithMember = {
                ...attendanceRoomWithMembers,
                members: AttendanceRoomController_1.prettyMemberList(members),
            };
            res.status(200).send(prettyAttendanceListWithMember);
        }
        catch (err) {
            console.log(err);
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
        const operator = await OperatorRepository_1.default.getByID(id);
        if (!operator) {
            res.status(401).send({
                msg: 'Restricted access',
                code: 401,
                error: 'Unauthorized',
            });
            return;
        }
        const token = await jsonwebtoken_1.default.sign({ id: operator.id }, process.env.TOKEN || 'ola');
        res.status(200).send({
            operator: { ...operator, password: undefined },
            token,
        });
    }
};
__decorate([
    core_1.Post(),
    core_1.Middleware(AuthService.authenticate),
    core_1.Middleware(AuthService.isMaster),
    core_1.Middleware(Validator.store),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperatorController.prototype, "store", null);
__decorate([
    core_1.Post('signin'),
    core_1.Middleware(Validator.authenticate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperatorController.prototype, "signin", null);
__decorate([
    core_1.Post('forgotPassword'),
    core_1.Middleware(Validator.forgotPassword),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperatorController.prototype, "forgotPassword", null);
__decorate([
    core_1.Put('forgotPassword'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperatorController.prototype, "setForgotPassword", null);
__decorate([
    core_1.Get('room'),
    core_1.Middleware([AuthService.authenticate, AuthService.isOperator]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperatorController.prototype, "getRoom", null);
__decorate([
    core_1.Get('checkMe'),
    core_1.Middleware(AuthService.authenticate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperatorController.prototype, "checkToken", null);
OperatorController = __decorate([
    core_1.Controller('operator')
], OperatorController);
exports.OperatorController = OperatorController;
//# sourceMappingURL=OperatorController.js.map