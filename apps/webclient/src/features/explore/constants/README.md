# Explore Feature Constants

This directory contains all constants used throughout the explore feature, organized by concern.

## Structure

```
constants/
├── index.ts       # Barrel exports for clean imports
├── assets.ts      # Asset paths and asset-related utilities
├── pages.ts       # Page configurations (hero, layout, etc.)
├── styles.ts      # CSS classes, animations, component styles
└── README.md      # This file
```

## Usage

### Import specific constants:
```typescript
import { ASSET_PATHS } from '../constants/assets';
import { EXPLORE_PAGE_CONFIGS } from '../constants/pages';
import { LAYOUT_CLASSES } from '../constants/styles';
```

### Import from barrel export (recommended):
```typescript
import { ASSET_PATHS, EXPLORE_PAGE_CONFIGS, LAYOUT_CLASSES } from '../constants';
```

### Use helper functions:
```typescript
import { getPropertyImageByIndex } from '../constants';
const image = getPropertyImageByIndex(0); // Returns land-a.png path
```

## Benefits

1. **Separation of Concerns**: Assets, configs, and styles are separated
2. **Type Safety**: All constants are typed with `as const`
3. **Reusability**: Constants can be shared across components
4. **Maintainability**: Single source of truth for each concern
5. **Clean Imports**: Barrel exports provide clean import paths
6. **Documentation**: Each file is well-documented with JSDoc comments

## Adding New Constants

- **Asset paths** → `assets.ts`
- **Page configurations** → `pages.ts`  
- **CSS classes/styles** → `styles.ts`
- **Export in** → `index.ts` for barrel export