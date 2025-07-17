# Project Structure

## Root Level
- `src/` - Main application source code
- `android/` - Android-specific native code and configuration
- `ios/` - iOS-specific native code and configuration
- `__tests__/` - Test files
- `docs/` - Documentation and assets
- `patches/` - NPM package patches applied via patch-package
- `vendor/` - Third-party dependencies

## Source Code Organization (`src/`)

### Core Application
- `src/index.js` - Main app entry point with Redux provider and navigation
- `src/navigation/` - Navigation configuration and routing
  - `index.js` - Main navigator setup
  - `NavigationKeys.js` - Navigation key constants
  - `NavigationRoutes.js` - Route definitions
  - `Type/` - Navigation type definitions

### Feature Organization
- `src/containers/` - Screen-level components
  - `auth/` - Authentication screens
  - `tabbar/` - Tab navigation screens
  - `OnBoarding.js` - App onboarding flow

- `src/components/` - Reusable UI components
  - `common/` - Shared components (CSafeAreaView, etc.)
  - `models/` - Modal components
  - Individual feature components (Charts, Search, News, etc.)

### State Management
- `src/redux/` - Redux store configuration
  - `store/` - Store setup and configuration
  - `action/` - Action creators
  - `reducer/` - Reducers
  - `types/` - Action type constants

### Styling & Theming
- `src/themes/` - Centralized styling system
  - `index.js` - Main theme exports
  - `colors.js` - Color palette
  - `typography.js` - Text styles
  - `commonStyle.js` - Shared styles
  - `flex.js`, `margin.js`, `padding.js` - Layout utilities

### Supporting Modules
- `src/api/` - API configuration and constants
- `src/utils/` - Utility functions
  - `helpers.js` - General helper functions
  - `validators.js` - Form validation utilities
  - `asyncstorage.js` - Local storage helpers
- `src/i18n/` - Internationalization
  - `strings.js` - String management
  - `en.js` - English translations
- `src/common/` - Shared constants and configurations
- `src/assets/` - Static assets
  - `images/` - Image files
  - `svgs/` - SVG icons (imported as React components)
  - `fonts/` - Custom fonts

## Architecture Patterns
- **Container/Component Pattern**: Screens in `containers/`, reusable UI in `components/`
- **Feature-based Organization**: Components grouped by functionality
- **Centralized Theming**: All styles managed through theme system
- **Redux Architecture**: Actions, reducers, and store separated
- **Asset Management**: SVGs as components, images and fonts organized by type

## File Naming Conventions
- PascalCase for React components
- camelCase for utility files and non-component modules
- Descriptive names indicating component purpose (e.g., `StockDetailComponent.js`)
- Navigation files prefixed with "Navigation"