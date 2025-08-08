import { WTTInstanceManager } from "./WTTInstanceManager";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";

export class epicItemClass {

    private Instance: WTTInstanceManager = new WTTInstanceManager();

    public preSptLoad(Instance: WTTInstanceManager): void {
        this.Instance = Instance;
    }

    public postDBLoad(): void {

        this.epicEdits();
    }

    public epicEdits(): void {
        const db: IDatabaseTables = this.Instance.database;
        const dbItems = db.templates.items;
        for (let file in dbItems) {
            let fileData = dbItems[file];
        }
    }


}
