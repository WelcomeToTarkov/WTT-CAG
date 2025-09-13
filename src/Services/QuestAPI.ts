/* eslint-disable @typescript-eslint/naming-convention */
import path from "node:path";
import fs from "node:fs";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import type { QuestZone } from "../references/configConsts";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import type { IQuestConfig } from "@spt/models/spt/config/IQuestConfig";
import type { WTTInstanceManager } from "./WTTInstanceManager";

export class QuestAPI 
{
    private instanceManager: WTTInstanceManager;

    public preSptLoad(Instance: WTTInstanceManager): void
    {
        this.instanceManager = Instance;
    }

    public postDBLoad(): void {
        this.importQuestSideConfig();
        const questsBasePath = path.join(this.instanceManager.dbPath, 'Quests');
        this.loadAllTraderQuests(questsBasePath);
    }
    
    private loadAllTraderQuests(basePath: string): void {
        const traderDirs = fs.readdirSync(basePath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    
        for (const traderId of traderDirs) {
            this.loadQuestsFromDirectory(traderId);
        }
    }
    
    public loadQuestsFromDirectory(traderId: string): void {
        const traderBasePath = path.join(this.instanceManager.dbPath, 'Quests', traderId);
        
        const jsonQuestFiles = this.loadJsonFiles(path.join(traderBasePath));
        const jsonQuestAssortFiles = this.loadJsonFiles(path.join(traderBasePath, 'questAssort'));
        const jsonImageFiles = this.loadImagePaths(path.join(traderBasePath, 'images'));
    
        this.importQuestData(jsonQuestFiles, traderId);
        this.importQuestAssortData(jsonQuestAssortFiles, traderId);
        this.importLocaleData(traderId);
        this.importImageData(jsonImageFiles, traderId);
    }
    
    private loadJsonFiles(directoryPath: string): any[] {
        if (!this.directoryExists(directoryPath)) {
            return [];
        }
    
        const jsonData = [];
        const files = this.readDirectorySafe(directoryPath);
    
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            if (!this.isValidFile(filePath)) continue;
    
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                jsonData.push(JSON.parse(content));
                this.logDebug(`Loaded JSON file: ${filePath}`, "green");
            } catch (error) {
                console.error(`Error parsing JSON from file ${filePath}: ${error}`, "red");
            }
        }
        
