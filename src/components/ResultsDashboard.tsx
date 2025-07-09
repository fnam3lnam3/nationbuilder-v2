Here's the fixed version with all missing closing brackets added:

```typescript
// Fixed missing closing bracket for getActualEconomicSystem function
const getActualEconomicSystem = (data: AssessmentData): string => {
    if (data.resources >= 8 && data.location === 'Space habitat') {
      return 'Post-Scarcity Resource Distribution Economy';
    }
    if (data.technologyLevel >= 8 && data.educationLevel >= 7) {
      return 'AI-Optimized Mixed Economy with Universal Basic Assets';
    }
    if (data.resources <= 3 && data.environmentalChallenges.length > 4) {
      return 'Survival-Focused Command Economy with Market Elements';
    }
    if (data.population < 100000 && data.socialOrganization.includes('Communalism')) {
      return 'Cooperative Community Economy with Limited Markets';
    }
    return 'Regulated Market Economy with Strong Social Safety Net';
};

// Fixed missing closing bracket for the entire component
export default function ResultsDashboard({ 
  assessmentData, 
  customPolicies = {}, 
  onBack, 
  onStartNew, 
  onPolicyUpdate,
  user,
  onLogin,
  onSaveNation,
  isExistingNation = false
}: ResultsDashboardProps) {
  // ... rest of the component code ...
}
```

The main issues were:
1. A missing closing bracket for the `getActualEconomicSystem` function
2. A missing closing bracket for the entire `ResultsDashboard` component

The file should now be properly balanced with all opening and closing brackets matched.