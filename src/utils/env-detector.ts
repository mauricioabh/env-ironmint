import { glob } from "glob";
import fs from "fs-extra";
const { readFileSync, existsSync } = fs;
import { join } from "path";
import { EnvFile } from "../types/index.js";

export class EnvDetector {
  private static readonly ENV_PATTERNS = [
    ".env",
    ".env.*",
    ".env.local",
    ".env.development",
    ".env.test",
    ".env.production",
    ".env.staging",
    ".env.example",
    ".env.defaults",
  ];

  /**
   * Detect all .env files in the current directory
   */
  static async detectEnvFiles(
    directory: string = process.cwd()
  ): Promise<EnvFile[]> {
    const envFiles: EnvFile[] = [];
    const seenPaths = new Set<string>();

    for (const pattern of this.ENV_PATTERNS) {
      try {
        const files = await glob(pattern, {
          cwd: directory,
          dot: true,
          absolute: true,
        });

        for (const filePath of files) {
          if (existsSync(filePath) && !seenPaths.has(filePath)) {
            seenPaths.add(filePath);
            const envFile = await this.parseEnvFile(filePath);
            envFiles.push(envFile);
          }
        }
      } catch (error) {
        // Continue if pattern doesn't match any files
      }
    }

    return envFiles;
  }

  /**
   * Parse a single .env file
   */
  private static async parseEnvFile(filePath: string): Promise<EnvFile> {
    try {
      const content = readFileSync(filePath, "utf-8");
      const variables = this.parseEnvContent(content);

      return {
        path: filePath,
        name: this.getFileName(filePath),
        variables,
        isEmpty: Object.keys(variables).length === 0,
      };
    } catch (error) {
      return {
        path: filePath,
        name: this.getFileName(filePath),
        variables: {},
        isEmpty: true,
      };
    }
  }

  /**
   * Parse .env file content into key-value pairs
   */
  private static parseEnvContent(content: string): Record<string, string> {
    const variables: Record<string, string> = {};
    const lines = content.split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith("#")) {
        continue;
      }

      // Parse KEY=VALUE format
      const equalIndex = trimmedLine.indexOf("=");
      if (equalIndex > 0) {
        const key = trimmedLine.substring(0, equalIndex).trim();
        let value = trimmedLine.substring(equalIndex + 1).trim();

        // Remove quotes if present
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        variables[key] = value;
      }
    }

    return variables;
  }

  /**
   * Get filename from full path
   */
  private static getFileName(filePath: string): string {
    return filePath.split(/[/\\]/).pop() || filePath;
  }

  /**
   * Find the example file (.env.example)
   */
  static findExampleFile(envFiles: EnvFile[]): EnvFile | null {
    return (
      envFiles.find(
        (file) => file.name === ".env.example" || file.name.endsWith(".example")
      ) || null
    );
  }

  /**
   * Get environment-specific files based on NODE_ENV
   */
  static getEnvironmentFiles(
    envFiles: EnvFile[],
    environment?: string
  ): EnvFile[] {
    if (!environment) {
      environment = process.env.NODE_ENV || "development";
    }

    return envFiles.filter(
      (file) =>
        file.name === `.env.${environment}` ||
        file.name === ".env.local" ||
        file.name === ".env"
    );
  }
}
