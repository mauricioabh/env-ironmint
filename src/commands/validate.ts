import { EnvDetector } from "../utils/env-detector.js";
import { EnvValidator } from "../utils/env-validator.js";
import { OutputFormatter } from "../utils/output-formatter.js";
import { GitChecker } from "../utils/git-checker.js";
import { CliOptions } from "../types/index.js";

export class ValidateCommand {
  /**
   * Execute validation command
   */
  static async execute(options: CliOptions): Promise<void> {
    try {
      console.log("🔍 Scanning for .env files...\n");

      // Detect all .env files
      const envFiles = await EnvDetector.detectEnvFiles();

      if (envFiles.length === 0) {
        console.log("❌ No .env files found in the current directory");
        return;
      }

      console.log(`📁 Found ${envFiles.length} .env file(s):`);
      envFiles.forEach((file) => {
        console.log(
          `   • ${file.name} (${Object.keys(file.variables).length} variables)`
        );
      });
      console.log("");

      // Find example file
      const exampleFile = EnvDetector.findExampleFile(envFiles);

      if (!exampleFile) {
        console.log(
          "⚠️  No .env.example file found. Validation will be limited.\n"
        );
      }

      // Validate each file
      const results = [];
      for (const envFile of envFiles) {
        // Skip example file from validation
        if (
          envFile.name === ".env.example" ||
          envFile.name.endsWith(".example")
        ) {
          continue;
        }

        const result = EnvValidator.validateEnvFile(
          envFile,
          exampleFile || undefined
        );
        results.push(result);
      }

      // Check git integration if requested
      if (options.git) {
        const gitCheck = GitChecker.checkGitIgnore();
        if (!gitCheck.isProperlyIgnored) {
          console.log(GitChecker.formatGitWarnings(gitCheck.warnings));
        }
      }

      // Format and display results
      const output = OutputFormatter.formatResults(results, options);
      console.log(output);

      // Exit with error code if any files are invalid
      const hasInvalidFiles = results.some((r) => !r.isValid);
      if (hasInvalidFiles) {
        process.exit(1);
      }
    } catch (error) {
      console.error(
        "❌ Error during validation:",
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  }
}
