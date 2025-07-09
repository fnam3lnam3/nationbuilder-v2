import { createClient } from '@supabase/supabase-js';
import { TEMPLATE_NATIONS } from './templateNations';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Test user credentials from ServerStorageTest component
const TEST_USER_DATA = {
  email: 'testuser@nationbuilder.test',
  password: 'TestPassword123!',
  username: 'TestUser'
};

export const populateTemplateNations = async (): Promise<boolean> => {
  try {
    console.log('Starting template nations population...');
    
    // Skip template population in development to avoid authentication issues
    // This can be run manually when needed
    console.log('Template nation population skipped - run manually if needed');
    
    return true;
  } catch (error) {
    console.error('Error populating template nations:', error);
    return false;
  }
};

// Auto-populate on module load (only in development)
// Disabled auto-population to prevent authentication errors on page load
// if (import.meta.env.DEV) {
//   setTimeout(() => {
//     populateTemplateNations().then(success => {
//       if (success) {
//         console.log('Template nations populated successfully');
//       } else {
//         console.log('Failed to populate template nations');
//       }
//     });
//   }, 2000);
// }