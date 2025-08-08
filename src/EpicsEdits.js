"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.epicItemClass = void 0;
const WTTInstanceManager_1 = require("./WTTInstanceManager");
class epicItemClass {
    Instance = new WTTInstanceManager_1.WTTInstanceManager();
    preSptLoad(Instance) {
        this.Instance = Instance;
    }
    postDBLoad() {
        this.epicEdits();
    }
    epicEdits() {
        const db = this.Instance.database;
        const dbItems = db.templates.items;
        for (let file in dbItems) {
            let fileData = dbItems[file];
        }
    }
}
exports.epicItemClass = epicItemClass;
//# sourceMappingURL=EpicsEdits.js.map