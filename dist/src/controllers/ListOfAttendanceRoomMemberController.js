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
exports.ListOfAttendanceRoomMemberController = void 0;
const core_1 = require("@overnightjs/core");
const ListOfAttendanceRoomMemberRepository_1 = __importDefault(require("@src/repository/ListOfAttendanceRoomMemberRepository"));
const AuthenticateService = __importStar(require("@src/middlewares/services/AuthenticateService"));
const TelepresencaRepository_1 = __importDefault(require("@src/repository/TelepresencaRepository"));
const OperatorRepository_1 = __importDefault(require("@src/repository/OperatorRepository"));
const validator = __importStar(require("@src/middlewares/validators/listOfAttendanceRoomMember"));
const AttendanceRoomRepository_1 = __importDefault(require("@src/repository/AttendanceRoomRepository"));
let ListOfAttendanceRoomMemberController = class ListOfAttendanceRoomMemberController {
    async store(req, res) {
        try {
            const data = req.body;
            const isListOfAttendanceRoomMember = await ListOfAttendanceRoomMemberRepository_1.default.findOne(data);
            if (isListOfAttendanceRoomMember) {
                res.status(409).send({
                    msg: 'Member already exists',
                    erro: 'Conflict',
                    code: 409,
                });
                return;
            }
            const isAttendanceRooom = await AttendanceRoomRepository_1.default.getById(data.id_attendanceRoom);
            if (!isAttendanceRooom) {
                res.status(404).send({
                    msg: 'Attendance Room not found',
                    code: 404,
                    error: 'Not Found',
                });
                return;
            }
            let isMember;
            if (data.type === 'operator') {
                isMember = await OperatorRepository_1.default.getByID(data.id_member_operator);
            }
            else {
                isMember = await TelepresencaRepository_1.default.getById(data.id_member_telepresenca);
            }
            if (!isMember) {
                res.status(404).send({
                    msg: 'Member not found',
                    code: 404,
                    error: 'Not Found',
                });
                return;
            }
            const itemListOfAttendanceRoomMember = {
                ...data,
                name: isMember.name,
            };
            const result = await ListOfAttendanceRoomMemberRepository_1.default.store(itemListOfAttendanceRoomMember);
            if (!result) {
                res.status(500).send({
                    msg: 'Falha internar',
                    code: 500,
                    error: 'Internal Server Error',
                });
                return;
            }
            res.status(201).send(result);
        }
        catch (err) {
            res.status(500).send({
                msg: 'Falha internar',
                code: 500,
                error: 'Internal Server Error',
            });
        }
    }
    async remove(req, res) {
        try {
            const { id } = req.params;
            const result = await ListOfAttendanceRoomMemberRepository_1.default.remove(id);
            if (!result) {
                res.status(404).send({
                    error: 'Not Found',
                    code: 404,
                    msg: 'Member not found',
                });
                return;
            }
            res.status(200).send({
                msg: 'Request successful',
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
    core_1.Middleware([AuthenticateService.authenticate, AuthenticateService.isMaster]),
    core_1.Middleware(validator.store),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ListOfAttendanceRoomMemberController.prototype, "store", null);
__decorate([
    core_1.Delete(':id'),
    core_1.Middleware([AuthenticateService.authenticate, AuthenticateService.isMaster]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ListOfAttendanceRoomMemberController.prototype, "remove", null);
ListOfAttendanceRoomMemberController = __decorate([
    core_1.Controller('listOfAttendanceRoomMember')
], ListOfAttendanceRoomMemberController);
exports.ListOfAttendanceRoomMemberController = ListOfAttendanceRoomMemberController;
//# sourceMappingURL=ListOfAttendanceRoomMemberController.js.map