"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.peers = new Map();
    }
    getId() {
        return this.id;
    }
    addPeer(p) {
        this.peers.set(p.getId(), p);
    }
    getPeer(k) {
        return this.peers.get(k);
    }
    setPeer(p) {
        if (!this.peers.get(p.getId()))
            return;
        this.peers.set(p.getId(), p);
    }
    getByType(t) {
        let peers = [];
        this.peers.forEach((element) => {
            const peer = element.getByType(t);
            if (peer) {
                peers.push(peer);
            }
        });
        return peers;
    }
    removePeer(k) {
        const peer = this.peers.get(k);
        if (!peer) {
            return false;
        }
        this.peers.delete(k);
        return true;
    }
    getName() {
        return this.name;
    }
}
exports.default = Room;
//# sourceMappingURL=Room.js.map