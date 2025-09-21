// helpers/audio.js
export function buildAudioStreamUrl(filepath: string): string {
  const baseUrlNetwork = import.meta.env.VITE_API_ENDPOINT + "/api/audios";
  if (!filepath) {
    console.error("Filepath is missing");
    return "faild to construct url";
  }

  // --- FIX: Normalize path separators from \ to / ---
  const normalizedFilepath = filepath.replace(/\\/g, "/");

  const parts = normalizedFilepath.startsWith("/")
    ? normalizedFilepath.substring(1).split("/")
    : normalizedFilepath.split("/");

  if (parts.length !== 2 || !parts[0].startsWith("user_")) {
    console.error("Invalid filepath format:", filepath);
    return "faild to construct url";
  }

  const userId = parts[0].replace("user_", "");
  return `${baseUrlNetwork}/${userId}/${encodeURIComponent(parts[1])}`;
}