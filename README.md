# 🔧 env-ironmint

A modern utility to verify, compare and validate .env files across your project. Perfect for CI/CD pipelines and local development.

## ✨ Features

- 🔍 **Automatic Detection** - Finds all `.env*` files in your project
- 🔒 **Security Validation** - Detects exposed secrets and weak patterns
- 📊 **Smart Comparison** - Compares against `.env.example` template
- 🎨 **Beautiful Output** - Colorful, readable console output
- 🔄 **Sync Mode** - Sync `.env.local` with `.env.example`
- 📝 **Git Integration** - Check `.gitignore` and tracking status
- 🚀 **CLI Ready** - Run with `npx env-ironmint`

## 🚀 Quick Start

```bash
# Install globally
npm install -g env-ironmint

# Or run directly with npx
npx env-ironmint

# Validate with git checks
npx env-ironmint validate --git

# Sync your local environment
npx env-ironmint sync

# List all .env files
npx env-ironmint list

# Test Branch Protection
npx env-ironmint --version
```

## 📋 Commands

### `validate` (default)

Validate all .env files against .env.example

```bash
npx env-ironmint validate [options]
```

**Options:**

- `--mode <mode>` - Environment mode (development, production, test)
- `--git` - Check git integration and .gitignore
- `--verbose` - Show detailed output
- `--output <format>` - Output format (table, json, summary)

### `sync`

Sync .env.local with .env.example

```bash
npx env-ironmint sync [target]
```

**Options:**

- `--target <file>` - Target file to sync (default: .env.local)

### `list`

List all .env files in the current directory

```bash
npx env-ironmint list
```

## 🔧 Configuration

### Environment Files Structure

env-ironmint automatically detects these file patterns:

```
.env                    # Main environment file
.env.local             # Local overrides (should be gitignored)
.env.development       # Development environment
.env.test              # Test environment
.env.production        # Production environment
.env.staging           # Staging environment
.env.example           # Template file (should be in git)
.env.defaults          # Default values
```

### .gitignore Recommendations

Make sure your `.gitignore` includes:

```gitignore
# Environment files
.env
.env.local
.env.*.local
.env.production
.env.staging

# But keep these in git
!.env.example
!.env.defaults
```

## 🛡️ Security Features

env-ironmint detects:

- **Exposed Secrets** - Variables with secret patterns but weak values
- **Weak Patterns** - Common placeholder values like "test", "password"
- **Empty Variables** - Missing required values
- **Git Tracking** - Files that shouldn't be in version control

## 📊 Output Examples

### Validation Summary

```
╔══════════════════════════════════════════════════════════════╗
║                    🔧 env-ironmint v1.0.0                   ║
║              Environment Variables Validator                 ║
╚══════════════════════════════════════════════════════════════╝

📊 Summary:
  Files checked: 3
  Valid files: 2 / 1
  Average score: 85.0/100
  Status: ❌ 1 file(s) have issues

📄 .env.local ✅ Valid 95.0/100
   Path: /project/.env.local

📄 .env.development ❌ Issues found 70.0/100
   Path: /project/.env.development
  ❌ Missing variables:
    • API_KEY
  🔴 Empty variables:
    • DATABASE_URL
  ⚠️  Suspicious values:
    • PASSWORD = "password"
```

### Security Warnings

```
🚨 Security Issues:
  🔴 High Severity:
    • API_KEY: Secret variable 'API_KEY' has a weak or default value
  🟡 Medium Severity:
    • PASSWORD: Variable 'PASSWORD' has a weak or placeholder value: 'password'
```

## 🔄 Sync Mode

The sync command helps you create a local environment file:

```bash
npx env-ironmint sync
```

This will:

- Create `.env.local` if it doesn't exist
- Copy all variables from `.env.example`
- Preserve existing values in `.env.local`
- Fill empty values with `TODO_` placeholders

## 🏗️ Development

```bash
# Clone the repository
git clone <repository-url>
cd env-ironmint

# Install dependencies
npm install

# Build the project
npm run build

# Run in development
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Test the CLI
npm start validate --git
```

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Test Structure

- **Unit Tests**: Test individual utility functions
- **Integration Tests**: Test CLI commands end-to-end
- **Coverage**: Minimum 50% code coverage required

## 📦 Publishing

```bash
# Build for production
npm run build

# Run tests before publishing
npm run test:ci

# Publish to npm
npm publish
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Built with TypeScript and Node.js
- Uses commander.js for CLI interface
- Styled with chalk for beautiful output
- Inspired by modern development workflows
