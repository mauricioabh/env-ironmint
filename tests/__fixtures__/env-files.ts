// Test fixture files for .env testing
export const validEnvContent = `
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=myuser
DB_PASSWORD=secure_password_123

# API Configuration
API_KEY=sk-1234567890abcdef
API_SECRET=secret_key_abcdef123456
JWT_SECRET=jwt_secret_very_long_and_secure

# Application Settings
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=https://myapp.com

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_DEBUG=false
`;

export const invalidEnvContent = `
# Database Configuration
DATABASE_URL=
DB_HOST=localhost
DB_PORT=5432
DB_NAME=
DB_USER=myuser
DB_PASSWORD=password

# API Configuration
API_KEY=test
API_SECRET=secret
JWT_SECRET=123

# Application Settings
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000

# Feature Flags
ENABLE_ANALYTICS=false
ENABLE_DEBUG=true
`;

export const exampleEnvContent = `
# Environment Variables Template
DATABASE_URL=postgresql://user:password@localhost:5432/database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=myuser
DB_PASSWORD=your_password_here

API_KEY=your_api_key_here
API_SECRET=your_api_secret_here
JWT_SECRET=your_jwt_secret_here

NODE_ENV=development
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000

ENABLE_ANALYTICS=false
ENABLE_DEBUG=true
`;

export const emptyEnvContent = `
# Empty environment file
`;

export const malformedEnvContent = `
# Malformed .env file
DATABASE_URL=postgresql://user:password@localhost:5432/database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=myuser
DB_PASSWORD=your_password_here

# Missing equals sign
API_KEY
API_SECRET=your_api_secret_here
JWT_SECRET=your_jwt_secret_here

# Empty line with equals
=

NODE_ENV=development
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000

ENABLE_ANALYTICS=false
ENABLE_DEBUG=true
`;

