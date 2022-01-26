"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.connect = void 0;
const typeorm_1 = require("typeorm");
let db;
const connect = async () => {
    const connectioOption = await typeorm_1.getConnectionOptions();
    db = await typeorm_1.createConnection(connectioOption);
};
exports.connect = connect;
const close = async () => await db.close();
exports.close = close;
//# sourceMappingURL=index.js.map