# Import Guidelines for Nationbuilder

## File Structure and Import Patterns

### Directory Structure
```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

### Import Patterns

#### ✅ Correct Import Patterns

**From App.tsx:**
```typescript
import SavedNations from './components/SavedNations';
import { useSavedNations } from './hooks/useSavedNations';
import { SavedNation } from './types';
```

**From components:**
```typescript
import { SavedNation } from '../types';
import { analytics } from '../utils/analytics';
```

**Using absolute imports (preferred):**
```typescript
import SavedNations from '@/components/SavedNations';
import { useSavedNations } from '@/hooks/useSavedNations';
import { SavedNation } from '@/types';
```

#### ❌ Incorrect Import Patterns

**Don't import from non-existent paths:**
```typescript
import SavedNations from './SavedNations'; // ❌ File doesn't exist
```

**Don't use inconsistent paths:**
```typescript
import SavedNations from '../SavedNations'; // ❌ Inconsistent with structure
```

### Component Organization

- **All React components** should be in `src/components/`
- **All custom hooks** should be in `src/hooks/`
- **All utility functions** should be in `src/utils/`
- **All type definitions** should be in `src/types/`

### ESLint Rules

The following ESLint rules are configured to enforce these patterns:

- `import/no-relative-parent-imports`: Prevents importing from parent directories
- `import/order`: Enforces consistent import ordering

### Path Mapping

TypeScript and Vite are configured with path mapping for cleaner imports:

- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/utils/*` → `src/utils/*`
- `@/types/*` → `src/types/*`
- `@/hooks/*` → `src/hooks/*`

### Best Practices

1. **Use absolute imports** when possible for better readability
2. **Group imports** by type (external, internal, relative)
3. **Keep components focused** - one component per file
4. **Use descriptive file names** that match component names
5. **Maintain consistent directory structure**

### Troubleshooting Import Issues

1. **Check file existence**: Ensure the file exists at the specified path
2. **Verify export/import syntax**: Ensure proper default/named exports
3. **Check TypeScript paths**: Verify path mapping configuration
4. **Run type checking**: Use `npm run build` to catch import errors
5. **Check ESLint**: Run linting to catch import rule violations

### Migration Notes

When moving files:
1. Update all import statements that reference the moved file
2. Search codebase for old import paths: `grep -r "old/path" src/`
3. Test the application after changes
4. Run build process to verify no broken imports