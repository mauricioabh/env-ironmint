# Security Policy

## 🔒 Supported Versions

We actively support the following versions of env-ironmint:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🚨 Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability in env-ironmint, please follow these steps:

### 1. **DO NOT** create a public GitHub issue

Security vulnerabilities should be reported privately to prevent exploitation.

### 2. **Email us directly**

Send an email to: [security@env-ironmint.dev](mailto:security@env-ironmint.dev)

Include the following information:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information

### 3. **Response timeline**

- **Initial response**: Within 48 hours
- **Status update**: Within 7 days
- **Resolution**: As quickly as possible

### 4. **What happens next**

1. We'll acknowledge receipt of your report
2. We'll investigate the vulnerability
3. We'll work on a fix
4. We'll release a security update
5. We'll credit you (if desired) in the security advisory

## 🛡️ Security Best Practices

### For Users

- **Keep env-ironmint updated** to the latest version
- **Review your .env files** regularly for exposed secrets
- **Use .gitignore** to prevent committing sensitive files
- **Rotate secrets** periodically
- **Use strong, unique values** for all environment variables

### For Developers

- **Never commit** actual secrets to version control
- **Use .env.example** files for templates
- **Validate environment variables** before deployment
- **Implement proper secret management** in production
- **Regular security audits** of your environment files

## 🔍 Security Features

env-ironmint includes several security features:

### Secret Detection

- Identifies variables with secret patterns (API_KEY, PASSWORD, etc.)
- Warns about weak or default values
- Detects exposed secrets in version control

### Validation Rules

- Checks for empty or missing required variables
- Validates against known weak patterns
- Ensures proper .gitignore configuration

### Git Integration

- Verifies .env files are properly ignored
- Warns about files that shouldn't be tracked
- Provides recommendations for secure practices

## 📋 Security Checklist

Before using env-ironmint in production:

- [ ] All .env files are in .gitignore
- [ ] No actual secrets in .env.example
- [ ] Strong, unique values for all secrets
- [ ] Regular rotation of sensitive credentials
- [ ] Proper access controls on environment files
- [ ] Security scanning of your codebase

## 🔄 Security Updates

We release security updates as needed. To stay informed:

1. **Watch the repository** for security releases
2. **Subscribe to notifications** for new versions
3. **Check CHANGELOG.md** for security-related updates
4. **Follow semantic versioning** for breaking changes

## 📞 Contact

For security-related questions or concerns:

- **Email**: [security@env-ironmint.dev](mailto:security@env-ironmint.dev)
- **GitHub**: Create a private security advisory
- **Issues**: Use GitHub's private vulnerability reporting

## 🙏 Acknowledgments

We appreciate security researchers who help us improve env-ironmint's security. Responsible disclosure helps keep our users safe.

Thank you for helping keep env-ironmint secure! 🛡️
