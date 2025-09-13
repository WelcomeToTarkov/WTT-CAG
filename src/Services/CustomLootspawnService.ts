/* eslint-disable @typescript-eslint/naming-convention */
import type { WTTInstanceManager } from "./WTTInstanceManager";
import * as customSpawnpointsForced from "../../db/CustomLootspawnService/customSpawnpointsForced.json";
import * as customSpawnpoints from "../../db/CustomLootspawnService/customSpawnpoints.json"
import { ILocations } from "@spt/models/spt/server/ILocations";

export class CustomLootspawnService 
{
    private instanceManager: WTTInstanceManager;

    public preSptLoad(instanceManager: WTTInstanceManager): void 
    {
        this.instanceManager = instanceManager;
    }

    public postDBLoad(): void 
    {
        const locations = this.instanceManager.database.locations;

        for (const locationId in locations) 
        {
            const location = locations[locationId];
            
            if (customSpawnpointsForced[locationId]) 
            {
                location.looseLoot.spawnpointsForced = location.looseLoot.spawnpointsForced.concat(customSpawnpointsForced[locationId]);
            }
        }

        this.processSpawnpoints(locations, customSpawnpoints);
    }

    private processSpawnpoints(
        locations: ILocations,
        customMap: Record<string, any[]>
    ): void 
    {
        for (const locationId in customMap) 
        {
            const location = locations[locationId];
            if (!location || !location.looseLoot) continue;
            
            const customSpawns = customMap[locationId];
            const existingSpawns = location.looseLoot.spawnpoints;
            
            for (const customSpawn of customSpawns) 
            {
                const existingIndex = existingSpawns.findIndex(
                    sp => sp.locationId === customSpawn.locationId
                );
                
                if (existingIndex === -1) 
                {
                    existingSpawns.push(customSpawn);
                } 
                else 
                {
                    const existingSpawn = existingSpawns[existingIndex];
                    
                    if (customSpawn.template?.Items) 
                    {
                        existingSpawn.template.Items = [
                            ...existingSpawn.template.Items,
                            ...customSpawn.template.Items
                        ];
                    }
                    
                    if (customSpawn.itemDistribution) 
                    {
                        existingSpawn.itemDistribution = [
                            ...existingSpawn.itemDistribution,
                            ...customSpawn.itemDistribution
                        ];
                    }
                }
            }
            
            location.looseLoot.spawnpoints = existingSpawns;
        }
    }
}
