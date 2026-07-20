import crypto from "crypto";

/**
 * Optional symmetric encryption for secrets stored at rest (e.g. a tenant's
 * GoHighLevel Private Integration Token).
 *
 * Behaviour is intentionally graceful so the app keeps working whether or not
 * an encryption key is configured:
 *
 *   - If `ENCRYPTION_KEY` is set (32 bytes, provided as 64 hex chars or base64),
 *     values are encrypted with AES-256-GCM and stored as `enc:v1:<payload>`.
 *   - If `ENCRYPTION_KEY` is NOT set, values are stored as plaintext. This
 *     matches the current pattern for every other user column in the app, but
 *     it is a security downgrade for a long-lived API credential. Set
 *     ENCRYPTION_KEY in production. (See .env.example.)
 *
 * `decryptSecret` transparently handles both encrypted (`enc:v1:`) and legacy
 * plaintext values, so turning encryption on later does not break existing rows.
 */

const PREFIX = "enc:v1:";
const ALGO = "aes-256-gcm";

function getKey(): Buffer | null {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) return null;
  // Accept 64-char hex or base64; must decode to exactly 32 bytes.
  let key: Buffer;
  if (/^[0-9a-fA-F]{64}$/.test(raw)) {
    key = Buffer.from(raw, "hex");
  } else {
    key = Buffer.from(raw, "base64");
  }
  if (key.length !== 32) {
    // Fail CLOSED. An operator who set ENCRYPTION_KEY intended encryption;
    // silently downgrading to plaintext would hide a misconfiguration and
    // write an unencrypted API token to the database.
    throw new Error(
      `ENCRYPTION_KEY must decode to exactly 32 bytes (got ${key.length}). ` +
        `Provide 64 hex chars or a 32-byte base64 value, or unset it to store secrets as plaintext.`
    );
  }
  return key;
}

/** Returns true when a valid ENCRYPTION_KEY is configured. */
export function encryptionEnabled(): boolean {
  return getKey() !== null;
}

/**
 * Encrypt a secret for storage. Returns an `enc:v1:` string when a key is
 * configured, otherwise returns the plaintext unchanged.
 */
export function encryptSecret(plaintext: string): string {
  const key = getKey();
  if (!key) return plaintext;

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  const payload = Buffer.concat([iv, tag, ciphertext]).toString("base64");
  return PREFIX + payload;
}

/**
 * Decrypt a stored secret. Handles both `enc:v1:` values and legacy plaintext
 * (returned unchanged). Throws only if an `enc:v1:` value cannot be decrypted
 * (wrong/absent key or tampering).
 */
export function decryptSecret(stored: string): string {
  if (!stored.startsWith(PREFIX)) return stored; // legacy plaintext

  const key = getKey();
  if (!key) {
    throw new Error(
      "Encrypted secret found but ENCRYPTION_KEY is not configured."
    );
  }

  const buf = Buffer.from(stored.slice(PREFIX.length), "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ciphertext = buf.subarray(28);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}
