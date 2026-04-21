using SPTarkov.DI.Annotations;
using SPTarkov.Server.Core.DI;
using SPTarkov.Server.Core.Models.Common;
using SPTarkov.Server.Core.Models.Eft.Common.Tables;
using SPTarkov.Server.Core.Models.Utils;
using SPTarkov.Server.Core.Services;
using WTTServerCommonLib.Helpers;

namespace WTTCAG.Utilities;

[Injectable(typePriority: OnLoadOrder.PostDBModLoader + 3)]
public class BaseGameItemEdits(
    ISptLogger<BaseGameItemEdits> logger,
    DatabaseService databaseService,
    SlotHelper slotHelper
):IOnLoad
{
    public Task OnLoad()
    {
        EditFilters();
        return Task.CompletedTask;
    }

    private void EditFilters()
    {
        var dbItems = databaseService.GetItems();
        foreach (var (id, item) in dbItems)
        {
            switch (id)
            {
                case "5a16b8a9fcdbcb00165aa6ca":
                    ModifySlotFilters(item, 0, 0, [
                        "6974ce066e50d4be623b8d9b",
                        "6974cf52ee1fb8a0683b8d9d"
                    ]);
                    break; //Pushing DTNVGs to TATM mount
                case "5f60b34a41e30a4ab12a6947":
                    item.Properties.Prefab.Path = "Headwear/helmets/galvion_caiman/helmet_caiman_bump_grey.bundle";
                    break; // Replacing the Caiman Helmet without overwriting the bundle because i need shit from that bundle lmao
                case "657bbad7a1c61ee0c3036323":
                    item.Properties.ArmorClass = 1;
                    item.Properties.Durability = 10;
                    item.Properties.MaxDurability = 10;
                    break; // Making the Caiman bump shit (Armor Top)
                case "657bbb31b30eca9763051183":
                    item.Properties.ArmorClass = 1;
                    item.Properties.Durability = 10;
                    item.Properties.MaxDurability = 10;
                    break; // Making the Caiman bump shit (Armor Back)
                case "65719f0775149d62ce0a670b":
                    item.Properties.Prefab.Path = "Headwear/helmets/tor-2/item_equipment_helmet_tor_2.bundle"; // Tor-2 Prefab Path

                    slotHelper.AddIdsToNamedSlot(item, "mod_cover",
                        "69d6dcfb46cc268b92906d4e",
                        "69d6df1e2053bc5e41906d4f",
                        "69d6df883c2d93f229906d51",
                        "69d6dfa9f3b8a5d1b4906d52",
                        "69d6dfc41d822714a7906d53"); // Tor-2 Modslots
                    break;
            }
        }
    }
    
    private void ReplaceSlotFilters(TemplateItem item, int slotIndex, int filterIndex, HashSet<MongoId> ids)
    {
        var slot = GetSlotAtIndex(item, slotIndex);
        var filter = GetSlotFilterAtIndex(slot, filterIndex);

        filter.Filter = ids;
    }

    private void ModifySlotFilters(TemplateItem item, int slotIndex, int filterIndex, List<MongoId> ids, bool isCartridge = false)
    {
        var slot = GetSlotAtIndex(item, slotIndex, isCartridge);
        var filter = GetSlotFilterAtIndex(slot, filterIndex);

        filter.Filter!.UnionWith(ids);
    }
    
    private Slot GetSlotAtIndex(TemplateItem item, int index, bool isCartridge = false)
    {
        var slots = isCartridge ? item.Properties?.Cartridges?.ToArray() : item.Properties?.Slots?.ToArray();

        if (index >= 0 && index < slots?.Length)
        {
            return slots[index];
        }

        throw new IndexOutOfRangeException($"Index on item slot property `{item.Name}` is out of range");
    }

    private SlotFilter GetSlotFilterAtIndex(Slot slot, int index)
    {  
        var slotFilter = slot.Properties?.Filters?.ToArray() ?? [];

        if (index >= 0 && index < slotFilter.Length)
        {
            return slotFilter[index];
        }

        throw new IndexOutOfRangeException($"Index on slot property `{slot.Name}` is out of range");
    }
}