        return jsonData;
    }
    
    private loadImagePaths(directoryPath: string): string[] {
        if (!this.directoryExists(directoryPath)) {
            return [];
        }
    
        const imagePaths = [];
        const files = this.readDirectorySafe(directoryPath);
    
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            if (this.isValidFile(filePath)) {
                imagePaths.push(filePath);
                this.logDebug(`Found image file: ${filePath}`, "green");
            }
        }
        
        return imagePaths;
    }
    
    private directoryExists(path: string): boolean {
        if (!fs.existsSync(path)) {
            this.logDebug(`Directory not found: ${path}`, "red");
            return false;
        }
        return true;
    }
    
    private readDirectorySafe(path: string): string[] {
        try {
            return fs.readdirSync(path);
        } catch (error) {
            console.error(`Error reading directory ${path}: ${error}`);
            return [];
        }
    }
    
    private isValidFile(filePath: string): boolean {
        try {
            return fs.lstatSync(filePath).isFile();
        } catch (error) {
            console.error(`Error checking file ${filePath}: ${error}`);
            return false;
        }
    }
    
    private logDebug(message: string, color?: string): void {
        if (this.instanceManager.debug) {
            this.instanceManager.colorLog(message, color ?? "green");
        }
    }


    public importQuestZones(questZones: QuestZone[], trader: string): void 
    {
        let zones = 0;
        for (const zone of questZones)
        {
            if (this.instanceManager.debug)
            {
                console.log(zone);
            }
            // biome-ignore lint/complexity/useLiteralKeys: <explanation>
            this.instanceManager.database.globals["QuestZones"].push(zone);
            zones++;
        }
        this.logDebug(`[${this.instanceManager.modName}] QuestAPI:  ${trader} Loaded ${zones} quest zones.`, LogTextColor.GREEN);
    }


    private importQuestData(jsonQuestFiles: any[], trader: string): void
    {
        if (Object.keys(jsonQuestFiles).length < 1)
        {
            this.logDebug(`[${this.instanceManager.modName}] QuestAPI:  ${trader} No quest files.`, LogTextColor.RED); 
            return;
        }
        this.logDebug(`[${this.instanceManager.modName}] QuestAPI:  ${trader} Loading ${Object.keys(jsonQuestFiles).length} quest files.`, LogTextColor.GREEN);
        
        let questCount = 0;
        for (const file of jsonQuestFiles)
        {
            for (const quest in file)
            {
                this.instanceManager.database.templates.quests[quest] = file[quest];
                questCount++;
            }           
        }
        this.logDebug(`[${this.instanceManager.modName}] QuestAPI:  ${trader} Loaded ${questCount} tasks.`, LogTextColor.GREEN);      
    }

    private importQuestAssortData(jsonQuestAssortFiles: any[], trader: string): void {
        if (Object.keys(jsonQuestAssortFiles).length < 1) {
            this.logDebug(`[${this.instanceManager.modName}] QuestAPI:  ${trader} No quest files.`, LogTextColor.RED);
            return;
        }
        this.logDebug(`[${this.instanceManager.modName}] QuestAPI:  ${trader} Loading ${Object.keys(jsonQuestAssortFiles).length} quest assort files.`, LogTextColor.GREEN);
    
        let questAssortCount = 0;
        
        if (!this.instanceManager.database.traders[trader].questassort) {
            this.instanceManager.database.traders[trader].questassort = {};
        }
    
        for (const questAssorts of jsonQuestAssortFiles) {
            for (const questAssortKey in questAssorts) {
                const section = questAssorts[questAssortKey];
                
                if (!this.instanceManager.database.traders[trader].questassort[questAssortKey]) {
                    this.instanceManager.database.traders[trader].questassort[questAssortKey] = {};
                }
    
                Object.assign(
                    this.instanceManager.database.traders[trader].questassort[questAssortKey],
                    section
                );
    
                questAssortCount += Object.keys(section).length;
            }
        }
    
        this.logDebug(`[${this.instanceManager.modName}] QuestAPI: ${trader} Imported ${questAssortCount} quests into the database.`, LogTextColor.GREEN);
    }


    private importQuestSideConfig(): void 
    {
        const questConfig = this.instanceManager.configServer.getConfig<IQuestConfig>(ConfigTypes.QUEST)
        const questSideFile = fs.readFileSync(this.instanceManager.dbPath.concat("/Quests/QuestSideData.json"), "utf-8");
        const questSideJson = JSON.parse(questSideFile);

        this.logDebug(`[${this.instanceManager.modName}] QuestAPI:  ${questSideJson["UsecOnly"]}`, LogTextColor.BLUE);

        for (const entry of questSideJson["UsecOnly"])
        {
            questConfig.usecOnlyQuests.push(entry);
        }

        for (const entry of questSideJson["BearOnly"])
        {
            questConfig.bearOnlyQuests.push(entry);
        }
    }


    private importLocaleData(trader: string): void
    {
        const localesDir = path.join(this.instanceManager.dbPath, 'Quests', trader, 'locales');
        
        if (!fs.existsSync(localesDir) || !fs.lstatSync(localesDir).isDirectory())
        {
            this.logDebug(`[${this.instanceManager.modName}] QuestAPI: ${trader} No quest locale directory found.`, LogTextColor.RED); 
            return;
        }
    
        const localeFiles = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));
        
        if (localeFiles.length === 0)
        {
            this.logDebug(`[${this.instanceManager.modName}] QuestAPI: ${trader} No locale files found.`, LogTextColor.RED); 
            return;
        }
    
        this.logDebug(`[${this.instanceManager.modName}] QuestAPI: ${trader} Loading ${localeFiles.length} locale files.`, LogTextColor.GREEN);
    
        let localeCount = 0;
        const customLocales: Record<string, Record<string, string>> = {};
        let fallback: Record<string, string> = {};
    
        for (const file of localeFiles)
        {
            const localeCode = path.basename(file, ".json");
            const filePath = path.join(localesDir, file);
    
            try 
            {
                const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                customLocales[localeCode] = data;
                
                if (localeCode === "en") {
                    fallback = data;
                }
            } 
            catch (err) 
            {
                console.error(`Failed to parse ${filePath}:`, err);
            }
        }
    
        if (Object.keys(fallback).length === 0 && customLocales["en"]) {
            fallback = customLocales["en"];
        }
    
        const globalLocales = this.instanceManager.database.locales.global;
        
        for (const localeCode of Object.keys(globalLocales))
        {
            const localeData = globalLocales[localeCode];
            const customData = customLocales[localeCode] || fallback;
            
            for (const [key, value] of Object.entries(customData))
            {
                if (!localeData[key]) {
                    localeData[key] = value;
                    localeCount++;
                }
                else if (this.instanceManager.debug) {
                    this.logDebug(`Skipping duplicate key: ${key} for locale ${localeCode}`, LogTextColor.YELLOW);
                }
            }
        }
    
        this.logDebug(`[${this.instanceManager.modName}] QuestAPI: ${trader} Added ${localeCount} locale entries.`, LogTextColor.GREEN);
    }

    private importImageData(jsonImageFiles: any[], trader: string): void
    {
        let imageCount = 0;
        for (const imagePath of jsonImageFiles)
        {
            this.instanceManager.imageRouter.addRoute(`/files/quest/icon/${path.basename(imagePath, path.extname(imagePath))}`, imagePath);
            imageCount++;
        }
        this.logDebug(`[${this.instanceManager.modName}] QuestAPI:  ${trader} Loaded ${imageCount} images.`, LogTextColor.GREEN);
    }
}