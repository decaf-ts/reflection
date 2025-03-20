import { VERSION } from "../../src";

describe("Distribution Tests", () => {
  it("reads lib", () => {
    const { VERSION, Reflection } = require("../../lib/index.cjs");
    expect(VERSION).toBeDefined();
    expect(Reflection).toBeDefined();
  });

  it("reads JS Bundle", () => {
    const {
      VERSION,
      Reflection,
    } = require("../../dist/reflection.bundle.min.js");
    expect(VERSION).toBeDefined();
    expect(Reflection).toBeDefined();
  });
});
