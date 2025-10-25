import { EnvSync } from "../utils/env-sync.js";
import fs from "fs-extra";
const { existsSync } = fs;
import { join } from "path";
import chalk from "chalk";

export class SyncCommand {
  /**
   * Execute sync command
   */
  static async execute(targetFile: string = ".env.local"): Promise<void> {
    try {
      const sourceFile = ".env.example";

      if (!existsSync(sourceFile)) {
        console.log(chalk.red(`❌ Source file not found: ${sourceFile}`));
        console.log(
          chalk.yellow(
            "💡 Create a .env.example file first with your template variables."
          )
        );
        process.exit(1);
      }

      console.log(chalk.blue(`🔄 Syncing ${sourceFile} → ${targetFile}...\n`));

      const result = await EnvSync.syncEnvFile({
        targetFile,
        sourceFile,
        preserveExisting: true,
        fillEmpty: true,
      });

      console.log(EnvSync.formatSyncResult(result));

      if (result.success) {
        console.log(chalk.green("\n✅ Sync completed successfully!"));
        console.log(chalk.gray("   • Existing values were preserved"));
        console.log(
          chalk.gray("   • Empty values were filled with TODO_ placeholders")
        );
        console.log(chalk.gray("   • Review and update the values as needed"));
      } else {
        process.exit(1);
      }
    } catch (error) {
      console.error(
        chalk.red("❌ Error during sync:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  }
}
