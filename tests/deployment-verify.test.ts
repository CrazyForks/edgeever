import { describe, expect, test } from "bun:test";
import {
  buildSchemaVerificationSql,
  parseD1Rows,
  parseSecretNames,
  REQUIRED_TABLES,
} from "../scripts/verify-deployment.mjs";

describe("deployment verification", () => {
  test("checks the remote schema tables required by current application code", () => {
    const sql = buildSchemaVerificationSql();
    for (const table of REQUIRED_TABLES) {
      expect(sql).toContain(`'${table}'`);
    }
  });

  test("parses Wrangler D1 JSON output", () => {
    expect(parseD1Rows(JSON.stringify([{ results: [{ name: "users" }] }]))).toEqual([{ name: "users" }]);
  });

  test("parses current and wrapped Wrangler secret output", () => {
    expect(parseSecretNames(JSON.stringify([{ name: "EDGE_EVER_AUTH_PASSWORD" }]))).toContain(
      "EDGE_EVER_AUTH_PASSWORD",
    );
    expect(parseSecretNames(JSON.stringify({ result: [{ name: "EDGE_EVER_AUTH_PASSWORD_HASH" }] }))).toContain(
      "EDGE_EVER_AUTH_PASSWORD_HASH",
    );
  });
});
