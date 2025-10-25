import chalk from "chalk";
import { ValidationResult, SecurityIssue } from "../types/index.js";

export class OutputFormatter {
  /**
   * Format validation results for console output
   */
  static formatResults(
    results: ValidationResult[],
    options: { verbose?: boolean; output?: string } = {}
  ): string {
    const output: string[] = [];

    // Header
    output.push(this.formatHeader());

    // Summary
    output.push(this.formatSummary(results));

    // Detailed results
    for (const result of results) {
      output.push(this.formatFileResult(result, options.verbose));
    }

    // Security warnings
    const allSecurityIssues = results.flatMap(
      (r) => r.comparison.securityIssues
    );
    if (allSecurityIssues.length > 0) {
      output.push(this.formatSecurityWarnings(allSecurityIssues));
    }

    return output.join("\n");
  }

  /**
   * Format header with project info
   */
  private static formatHeader(): string {
    return chalk.bold.blue(`
╔══════════════════════════════════════════════════════════════╗
║                    🔧 env-ironmint v1.0.0                   ║
║              Environment Variables Validator                 ║
╚══════════════════════════════════════════════════════════════╝
`);
  }

  /**
   * Format summary of all results
   */
  private static formatSummary(results: ValidationResult[]): string {
    const totalFiles = results.length;
    const validFiles = results.filter((r) => r.isValid).length;
    const invalidFiles = totalFiles - validFiles;
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / totalFiles;

    const status =
      invalidFiles === 0
        ? chalk.green("✅ All files are valid")
        : chalk.red(`❌ ${invalidFiles} file(s) have issues`);

    return `
${chalk.bold("📊 Summary:")}
  ${chalk.gray("Files checked:")} ${totalFiles}
  ${chalk.gray("Valid files:")} ${chalk.green(validFiles)} ${chalk.gray(
      "/"
    )} ${chalk.red(invalidFiles)}
  ${chalk.gray("Average score:")} ${this.formatScore(avgScore)}
  ${chalk.gray("Status:")} ${status}
`;
  }

  /**
   * Format individual file result
   */
  private static formatFileResult(
    result: ValidationResult,
    verbose: boolean = false
  ): string {
    const { file, comparison, isValid, score } = result;
    const status = isValid
      ? chalk.green("✅ Valid")
      : chalk.red("❌ Issues found");

    let output = `
${chalk.bold(`📄 ${file.name}`)} ${status} ${this.formatScore(score)}
${chalk.gray(`   Path: ${file.path}`)}`;

    if (!isValid || verbose) {
      // Missing variables
      if (comparison.missing.length > 0) {
        output += `\n  ${chalk.red("❌ Missing variables:")}`;
        comparison.missing.forEach((key) => {
          output += `\n    ${chalk.red("•")} ${chalk.yellow(key)}`;
        });
      }

      // Extra variables
      if (comparison.extra.length > 0) {
        output += `\n  ${chalk.yellow("⚠️  Extra variables:")}`;
        comparison.extra.forEach((key) => {
          output += `\n    ${chalk.yellow("•")} ${chalk.gray(key)}`;
        });
      }

      // Empty variables
      if (comparison.empty.length > 0) {
        output += `\n  ${chalk.red("🔴 Empty variables:")}`;
        comparison.empty.forEach((key) => {
          output += `\n    ${chalk.red("•")} ${chalk.yellow(key)}`;
        });
      }

      // Suspicious variables
      if (comparison.suspicious.length > 0) {
        output += `\n  ${chalk.yellow("⚠️  Suspicious values:")}`;
        comparison.suspicious.forEach((key) => {
          const value = result.file.variables[key];
          output += `\n    ${chalk.yellow("•")} ${chalk.gray(
            key
          )} = ${chalk.red(`"${value}"`)}`;
        });
      }
    }

    return output;
  }

  /**
   * Format security warnings
   */
  private static formatSecurityWarnings(issues: SecurityIssue[]): string {
    if (issues.length === 0) return "";

    const highSeverity = issues.filter((i) => i.severity === "high");
    const mediumSeverity = issues.filter((i) => i.severity === "medium");
    const lowSeverity = issues.filter((i) => i.severity === "low");

    let output = `\n${chalk.bold.red("🚨 Security Issues:")}`;

    if (highSeverity.length > 0) {
      output += `\n  ${chalk.red("🔴 High Severity:")}`;
      highSeverity.forEach((issue) => {
        output += `\n    ${chalk.red("•")} ${chalk.yellow(
          issue.variable
        )}: ${chalk.red(issue.message)}`;
      });
    }

    if (mediumSeverity.length > 0) {
      output += `\n  ${chalk.yellow("🟡 Medium Severity:")}`;
      mediumSeverity.forEach((issue) => {
        output += `\n    ${chalk.yellow("•")} ${chalk.gray(
          issue.variable
        )}: ${chalk.yellow(issue.message)}`;
      });
    }

    if (lowSeverity.length > 0) {
      output += `\n  ${chalk.blue("🔵 Low Severity:")}`;
      lowSeverity.forEach((issue) => {
        output += `\n    ${chalk.blue("•")} ${chalk.gray(
          issue.variable
        )}: ${chalk.blue(issue.message)}`;
      });
    }

    return output;
  }

  /**
   * Format score with color coding
   */
  private static formatScore(score: number): string {
    if (score >= 90) return chalk.green(`${score.toFixed(1)}/100`);
    if (score >= 70) return chalk.yellow(`${score.toFixed(1)}/100`);
    return chalk.red(`${score.toFixed(1)}/100`);
  }

  /**
   * Format JSON output
   */
  static formatJson(results: ValidationResult[]): string {
    return JSON.stringify(results, null, 2);
  }

  /**
   * Format table output
   */
  static formatTable(results: ValidationResult[]): string {
    const output: string[] = [];

    output.push(
      chalk.bold("┌─────────────────┬─────────┬─────────┬─────────┬─────────┐")
    );
    output.push(
      chalk.bold("│ File            │ Status  │ Score   │ Missing │ Issues  │")
    );
    output.push(
      chalk.bold("├─────────────────┼─────────┼─────────┼─────────┼─────────┤")
    );

    for (const result of results) {
      const fileName = result.file.name.padEnd(15);
      const status = result.isValid
        ? chalk.green("✅ Valid")
        : chalk.red("❌ Issues");
      const score = this.formatScore(result.score).padEnd(7);
      const missing = result.comparison.missing.length.toString().padStart(7);
      const issues = (
        result.comparison.empty.length + result.comparison.suspicious.length
      )
        .toString()
        .padStart(7);

      output.push(
        `│ ${fileName} │ ${status} │ ${score} │ ${missing} │ ${issues} │`
      );
    }

    output.push(
      chalk.bold("└─────────────────┴─────────┴─────────┴─────────┴─────────┘")
    );

    return output.join("\n");
  }
}

