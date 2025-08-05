"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraderBadger = void 0;
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
class TraderBadger {
    mydb;
    instanceManager;
    BadgerBaseJson;
    BadgerAssort;
    BadgerQuestAssort;
    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param Instance WTTInstanceManager
     */
    preSptLoad(Instance) {
        this.instanceManager = Instance;
        this.BadgerBaseJson = this.instanceManager.traderApi.loadTraderBaseJson("bd3a8b28356d9c6509966546");
        this.BadgerAssort = this.instanceManager.traderApi.loadTraderAssortJson("bd3a8b28356d9c6509966546");
        this.BadgerQuestAssort = this.instanceManager.traderApi.loadTraderQuestAssortJson("bd3a8b28356d9c6509966546");
        this.instanceManager.traderApi.setupTrader("bd3a8b28356d9c6509966546", this.BadgerBaseJson);
        if (this.instanceManager.debug) {
            this.instanceManager.logger.log(`[${this.instanceManager.modName}] Trader: Badger Active`, LogTextColor_1.LogTextColor.GREEN);
        }
    }
    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     */
    postDBLoad() {
        this.mydb = this.instanceManager.traderApi.loadTraderDbRecursive("bd3a8b28356d9c6509966546");
        this.instanceManager.traderApi.addTraderToDb(this.mydb, "bd3a8b28356d9c6509966546", this.BadgerBaseJson, this.BadgerAssort, this.BadgerQuestAssort);
        //Load quests
        this.instanceManager.questApi.loadQuestsFromDirectory("bd3a8b28356d9c6509966546");
        //this.instanceManager.questApi.importQuestZones(BadgerZones, "Badger");
        const insuranceConfig = this.instanceManager.configServer.getConfig(ConfigTypes_1.ConfigTypes.INSURANCE);
        insuranceConfig.returnChancePercent["bd3a8b28356d9c6509966546"] = 95;
    }
}
exports.TraderBadger = TraderBadger;
//# sourceMappingURL=TraderBadger.js.map