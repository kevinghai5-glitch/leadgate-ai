import crypto from "crypto";

const ADJECTIVES = [
  "sunny", "brisk", "amber", "quiet", "swift", "clever", "bright", "calm",
  "bold", "keen", "lucky", "warm", "gold", "steady", "sharp", "north",
];
const NOUNS = [
  "otter", "falcon", "cedar", "harbor", "maple", "comet", "willow", "sparrow",
  "river", "summit", "meadow", "canyon", "beacon", "anchor", "cypress", "fox",
];

/**
 * Human-friendly temporary password (e.g. "amber-falcon-4821") — easy to relay
 * to a client, meant to be reset after first login. Uses crypto.randomInt so
 * the selection isn't predictable.
 */
export function generateTempPassword(): string {
  const adj = ADJECTIVES[crypto.randomInt(ADJECTIVES.length)];
  const noun = NOUNS[crypto.randomInt(NOUNS.length)];
  const num = 1000 + crypto.randomInt(9000);
  return `${adj}-${noun}-${num}`;
}
