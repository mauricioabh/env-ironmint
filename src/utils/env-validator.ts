import {
  EnvFile,
  EnvComparison,
  SecurityIssue,
  ValidationResult,
} from "../types/index.js";

export class EnvValidator {
  private static readonly SECRET_PATTERNS = [
    /API_KEY/i,
    /TOKEN/i,
    /PASSWORD/i,
    /SECRET/i,
    /PRIVATE_KEY/i,
    /ACCESS_TOKEN/i,
    /REFRESH_TOKEN/i,
    /AUTH_TOKEN/i,
    /JWT_SECRET/i,
    /DATABASE_URL/i,
    /DB_PASSWORD/i,
    /REDIS_PASSWORD/i,
    /ENCRYPTION_KEY/i,
  ];

  private static readonly WEAK_PATTERNS = [
    /^$/, // Empty
    /^test$/i,
    /^password$/i,
    /^123456$/,
    /^admin$/i,
    /^root$/i,
    /^user$/i,
    /^demo$/i,
    /^example$/i,
    /^your_.*_here$/i,
    /^TODO_/i,
    /^CHANGE_/i,
    /^REPLACE_/i,
  ];

  /**
   * Compare two .env files and return differences
   */
  static compareEnvFiles(
    targetFile: EnvFile,
    exampleFile: EnvFile
  ): EnvComparison {
    const targetKeys = new Set(Object.keys(targetFile.variables));
    const exampleKeys = new Set(Object.keys(exampleFile.variables));

    const missing = Array.from(exampleKeys).filter(
      (key) => !targetKeys.has(key)
    );
    const extra = Array.from(targetKeys).filter((key) => !exampleKeys.has(key));

    const empty = Array.from(targetKeys).filter((key) => {
      const value = targetFile.variables[key];
      return !value || value.trim() === "" || value === '""' || value === "''";
    });

    const suspicious = Array.from(targetKeys).filter((key) => {
      const value = targetFile.variables[key];
      return this.WEAK_PATTERNS.some((pattern) => pattern.test(value));
    });

    const securityIssues = this.detectSecurityIssues(targetFile);

    return {
      missing,
      extra,
      empty,
      suspicious,
      securityIssues,
    };
  }

  /**
   * Validate a single .env file
   */
  static validateEnvFile(
    envFile: EnvFile,
    exampleFile?: EnvFile
  ): ValidationResult {
    let comparison: EnvComparison = {
      missing: [],
      extra: [],
      empty: [],
      suspicious: [],
      securityIssues: [],
    };

    if (exampleFile) {
      comparison = this.compareEnvFiles(envFile, exampleFile);
    } else {
      // Validate without example file
      comparison.empty = Object.keys(envFile.variables).filter((key) => {
        const value = envFile.variables[key];
        return (
          !value || value.trim() === "" || value === '""' || value === "''"
        );
      });

      comparison.suspicious = Object.keys(envFile.variables).filter((key) => {
        const value = envFile.variables[key];
        return this.WEAK_PATTERNS.some((pattern) => pattern.test(value));
      });

      comparison.securityIssues = this.detectSecurityIssues(envFile);
    }

    const isValid =
      comparison.missing.length === 0 &&
      comparison.empty.length === 0 &&
      comparison.securityIssues.filter((issue) => issue.severity === "high")
        .length === 0;

    const score = this.calculateScore(comparison);

    return {
      file: envFile,
      comparison,
      isValid,
      score,
    };
  }

  /**
   * Detect security issues in .env file
   */
  private static detectSecurityIssues(envFile: EnvFile): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    for (const [key, value] of Object.entries(envFile.variables)) {
      // Check for exposed secrets
      if (this.SECRET_PATTERNS.some((pattern) => pattern.test(key))) {
        if (this.WEAK_PATTERNS.some((pattern) => pattern.test(value))) {
          issues.push({
            variable: key,
            type: "exposed_secret",
            severity: "high",
            message: `Secret variable '${key}' has a weak or default value`,
          });
        } else if (value.length < 8) {
          issues.push({
            variable: key,
            type: "exposed_secret",
            severity: "medium",
            message: `Secret variable '${key}' is too short (${value.length} characters)`,
          });
        }
      }

      // Check for weak patterns
      if (this.WEAK_PATTERNS.some((pattern) => pattern.test(value))) {
        issues.push({
          variable: key,
          type: "weak_pattern",
          severity: "medium",
          message: `Variable '${key}' has a weak or placeholder value: '${value}'`,
        });
      }
    }

    return issues;
  }

  /**
   * Calculate validation score (0-100)
   */
  private static calculateScore(comparison: EnvComparison): number {
    let score = 100;

    // Deduct points for issues
    score -= comparison.missing.length * 10; // -10 per missing variable
    score -= comparison.empty.length * 5; // -5 per empty variable
    score -= comparison.suspicious.length * 3; // -3 per suspicious variable

    // Deduct more for security issues
    comparison.securityIssues.forEach((issue) => {
      switch (issue.severity) {
        case "high":
          score -= 20;
          break;
        case "medium":
          score -= 10;
          break;
        case "low":
          score -= 5;
          break;
      }
    });

    return Math.max(0, score);
  }

  /**
   * Check if a file should be git-ignored
   */
  static shouldBeGitIgnored(fileName: string): boolean {
    const gitIgnorePatterns = [
      ".env.local",
      ".env.production",
      ".env.staging",
      ".env.*.local",
    ];

    return gitIgnorePatterns.some((pattern) => {
      if (pattern.includes("*")) {
        const regex = new RegExp(pattern.replace("*", ".*"));
        return regex.test(fileName);
      }
      return fileName === pattern;
    });
  }
}

