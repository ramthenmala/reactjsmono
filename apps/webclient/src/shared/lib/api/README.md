# API Configuration

This directory contains the centralized API configuration for the application.

## Usage

### Basic Usage

```typescript
import { apiConfig } from './config';

// Get URL for a specific endpoint
const sectorsUrl = apiConfig.getApiUrl('sectors');
```

### Available Endpoints

- `isic` - ISIC codes
- `sectors` - Business sectors
- `regions` - Geographic regions
- `areas` - Area ranges
- `industrial-cities` - Industrial cities data

### Environment Configuration

The API configuration supports two modes:

#### Mock API Mode (Development)
```env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=https://www.jsonkeeper.com/b
VITE_MOCK_SECTORS_ENDPOINT=K2MTF
```

#### Production API Mode
```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://api.your-domain.com
VITE_PROD_SECTORS_ENDPOINT=/api/sectors
```

### Migration from Individual URLs

Previously, each service used individual environment variables:
- `VITE_SECTORS_API_URL=https://www.jsonkeeper.com/b/K2MTF`

Now, they use the centralized configuration:
- Base URL + endpoint approach for easier management
- Toggle between mock and production APIs
- Consistent URL construction across all services

### Benefits

1. **Centralized Configuration**: All API URLs managed in one place
2. **Environment Flexibility**: Easy switching between mock and production APIs
3. **Maintainability**: Single point of change for API base URLs
4. **Type Safety**: TypeScript ensures correct endpoint names