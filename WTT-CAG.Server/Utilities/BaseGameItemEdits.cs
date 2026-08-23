using JetBrains.Annotations;
using SPTarkov.DI.Annotations;
using SPTarkov.Server.Core.DI;
using SPTarkov.Server.Core.Models.Common;
using SPTarkov.Server.Core.Models.Eft.Common.Tables;
using SPTarkov.Server.Core.Models.Spt.Tables;
using WTTServerCommonLib.Helpers;

namespace WTTClothingAndGear.Utilities;

[Injectable(TypePriority = OnLoadOrder.PostLoad + 3), UsedImplicitly]
public class BaseGameItemEdits(TemplateTable templateTable, SlotHelper slotHelper ) : IOnLoad
{
    public Task OnLoadAsync(CancellationToken cancellationToken)
    {
        EditFilters();
        return Task.CompletedTask;
    }

    private void EditFilters()
    {
        var dbItems = templateTable.Items;
        foreach (var (id, item) in dbItems)
        {
            
            switch (id)
            {
                //Pushing DTNVGs to TATM mount
                case "5a16b8a9fcdbcb00165aa6ca":
                {
                    ModifySlotFilters(item, 0, 0, [
                        "6974ce066e50d4be623b8d9b",
                        "6974cf52ee1fb8a0683b8d9d"
                    ]);
                    break;
                }
                // Replacing the Caiman Helmet without overwriting the bundle because i need shit from that bundle lmao
                case "5f60b34a41e30a4ab12a6947":
                {
                    item.Properties!.Prefab!.Path = "Headwear/helmets/galvion_caiman/helmet_caiman_bump_grey.bundle";
                    break;
                }
                case "657bbad7a1c61ee0c3036323": // Making the Caiman bump shit (top armor)
                case "657bbb31b30eca9763051183": // Making the Caiman bump shit (back armor)
                {
                    item.Properties!.ArmorClass = 1;
                    item.Properties.Durability = 10;
                    item.Properties.MaxDurability = 10;
                    break;
                }
                case "65719f0775149d62ce0a670b":
                {
                    // New Tor-2 Prefab Path
                    item.Properties!.Prefab!.Path = "Headwear/helmets/tor-2/item_equipment_helmet_tor_2.bundle";
                    slotHelper.EnsureSlot(item, "mod_cover", "55d30c4c4bdc2db4468b457e");
                    // New Tor-2 Mod Slots
                    slotHelper.AddIdsToNamedSlot(item, "mod_cover",
                        "69d6dcfb46cc268b92906d4e",
                        "69d6df1e2053bc5e41906d4f",
                        "69d6df883c2d93f229906d51",
                        "69d6dfa9f3b8a5d1b4906d52",
                        "69d6dfc41d822714a7906d53");
                    break;
                }
                case "5b432d215acfc4771e1c6624":
                {
                    // New LShZ Prefab
                    item.Properties!.Prefab!.Path = "Headwear/helmets/lshz/item_equipment_helmet_lshz_highcut.bundle";
                    // New LShZ Mod Slot
                    slotHelper.EnsureSlot(item, "mod_cover", "55d30c4c4bdc2db4468b457e");
                    slotHelper.AddIdsToNamedSlot(item, "mod_cover",
                        "6a32bd63cdc9d6712b6ffae0",
                        "6a32b342d54ecde6786ffadf",
                        "6a32bd8954d48c508b6ffae1",
                        "6a32c1e01b484ff5e86ffae2",
                        "6a32c3bfef7e9753a16ffae3");
                    // Remove LShZ Side Armor
                    ModifySlotFilters(item, 0, 0, [
                        "5a16b672fcdbcb001912fa83",
                        "5a16b7e1fcdbcb00165aa6c9"
                    ]);
                    break;
                }
            }
        }
    }

    private static void ModifySlotFilters(TemplateItem item, int slotIndex, int filterIndex, List<MongoId> ids, bool isCartridge = false)
    {
        var slot = GetSlotAtIndex(item, slotIndex, isCartridge);
        var filter = GetSlotFilterAtIndex(slot, filterIndex);

        filter.Filter!.UnionWith(ids);
    }
    
    private static Slot GetSlotAtIndex(TemplateItem item, int index, bool isCartridge = false)
    {
        var slots = isCartridge ? item.Properties?.Cartridges?.ToArray() : item.Properties?.Slots?.ToArray();

        if (index >= 0 && index < slots?.Length)
        {
            return slots[index];
        }

        throw new IndexOutOfRangeException($"Index on item slot property `{item.Name}` is out of range");
    }

    private static SlotFilter GetSlotFilterAtIndex(Slot slot, int index)
    {  
        var slotFilter = slot.Properties?.Filters?.ToArray() ?? [];

        if (index >= 0 && index < slotFilter.Length)
        {
            return slotFilter[index];
        }

        throw new IndexOutOfRangeException($"Index on slot property `{slot.Name}` is out of range");
    }
}