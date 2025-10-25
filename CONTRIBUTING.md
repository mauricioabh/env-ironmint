# Contributing to env-ironmint

Thank you for your interest in contributing to env-ironmint! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 8+
- Git

### Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/env-ironmint.git
   cd env-ironmint
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 🛠️ Development Workflow

### Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Test your changes**

   ```bash
   npm test
   npm run test:coverage
   ```

5. **Lint your code**
   ```bash
   npm run lint
   npm run lint:fix
   ```

### Code Style

- Use TypeScript with strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Write descriptive commit messages
- Add JSDoc comments for public APIs

### Testing

- Write unit tests for new features
- Add integration tests for CLI commands
- Maintain test coverage above 70%
- Test on multiple Node.js versions

## 📝 Pull Request Process

### Before Submitting

1. **Ensure tests pass**

   ```bash
   npm run test:ci
   ```

2. **Check linting**

   ```bash
   npm run lint
   ```

3. **Update documentation**

   - Update README.md if needed
   - Add/update CHANGELOG.md
   - Update inline documentation

4. **Test the CLI**
   ```bash
   npm start validate --git
   npm start sync
   npm start list
   ```

### PR Guidelines

- **Title**: Use conventional commits format
- **Description**: Explain what changes you made and why
- **Tests**: Ensure all tests pass
- **Documentation**: Update relevant documentation
- **Breaking Changes**: Clearly mark any breaking changes

### Commit Message Format

Use conventional commits:

```
feat: add new validation rule for API keys
fix: resolve issue with .env file detection
docs: update README with new examples
test: add tests for sync command
```

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Environment information**

   - Node.js version
   - Operating system
   - Package version

2. **Steps to reproduce**

   - Clear, numbered steps
   - Expected vs actual behavior

3. **Additional context**
   - Screenshots if applicable
   - Error messages
   - Relevant .env file examples (sanitized)

### Feature Requests

For feature requests, please include:

1. **Use case description**

   - What problem does this solve?
   - How would you use this feature?

2. **Proposed solution**

   - How should this work?
   - Any implementation ideas?

3. **Alternatives considered**
   - What other approaches did you consider?

## 🏗️ Project Structure

```
env-ironmint/
├── src/                    # Source code
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── commands/          # CLI commands
│   ├── cli.ts             # Main CLI entry point
│   └── index.ts           # Package exports
├── tests/                 # Test files
├── dist/                  # Compiled output
├── .github/               # GitHub workflows and templates
└── docs/                  # Additional documentation
```

## 📋 Development Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm test`)
- [ ] Test coverage is maintained
- [ ] Linting passes (`npm run lint`)
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] No breaking changes (or clearly marked)
- [ ] CLI commands work as expected
- [ ] Examples in README are tested

## 🤝 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## 📞 Getting Help

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Use GitHub Issues for bugs and feature requests
- **Security**: Report security issues privately via email

## 🎉 Recognition

Contributors will be recognized in:

- README.md contributors section
- CHANGELOG.md release notes
- GitHub contributors page

Thank you for contributing to env-ironmint! 🚀
