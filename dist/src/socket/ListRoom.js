"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ListRoom {
    constructor() {
        this.rooms = new Map();
    }
    getRoom(k) {
        return this.rooms.get(k);
    }
    setRoom(r) {
        this.rooms.set(r.getId(), r);
    }
}
exports.default = ListRoom;
//# sourceMappingURL=ListRoom.js.map