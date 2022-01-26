"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Peer = exports.TypePeer = void 0;
var TypePeer;
(function (TypePeer) {
    TypePeer["OPERATOR"] = "operador";
    TypePeer["TELEPRESENCA"] = "telepresenca";
})(TypePeer = exports.TypePeer || (exports.TypePeer = {}));
class Peer {
    constructor(id, type) {
        this.id = id;
        this.type = type;
    }
    getByType(t) {
        if (t !== this.type) {
            return undefined;
        }
        return this;
    }
    setSocket(socket) {
        this.socket = socket;
    }
    getSocket() {
        return this.socket;
    }
    getId() {
        return this.id;
    }
}
exports.Peer = Peer;
//# sourceMappingURL=Peer.js.map