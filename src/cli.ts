#!/usr/bin/env node

import { Command } from "commander";
import { ValidateCommand } from "./commands/validate.js";
import { SyncCommand } from "./commands/sync.js";
import { CliOptions } from "./types/index.js";
import chalk from "chalk";

const program = new Command();

program
  .name("env-ironmint")
  .description("A modern utility to verify, compare and validate .env files")
  .version("1.0.0");

// Validate command (default)
program
  .command("validate", { isDefault: true })
  .description("Validate .env files against .env.example")
  .option(
    "-m, --mode <mode>",
    "Environment mode (development, production, test, etc.)"
  )
  .option("-g, --git", "Check git integration and .gitignore")
  .option("-v, --verbose", "Show detailed output")
  .option(
    "-o, --output <format>",
    "Output format (table, json, summary)",
    "summary"
  )
  .action(async (options: CliOptions) => {
    await ValidateCommand.execute(options);
  });

// Sync command
program
  .command("sync [target]")
  .description("Sync .env.local with .env.example")
  .option("-t, --target <file>", "Target file to sync (default: .env.local)")
  .action(async (target: string = ".env.local") => {
    await SyncCommand.execute(target);
  });

// List command
program
  .command("list")
  .description("List all .env files in the current directory")
  .action(async () => {
    try {
      const { EnvDetector } = await import("./utils/env-detector.js");
      const envFiles = await EnvDetector.detectEnvFiles();

      if (envFiles.length === 0) {
        console.log(
          chalk.yellow("No .env files found in the current directory")
        );
        return;
      }

      console.log(chalk.blue(`Found ${envFiles.length} .env file(s):\n`));

      envFiles.forEach((file) => {
        const variableCount = Object.keys(file.variables).length;
        const status = file.isEmpty
          ? chalk.red("Empty")
          : chalk.green(`${variableCount} variables`);
        console.log(`  ${chalk.bold(file.name)} - ${status}`);
        console.log(`    ${chalk.gray(file.path)}`);
      });
    } catch (error) {
      console.error(
        chalk.red("Error listing files:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

// Help command
program
  .command("help")
  .description("Show detailed help information")
  .action(() => {
    console.log(
      chalk.bold.blue(`
╔══════════════════════════════════════════════════════════════╗
║                    🔧 env-ironmint Help                     ║
╚══════════════════════════════════════════════════════════════╝

${chalk.bold("Commands:")}
  ${chalk.green("validate")}     Validate .env files (default command)
  ${chalk.green("sync")}         Sync .env.local with .env.example
  ${chalk.green("list")}         List all .env files
  ${chalk.green("help")}         Show this help message

${chalk.bold("Examples:")}
  ${chalk.gray("npx env-ironmint")}                    # Validate all .env files
  ${chalk.gray(
    "npx env-ironmint validate --git"
  )}     # Validate with git checks
  ${chalk.gray("npx env-ironmint sync")}               # Sync .env.local
  ${chalk.gray("npx env-ironmint list")}               # List .env files

${chalk.bold("Options:")}
  ${chalk.yellow("--mode <mode>")}     Environment mode (dev, prod, test)
  ${chalk.yellow("--git")}             Check git integration
  ${chalk.yellow("--verbose")}         Show detailed output
  ${chalk.yellow("--output <format>")} Output format (table, json, summary)

${chalk.bold("Features:")}
  • 🔍 Automatic .env file detection
  • 🔒 Security issue detection
  • 📊 Validation scoring
  • 🎨 Colorful console output
  • 🔄 Environment file syncing
  • 📝 Git integration checks
`)
    );
  });

// Error handling
program.on("command:*", () => {
  console.error(
    chalk.red(
      `Invalid command. Use 'env-ironmint help' for available commands.`
    )
  );
  process.exit(1);
});

// Parse arguments
program.parse();

// If no command is provided, run validate
if (!process.argv.slice(2).length) {
  ValidateCommand.execute({});
}

