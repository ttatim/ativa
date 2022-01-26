"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUUID = void 0;
const isUUID = (uuid) => {
    const s = '' + uuid;
    const test = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    if (test === null) {
        return false;
    }
    return true;
};
exports.isUUID = isUUID;
//# sourceMappingURL=validation.js.map