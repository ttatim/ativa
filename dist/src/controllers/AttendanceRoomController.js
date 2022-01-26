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
exports.prettyMemberList = exports.AttendanceRoom = void 0;
const AttendanceRoomRepository_1 = __importDefault(require("@src/repository/AttendanceRoomRepository"));
const core_1 = require("@overnightjs/core");
const validator = __importStar(require("@src/middlewares/validators/attendanceRoom-validator"));
const Authenticate = __importStar(require("@src/middlewares/services/AuthenticateService"));
const ListOfAttendanceRoomMember_1 = require("@src/models/ListOfAttendanceRoomMember");
let AttendanceRoom = class AttendanceRoom {
    async store(req, res) {
        try {
            const { name } = req.body;
            const isAttendaceRoom = await AttendanceRoomRepository_1.default.getByName(name);
            if (isAttendaceRoom) {
                res.status(409).send({
                    msg: 'Email already exists',
                    code: 409,
                    error: 'Conflit',
                });
                return;
            }
            const attendaceRoom = await AttendanceRoomRepository_1.default.store(name);
            if (!attendaceRoom) {
                res.status(500).send({
                    msg: 'Falha internar',
                    code: 500,
                    error: 'Internal Server Error',
                });
                return;
            }
            res.status(201).send(attendaceRoom);
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
    async getByName(req, res) {
        try {
            const name = req.query.name;
            const attendanceRooms = await AttendanceRoomRepository_1.default.getByNameMany(name);
            if (attendanceRooms)
                res.status(200).send(attendanceRooms);
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
    async getById(req, res) {
        try {
            const { id } = req.params || '';
            const attendanceListWithMember = await AttendanceRoomRepository_1.default.getByIdWithMember(id);
            if (!attendanceListWithMember) {
                res.status(200).send([]);
                return;
            }
            const members = (attendanceListWithMember === null || attendanceListWithMember === void 0 ? void 0 : attendanceListWithMember.members) || [];
            const prettyAttendanceListWithMember = {
                ...attendanceListWithMember,
                members: prettyMemberList(members),
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
};
__decorate([
    core_1.Post(),
    core_1.Middleware([Authenticate.authenticate, Authenticate.isMaster]),
    core_1.Middleware(validator.store),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AttendanceRoom.prototype, "store", null);
__decorate([
    core_1.Get(),
    core_1.Middleware([Authenticate.authenticate, Authenticate.isMaster]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AttendanceRoom.prototype, "getByName", null);
__decorate([
    core_1.Get(':id'),
    core_1.Middleware([Authenticate.authenticate, Authenticate.isOperator]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AttendanceRoom.prototype, "getById", null);
AttendanceRoom = __decorate([
    core_1.Controller('attendanceRoom')
], AttendanceRoom);
exports.AttendanceRoom = AttendanceRoom;
function prettyMemberList(list) {
    return list.map((element) => {
        const id_member = element.type === ListOfAttendanceRoomMember_1.TypeMember.OPERATOR
            ? element.id_member_operator
            : element.id_member_telepresenca;
        const { createdAt, updatedAt, id, type, name } = element;
        return {
            id_member,
            type,
            createdAt,
            updatedAt,
            id,
            name,
        };
    });
}
exports.prettyMemberList = prettyMemberList;
//# sourceMappingURL=AttendanceRoomController.js.map