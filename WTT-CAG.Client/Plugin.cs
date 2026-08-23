using BepInEx;
using BepInEx.Bootstrap;
using BepInEx.Logging;

namespace WTT_CAG.Client;

[BepInDependency("com.tyfon.wikilinks")]
[BepInPlugin("com.wtt.cag", "WikiLinksRedirectExample", "1.0.0")]
public class Plugin : BaseUnityPlugin
{
    private readonly ManualLogSource _logger = new("WTT-CAG");
    private void Awake()
    {
        if (!Chainloader.PluginInfos.ContainsKey("com.tyfon.wikilinks")) { return; }

        _logger.LogInfo("Tyfon's WikiLinks plugin is installed. Adding redirects...");
        foreach (var kvp in CAGRedirects.IdUrlMap)
        {
            _logger.LogDebug($"Adding redirect for {kvp.Key} to {kvp.Value}");
            WikiLinks.RedirectRegistry.AddWikiRedirect(kvp.Key, kvp.Value);
        }
    }
}