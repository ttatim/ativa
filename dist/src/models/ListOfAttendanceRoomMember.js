"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeMember = void 0;
const typeorm_1 = require("typeorm");
const _1 = require(".");
const AttendanceRoom_1 = __importDefault(require("./AttendanceRoom"));
var TypeMember;
(function (TypeMember) {
    TypeMember["OPERATOR"] = "operator";
    TypeMember["TELEPRESENCA"] = "telepresenca";
})(TypeMember = exports.TypeMember || (exports.TypeMember = {}));
let ListOfAttendanceRoomMember = class ListOfAttendanceRoomMember extends _1.BaseColumnSchemaPart {
};
__decorate([
    typeorm_1.Column(),
    typeorm_1.ManyToOne(() => AttendanceRoom_1.default, (attendanceRoom) => attendanceRoom.id),
    typeorm_1.JoinColumn({ name: 'id_attendanceRoom' }),
    __metadata("design:type", String)
], ListOfAttendanceRoomMember.prototype, "id_attendanceRoom", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ListOfAttendanceRoomMember.prototype, "id_member_operator", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ListOfAttendanceRoomMember.prototype, "id_member_telepresenca", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ListOfAttendanceRoomMember.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: TypeMember,
        default: TypeMember.OPERATOR,
    }),
    __metadata("design:type", String)
], ListOfAttendanceRoomMember.prototype, "type", void 0);
ListOfAttendanceRoomMember = __decorate([
    typeorm_1.Entity('listOfAttendanceRoomMembers')
], ListOfAttendanceRoomMember);
exports.default = ListOfAttendanceRoomMember;
//# sourceMappingURL=ListOfAttendanceRoomMember.js.map