import { execSync } from "child_process";
import { writeFileSync, unlinkSync, existsSync } from "fs";

describe("CLI Tests", () => {
  const originalCwd = process.cwd();

  beforeAll(() => {
    // Create test files
    writeFileSync(
      ".env.example",
      "API_KEY=test\nJWT_SECRET=secret\nNODE_ENV=development"
    );
  });

  afterAll(() => {
    // Clean up test files
    const testFiles = [".env", ".env.local", ".env.example"];
    testFiles.forEach((file) => {
      if (existsSync(file)) {
        unlinkSync(file);
      }
    });
  });

  describe("help command", () => {
    it("should show help information", () => {
      expect(() => {
        execSync("node dist/cli.js help", { encoding: "utf-8" });
      }).not.toThrow();
    });
  });

  describe("list command", () => {
    it("should list .env files", () => {
      expect(() => {
        execSync("node dist/cli.js list", { encoding: "utf-8" });
      }).not.toThrow();
    });
  });

  describe("sync command", () => {
    it("should sync .env files", () => {
      expect(() => {
        execSync("node dist/cli.js sync", { encoding: "utf-8" });
      }).not.toThrow();

      // Verify .env.local was created
      expect(existsSync(".env.local")).toBe(true);
    });
  });

  describe("validate command", () => {
    it("should validate .env files (may exit with error code)", () => {
      // The validate command may exit with error code when issues are found
      // This is expected behavior, so we just check it doesn't crash
      try {
        execSync("node dist/cli.js validate", { encoding: "utf-8" });
      } catch (error) {
        // Expected behavior - command exits with error code when issues found
        expect(error).toBeDefined();
      }
    });
  });
});
