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
const typeorm_1 = require("typeorm");
const _1 = require(".");
const ListOfAttendanceRoomMember_1 = __importDefault(require("./ListOfAttendanceRoomMember"));
let AttendanceRoom = class AttendanceRoom extends _1.BaseColumnSchemaPart {
};
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], AttendanceRoom.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => ListOfAttendanceRoomMember_1.default, (listOfAttendanceRoomMembers) => listOfAttendanceRoomMembers.id_attendanceRoom),
    __metadata("design:type", Array)
], AttendanceRoom.prototype, "members", void 0);
AttendanceRoom = __decorate([
    typeorm_1.Entity('attendanceRoom')
], AttendanceRoom);
exports.default = AttendanceRoom;
//# sourceMappingURL=AttendanceRoom.js.map