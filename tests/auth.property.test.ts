import assert from "node:assert/strict";
import { test } from "node:test";
import fc from "fast-check";
import { createAuthToken, hasValidAuthToken, isValidCredentials } from "@/lib/auth-core";

test("auth token remains valid for every non-empty secret", () => {
  fc.assert(
    fc.property(fc.string({ minLength: 1 }), (secret) => {
      const token = createAuthToken(secret);
      assert.equal(hasValidAuthToken(token, secret), true);
    }),
  );
});

test("any one-character token mutation is rejected", () => {
  fc.assert(
    fc.property(fc.string({ minLength: 1 }), (secret) => {
      const token = createAuthToken(secret);
      const replacement = token[0] === "0" ? "1" : "0";
      const tampered = replacement + token.slice(1);
      assert.equal(hasValidAuthToken(tampered, secret), false);
    }),
  );
});

test("credentials only pass on an exact configured match", () => {
  fc.assert(
    fc.property(fc.string(), fc.string(), (username, password) => {
      assert.equal(isValidCredentials(username, password, "admin", "secret"), username === "admin" && password === "secret");
    }),
  );
});
