using SPTarkov.DI.Annotations;
using SPTarkov.Server.Core.Models.Common;
using SPTarkov.Server.Core.Models.Eft.Common.Tables;
using SPTarkov.Server.Core.Models.Utils;
using SPTarkov.Server.Core.Services;
using WTTServerCommonLib.Helpers;

namespace WTTCAG.Helpers
{
    [Injectable]
    public class CagQuestHelper(DatabaseService  databaseService, ISptLogger<CagQuestHelper> logger, QuestHelper questHelper)
    {

        // Define weapon IDs
        // ReSharper disable InconsistentNaming
        // ReSharper disable IdentifierTypo
        private const string UNTAR_FAST = "6a71ce2a1f7262198d264238";
        
        public void ModifyQuests()
        {
            var quests = databaseService.GetTemplates().Quests;
            
            // ====================== PEACEKEEPER QUESTS ======================

            //  Peacekeeping Mission (5c0d4c12d09282029f539173)
            questHelper.AddWeaponsToKillCondition(quests, "5c0d4c12d09282029f539173", [
                UNTAR_FAST
            ]);
            //  Humanitarian Supplies (5a27b87686f77460de0252a8)
            questHelper.AddWeaponsToKillCondition(quests, "5a27b87686f77460de0252a8", [
                UNTAR_FAST
            ]);
        }
    }
}
