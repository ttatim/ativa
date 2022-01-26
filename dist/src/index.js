"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const dotenv_1 = __importDefault(require("dotenv"));
(async () => {
    await dotenv_1.default.config({
        path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    });
    console.log(process.env.DB_TYPE, process.env.DB_NAME);
    try {
        const server = new server_1.SetupServer();
        await server.init();
        server.start();
    }
    catch (err) {
        console.log(err);
    }
})();
//# sourceMappingURL=index.js.map