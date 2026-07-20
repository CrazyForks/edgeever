import { describe, expect, test } from "bun:test";
import {
  buildWranglerInvocation,
  resolveWranglerCliPath,
  runWranglerSync,
} from "../scripts/wrangler-runner.mjs";

describe("cross-platform Wrangler runner", () => {
  test("uses the installed JavaScript CLI instead of a platform shell shim", () => {
    const invocation = buildWranglerInvocation(["--version"], {
      cwd: process.cwd(),
      runtimeExecutable: process.execPath,
    });

    expect(invocation.executable).toBe(process.execPath);
    expect(invocation.args).toEqual([resolveWranglerCliPath(process.cwd()), "--version"]);
    expect(invocation.args[0]).toEndWith("node_modules/wrangler/bin/wrangler.js");
    expect(invocation.args[0]).not.toEndWith("wrangler.cmd");
  });

  test("runs the project-local Wrangler without a global installation", () => {
    const result = runWranglerSync(["--version"], { cwd: process.cwd(), encoding: "utf8" });

    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/^\d+\.\d+\.\d+/);
  });
});
