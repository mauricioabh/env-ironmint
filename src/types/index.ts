export interface EnvFile {
  path: string;
  name: string;
  variables: Record<string, string>;
  isEmpty: boolean;
}

export interface EnvComparison {
  missing: string[];
  extra: string[];
  empty: string[];
  suspicious: string[];
  securityIssues: SecurityIssue[];
}

export interface SecurityIssue {
  variable: string;
  type: "exposed_secret" | "weak_pattern" | "git_tracked";
  severity: "low" | "medium" | "high";
  message: string;
}

export interface ValidationResult {
  file: EnvFile;
  comparison: EnvComparison;
  isValid: boolean;
  score: number;
}

export interface CliOptions {
  mode?: string;
  git?: boolean;
  sync?: boolean;
  verbose?: boolean;
  output?: "table" | "json" | "summary";
}

export interface SyncOptions {
  targetFile: string;
  sourceFile: string;
  preserveExisting: boolean;
  fillEmpty: boolean;
}

