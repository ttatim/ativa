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
exports.ScreenController = void 0;
const core_1 = require("@overnightjs/core");
const TelepresencaRepository_1 = __importDefault(require("@src/repository/TelepresencaRepository"));
let ScreenController = class ScreenController {
    async operator(req, res) {
        try {
            res.render('operador');
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
    async operatorSignin(req, res) {
        try {
            res.render('login-operador');
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
    async telepresenca(req, res) {
        try {
            res.render('login-telepresenca');
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
    async telepresencaScreen(req, res) {
        try {
            const { s } = req.query;
            if (!s || Array.isArray(s)) {
                res.redirect('/view/telepresenca');
                return;
            }
            const id = s;
            const telepresenca = await TelepresencaRepository_1.default.getById(id);
            if (!telepresenca) {
                res.redirect('/view/telepresenca');
                return;
            }
            res.render('telepresenca', { name: telepresenca.name });
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
    core_1.Get('operator/screen'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScreenController.prototype, "operator", null);
__decorate([
    core_1.Get('operator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScreenController.prototype, "operatorSignin", null);
__decorate([
    core_1.Get('telepresenca'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScreenController.prototype, "telepresenca", null);
__decorate([
    core_1.Get('telepresenca/screen'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScreenController.prototype, "telepresencaScreen", null);
ScreenController = __decorate([
    core_1.Controller('view')
], ScreenController);
exports.ScreenController = ScreenController;
//# sourceMappingURL=ScreenController.js.map