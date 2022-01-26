class Telepresenca {
  constructor(id) {
    this.id = id;
  }
  candidate = [];

  selfDestroy() {
    if (this.player) {
      this.player.remove();
      this.player = null;
    }

    if (this.pc) {
      this.pc.close();
      this.pc.onicecandidate = null;
      this.pc.ontrack = null;
      this.pc = null;
    }

    this.candidate = [];
  }
}
