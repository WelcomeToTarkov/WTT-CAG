
namespace WTT_CAG.WikiLinksCompat;

public class CAGWikiLinks
{
    public static void InitWikiLinks()
    {
        foreach (var kvp in CAGRedirects.IdUrlMap)
        {
            WikiLinks.RedirectRegistry.AddWikiRedirect(kvp.Key, kvp.Value);
        }
    }
}
