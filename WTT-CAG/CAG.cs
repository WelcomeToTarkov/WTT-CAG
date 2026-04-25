using System.Reflection;
using SPTarkov.DI.Annotations;
using SPTarkov.Server.Core.DI;
using SPTarkov.Server.Core.Models.Eft.Common.Tables;
using SPTarkov.Server.Core.Models.Spt.Mod;
using WTTCAG.Traders;
using WTTServerCommonLib.Models;
using Path = System.IO.Path;
using Range = SemanticVersioning.Range;

namespace WTTCAG;

public record ModMetadata : AbstractModMetadata
{
    public override string ModGuid { get; init; } = "com.wtt.cag";
    public override string Name { get; init; } = "WTT-CAG";
    public override string Author { get; init; } = "GrooveypenguinX, ProbablyEukyre, Tron, Wireman";
    public override List<string>? Contributors { get; init; } = null;
    public override SemanticVersioning.Version Version { get; init; } = new(typeof(ModMetadata).Assembly.GetName().Version?.ToString(3));
    public override Range SptVersion { get; init; } = new("~4.0.1");
    public override List<string>? Incompatibilities { get; init; }
    public override Dictionary<string, Range>? ModDependencies { get; init; } = new()
    {
        { "com.wtt.commonlib", new Range("~2.0.18") }
    };
    public override string? Url { get; init; }
    public override bool? IsBundleMod { get; init; } = true;
    public override string License { get; init; } = "CC-BY-NC-ND 4.0";
}


[Injectable(TypePriority = OnLoadOrder.PostDBModLoader + 2)]
public class WTTCAG(
    WTTServerCommonLib.WTTServerCommonLib wttCommon) : IOnLoad
{
    public async Task OnLoad()
    {
        Assembly assembly = Assembly.GetExecutingAssembly();
        
        TraderIds.Add("HOSER", "69eccbae0764116786033c2e");
        
        await wttCommon.CustomItemServiceExtended.CreateCustomItems(assembly);
        await wttCommon.CustomLocaleService.CreateCustomLocales(assembly);
        await wttCommon.CustomAssortSchemeService.CreateCustomAssortSchemes(assembly);
        await wttCommon.CustomBotLoadoutService.CreateCustomBotLoadouts(assembly);
        await wttCommon.CustomClothingService.CreateCustomClothing(assembly); 
        wttCommon.CustomRigLayoutService.CreateRigLayouts(assembly); 
        wttCommon.CustomSlotImageService.CreateSlotImages(assembly);
        await wttCommon.CustomHideoutRecipeService.CreateHideoutRecipes(assembly);
        await Task.CompletedTask;
    }
}
