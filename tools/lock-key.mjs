#!/usr/bin/env node
/**
 * One-time helper: lock the Anthropic key from the project .env file.
 *
 * Usage (from the repo root):
 *   node tools/lock-key.mjs "your-passphrase"
 *
 * Prints only the locked blob. Never prints the real key.
 * Paste that blob into tools/lecture-key.html as LOCKED_KEY.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { webcrypto } from "node:crypto";

const ITERATIONS = 210000;
const SALT_LEN = 16;
const IV_LEN = 12;

function readEnvKey(envPath) {
  let raw;
  try {
    raw = readFileSync(envPath, "utf8");
  } catch (err) {
    throw new Error("Could not read .env at " + envPath + " — " + err.message);
  }
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const match = trimmed.match(/^(?:ANTHROPIC_API|ANTHROPIC_API_KEY)\s*=\s*(.*)$/);
    if (match) {
      return match[1].trim().replace(/^['"]|['"]$/g, "");
    }
  }
  throw new Error("No ANTHROPIC_API line found in .env");
}

function bytesToB64(bytes) {
  return Buffer.from(bytes).toString("base64");
}

function b64ToBytes(b64) {
  return new Uint8Array(Buffer.from(b64, "base64"));
}

async function deriveKey(passphrase, salt) {
  const enc = new TextEncoder();
  const baseKey = await webcrypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return webcrypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptText(plaintext, passphrase) {
  const salt = webcrypto.getRandomValues(new Uint8Array(SALT_LEN));
  const iv = webcrypto.getRandomValues(new Uint8Array(IV_LEN));
  const key = await deriveKey(passphrase, salt);
  const cipher = new Uint8Array(
    await webcrypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(plaintext)
    )
  );
  const packed = new Uint8Array(SALT_LEN + IV_LEN + cipher.length);
  packed.set(salt, 0);
  packed.set(iv, SALT_LEN);
  packed.set(cipher, SALT_LEN + IV_LEN);
  return bytesToB64(packed);
}

async function decryptText(blob, passphrase) {
  const packed = b64ToBytes(blob);
  if (packed.length < SALT_LEN + IV_LEN + 16) {
    throw new Error("Locked text is too short to be valid");
  }
  const salt = packed.slice(0, SALT_LEN);
  const iv = packed.slice(SALT_LEN, SALT_LEN + IV_LEN);
  const cipher = packed.slice(SALT_LEN + IV_LEN);
  const key = await deriveKey(passphrase, salt);
  const plain = await webcrypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipher);
  return new TextDecoder().decode(plain);
}

async function main() {
  const passphrase = process.argv[2];
  if (!passphrase) {
    throw new Error('Missing passphrase. Example: node tools/lock-key.mjs "your-passphrase"');
  }

  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const apiKey = readEnvKey(join(root, ".env"));
  if (!apiKey.startsWith("sk-ant-")) {
    throw new Error("The .env value does not look like an Anthropic key (should start with sk-ant-)");
  }

  const blob = await encryptText(apiKey, passphrase);
  const roundTrip = await decryptText(blob, passphrase);
  if (roundTrip !== apiKey) {
    throw new Error("Round-trip check failed in the lock-key step");
  }

  process.stdout.write(blob + "\n");
  process.stderr.write(
    "Locked OK. Length " +
      apiKey.length +
      " chars, prefix " +
      apiKey.slice(0, 7) +
      ". Paste the line above into LOCKED_KEY.\n"
  );
}

main().catch((err) => {
  process.stderr.write("lock-key failed: " + err.message + "\n");
  process.exit(1);
});
