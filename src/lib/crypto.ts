import { createHash, randomBytes } from "node:crypto";

export function sha256Base64Url(input: string) {
  const hash = createHash("sha256").update(input).digest();
  return hash
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

export function randomTokenBase64Url(bytes = 32) {
  const buf = randomBytes(bytes);
  return buf
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}
