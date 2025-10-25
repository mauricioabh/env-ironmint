import fs from "fs-extra";
const { existsSync, readFileSync } = fs;
import { join } from "path";
import chalk from "chalk";

export class GitChecker {
  /**
   * Check if .gitignore properly ignores .env files
   */
  static checkGitIgnore(directory: string = process.cwd()): {
    isProperlyIgnored: boolean;
    warnings: string[];
  } {
    const gitIgnorePath = join(directory, ".gitignore");
    const warnings: string[] = [];

    if (!existsSync(gitIgnorePath)) {
      warnings.push("No .gitignore file found");
      return { isProperlyIgnored: false, warnings };
    }

    const gitIgnoreContent = readFileSync(gitIgnorePath, "utf-8");
    const lines = gitIgnoreContent.split("\n").map((line) => line.trim());

    // Check for common .env ignore patterns
    const envPatterns = [
      ".env",
      ".env.local",
      ".env.*.local",
      ".env.production",
      ".env.staging",
      "*.env",
      ".env*",
    ];

    const hasEnvPatterns = envPatterns.some((pattern) =>
      lines.some((line) => line === pattern || line.includes(pattern))
    );

    if (!hasEnvPatterns) {
      warnings.push("No .env patterns found in .gitignore");
    }

    // Check for specific problematic patterns
    const problematicPatterns = [
      ".env.example", // This should NOT be ignored
      ".env.defaults", // This should NOT be ignored
    ];

    problematicPatterns.forEach((pattern) => {
      if (lines.includes(pattern)) {
        warnings.push(
          `Pattern '${pattern}' should not be in .gitignore (it's a template file)`
        );
      }
    });

    return {
      isProperlyIgnored: hasEnvPatterns && warnings.length === 0,
      warnings,
    };
  }

  /**
   * Check if any .env files are currently tracked by git
   */
  static async checkTrackedFiles(
    directory: string = process.cwd()
  ): Promise<{ trackedFiles: string[]; warnings: string[] }> {
    const warnings: string[] = [];
    const trackedFiles: string[] = [];

    try {
      // This would require git commands, for now we'll return a placeholder
      // In a real implementation, you'd run: git ls-files | grep -E '\.env'
      warnings.push("Git tracking check requires git command execution");
    } catch (error) {
      warnings.push("Could not check git tracking status");
    }

    return { trackedFiles, warnings };
  }

  /**
   * Format git-related warnings
   */
  static formatGitWarnings(warnings: string[]): string {
    if (warnings.length === 0) return "";

    let output = `\n${chalk.bold.yellow("⚠️  Git Integration Warnings:")}`;

    warnings.forEach((warning) => {
      output += `\n  ${chalk.yellow("•")} ${chalk.gray(warning)}`;
    });

    output += `\n\n${chalk.blue("💡 Recommendations:")}`;
    output += `\n  ${chalk.blue("•")} Add .env* to your .gitignore file`;
    output += `\n  ${chalk.blue(
      "•"
    )} Keep .env.example and .env.defaults in version control`;
    output += `\n  ${chalk.blue("•")} Never commit actual secrets to git`;

    return output;
  }
}
