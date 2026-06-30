// Accepts either a "pubhtml" published link or an already-correct CSV export
// link and returns a normalized CSV URL Papa Parse can fetch directly.
export function toCsvUrl(rawUrl) {
  if (!rawUrl) return null;

  // Already a CSV export link
  if (rawUrl.includes("output=csv")) return rawUrl;

  // Typical published link looks like:
  // https://docs.google.com/spreadsheets/d/e/<id>/pubhtml?gid=0&single=true
  // We just need to swap "pubhtml" for "pub" and force output=csv,
  // keeping the gid so it points at the correct tab.
  try {
    const url = new URL(rawUrl);
    url.pathname = url.pathname.replace("/pubhtml", "/pub");
    url.searchParams.set("output", "csv");
    return url.toString();
  } catch {
    return rawUrl;
  }
}
