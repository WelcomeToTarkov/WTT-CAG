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
            if (fileData._id === "65290f395ae2ae97b80fdf2d") {
                fileData._props.Chambers = [
                    {
                        "_name": "patron_in_weapon",
                        "_id": "65290f395ae2ae97b80fdf33",
                        "_parent": "65290f395ae2ae97b80fdf2d",
                        "_props": {
                            "filters": [
                                {
                                    "Filter": [
                                        "6529243824cbe3c74a05e5c1",
                                        "6529302b8c26af6326029fb7",
                                        "5a6086ea4f39f99cd479502f",
                                        "5a608bf24f39f98ffc77720e",
                                        "58dd3ad986f77403051cba8f",
                                        "5e023e53d4353e3302577c4c",
                                        "5efb0c1bd79ff02a1f5e68d9",
                                        "5e023e6e34d52a55c3304f71",
                                        "5e023e88277cce2b522ff2b1",
                                        "6768c25aa7b238f14a08d3f6",
                                        "6888f7c68c110666da6ba8ed",
                                        "6888f8076aafdbe26850afdb",
                                        "6888f89eaad6719189f5c85a",
                                        "6888f9496b33a53248fb345c"
                                    ]
                                }
                            ]
                        },
                        "_required": false,
                        "_mergeSlotWithChildren": false,
                        "_proto": "55d4af244bdc2d962f8b4571",
                    }
                ];
            } //Adding the Multi-Caliber Support to the SPEAR 6.8
            if (fileData._id === "652910565ae2ae97b80fdf35") {
                fileData._props.ConflictingItems = [
                    "5a6086ea4f39f99cd479502f",
                    "5a608bf24f39f98ffc77720e",
                    "58dd3ad986f77403051cba8f",
                    "5e023e53d4353e3302577c4c",
                    "5efb0c1bd79ff02a1f5e68d9",
                    "5e023e6e34d52a55c3304f71",
                    "5e023e88277cce2b522ff2b1",
                    "6768c25aa7b238f14a08d3f6",
                    "6888f7c68c110666da6ba8ed",
                    "6888f8076aafdbe26850afdb",
                    "6888f89eaad6719189f5c85a",
                    "6888f9496b33a53248fb345c"
                ];
            } //Adjusting Conflicts with the 6.8 barrel to not allow .308 or 6.5.
        }
    }


}
