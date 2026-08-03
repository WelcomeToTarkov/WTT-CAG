using Path = System.IO.Path;

namespace WTTCAG.Utilities;

/// <summary>
/// Resolves paths to files shipped with the mod without depending on filesystem case.
/// NTFS matches filenames case-insensitively, so a literal whose capitalisation differs from the
/// shipped file works on Windows but throws on Linux/ext4 - and because these loads happen inside
/// IOnLoad, that exception aborts SPT startup entirely instead of skipping the mod.
/// Resource loading happens once at startup, so re-casing each segment against the real directory
/// entries costs nothing worth measuring.
/// </summary>
public static class ModPathResolver
{
    /// <summary>
    /// Returns <paramref name="relativePath"/> re-cased to match what is actually on disk under
    /// <paramref name="modFolder"/>, so either capitalisation of the shipped files resolves.
    /// If no match exists the input is returned unchanged, leaving the caller to surface its
    /// normal "could not find file" error.
    /// </summary>
    public static string Resolve(string modFolder, string relativePath)
    {
        if (string.IsNullOrEmpty(modFolder) || string.IsNullOrEmpty(relativePath))
        {
            return relativePath;
        }

        var segments = relativePath.Split(['/', '\\'], StringSplitOptions.RemoveEmptyEntries);
        var resolved = new List<string>(segments.Length);
        var currentDir = modFolder;

        for (var i = 0; i < segments.Length; i++)
        {
            // Every segment but the last is a directory to descend into.
            var expectDirectory = i < segments.Length - 1;
            var actualName = FindEntry(currentDir, segments[i], expectDirectory);

            if (actualName is null)
            {
                return relativePath;
            }

            resolved.Add(actualName);
            currentDir = Path.Combine(currentDir, actualName);
        }

        return string.Join('/', resolved);
    }

    /// <summary>
    /// Finds the real on-disk name of <paramref name="name"/> inside <paramref name="parentDir"/>,
    /// ignoring case. Returns null when nothing matches.
    /// </summary>
    private static string? FindEntry(string parentDir, string name, bool expectDirectory)
    {
        if (!Directory.Exists(parentDir))
        {
            return null;
        }

        var candidates = expectDirectory
            ? Directory.EnumerateDirectories(parentDir)
            : Directory.EnumerateFiles(parentDir);

        foreach (var candidate in candidates)
        {
            var candidateName = Path.GetFileName(candidate);

            if (string.Equals(candidateName, name, StringComparison.OrdinalIgnoreCase))
            {
                return candidateName;
            }
        }

        return null;
    }
}
