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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupServer = void 0;
require("./util/module-alias");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const ListOfAttendanceRoomMemberController_1 = require("@src/controllers/ListOfAttendanceRoomMemberController");
const TelepresencaController_1 = require("@src/controllers/TelepresencaController");
const AttendanceRoomController_1 = require("@src/controllers/AttendanceRoomController");
const OperatorController_1 = require("@src/controllers/OperatorController");
const ScreenController_1 = require("@src/controllers/ScreenController");
const UserController_1 = require("@src/controllers/UserController");
const SocketService_1 = __importDefault(require("./SocketService"));
const core_1 = require("@overnightjs/core");
const database = __importStar(require("@src/database"));
const http = __importStar(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
class SetupServer extends core_1.Server {
    constructor(port = 3000) {
        super();
        this.port = port;
    }
    async init() {
        this.setExpress();
        this.setController();
        this.setPage404();
        await this.setDatabase();
        console.log('📦 Connect database');
    }
    setExpress() {
        this.app.use(helmet_1.default());
        this.app.use(express_1.default.json());
        this.app.set('view engine', 'ejs');
        this.app.set('views', path_1.default.join(__dirname, 'views'));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
        this.app.use(function (req, res, next) {
            res.setHeader('Content-Security-Policy', `connect-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;`);
            next();
        });
    }
    async setDatabase() {
        await database.connect();
    }
    async close() {
        await database.close();
    }
    setPage404() {
        this.app.use((req, res) => {
            res.status(404).send({
                msg: 'Humm, este página não existe',
            });
        });
    }
    setController() {
        const operatorController = new OperatorController_1.OperatorController();
        const telepresencaController = new TelepresencaController_1.TelepresencaController();
        const screenController = new ScreenController_1.ScreenController();
        const userController = new UserController_1.UserController();
        const attendanceRoom = new AttendanceRoomController_1.AttendanceRoom();
        const listOfAttendanceRoomMembersControllers = new ListOfAttendanceRoomMemberController_1.ListOfAttendanceRoomMemberController();
        this.addControllers([
            operatorController,
            telepresencaController,
            screenController,
            userController,
            attendanceRoom,
            listOfAttendanceRoomMembersControllers,
        ]);
    }
    start() {
        this.server = http.createServer(this.app);
        this.initSocket();
        this.server.listen(this.port, () => {
            console.log('🔥 Server listening on port: ' + this.port);
        });
    }
    requestHttps() {
        this.app.use((req, res, next) => {
            if (!req.secure &&
                req.get('x-forwarded-proto') !== 'https' &&
                process.env.NODE_ENV !== 'dev') {
                res.redirect('https://' + req.get('host') + req.url);
            }
            else
                next();
        });
    }
    initSocket() {
        SocketService_1.default(this.server);
    }
    getApp() {
        return this.app;
    }
}
exports.SetupServer = SetupServer;
//# sourceMappingURL=server.js.map