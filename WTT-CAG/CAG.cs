using System.Reflection;
using JetBrains.Annotations;
using SPTarkov.DI.Annotations;
using SPTarkov.Server.Core.DI;
using WTTServerCommonLib.Models;

namespace WTTCAG;

[Injectable(TypePriority = OnLoadOrder.TraderRegistration + 3), UsedImplicitly]
public class WTTCAG(WTTServerCommonLib.WTTServerCommonLib wttCommon) : IOnLoad
{
    public Task OnLoadAsync(CancellationToken cancellationToken)
    {
        var assembly = Assembly.GetExecutingAssembly();

        TraderIds.Add("HOSER", "69eccbae0764116786033c2e");

        wttCommon.CustomItemServiceExtended.CreateCustomItems(assembly);
        wttCommon.CustomLocaleService.CreateCustomLocales(assembly);
        wttCommon.CustomBotLoadoutService.CreateCustomBotLoadouts(assembly);
        wttCommon.CustomClothingService.CreateCustomClothing(assembly);
        wttCommon.CustomRigLayoutService.CreateRigLayouts(assembly);
        wttCommon.CustomSlotImageService.CreateSlotImages(assembly);
        wttCommon.CustomHideoutRecipeService.CreateHideoutRecipes(assembly);
        return Task.CompletedTask;
    }
}