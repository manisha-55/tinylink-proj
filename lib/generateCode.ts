import crypto from "crypto";

export function generateCode(length = 6) {
  return crypto.randomBytes(Math.ceil(length / 2))
              .toString("hex")
              .slice(0, length);
}
