using BepInEx;
using BepInEx.Bootstrap;
using BepInEx.Logging;

namespace WTT_CAG.Client;

[BepInPlugin("com.wtt.cag", "WikiLinksRedirectExample", "1.0.0")]
public class Plugin : BaseUnityPlugin
{
    private readonly ManualLogSource _logger = new("WTT-CAG");
    
    private void Awake()
    {
        if (!Chainloader.PluginInfos.ContainsKey("com.tyfon.wikilinks")) { return; }

        _logger.LogInfo("Tyfon's WikiLinks plugin is installed. Adding redirects...");
        WikiLinksCompat.CAGWikiLinks.InitWikiLinks();
    }
}