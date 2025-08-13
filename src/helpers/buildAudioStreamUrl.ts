// helpers/audio.js
export function buildAudioStreamUrl(filepath: string): string {
  // const baseUrl = "http://localhost:5106/api/audio/stream";
  const baseUrlNetwork = "http://192.168.1.174:5106/api/audio/stream";
  if (!filepath) {
    console.error("Filepath is missing");
    return "faild to construct url";
  }

  const parts = filepath.startsWith("/")
    ? filepath.substring(1).split("/")
    : filepath.split("/");

  if (parts.length !== 2 || !parts[0].startsWith("user_")) {
    console.error("Invalid filepath format:", filepath);
    return "faild to construct url";
  }

  const userId = parts[0].replace("user_", "");
  return `${baseUrlNetwork}/${userId}/${encodeURIComponent(parts[1])}`;
}
