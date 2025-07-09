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
    
    // First, sign out any existing user
    await supabase.auth.signOut();
    
    // Sign in as test user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: TEST_USER_DATA.email,
      password: TEST_USER_DATA.password
    });

    if (authError) {
      // If test user doesn't exist, create it
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: TEST_USER_DATA.email,
        password: TEST_USER_DATA.password,
        options: {
          data: {
            username: TEST_USER_DATA.username
          }
        }
      });

      if (signUpError) {
        console.error('Failed to create test user:', signUpError);
        return false;
      }

      if (!signUpData.user) {
        console.error('No user data returned from signup');
        return false;
      }

      console.log('Created test user:', signUpData.user.id);
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error('No active session after authentication');
      return false;
    }

    const testUserId = session.user.id;
    console.log('Using test user ID:', testUserId);

    // Check if template nations already exist
    const { data: existingNations, error: checkError } = await supabase
      .from('saved_nations')
      .select('name')
      .eq('user_id', testUserId)
      .in('name', TEMPLATE_NATIONS.map(n => n.name));

    if (checkError) {
      console.error('Error checking existing nations:', checkError);
      return false;
    }

    const existingNames = new Set(existingNations?.map(n => n.name) || []);
    const nationsToCreate = TEMPLATE_NATIONS.filter(nation => !existingNames.has(nation.name));

    if (nationsToCreate.length === 0) {
      console.log('All template nations already exist');
      return true;
    }

    console.log(`Creating ${nationsToCreate.length} template nations...`);

    // Insert template nations
    const insertData = nationsToCreate.map(nation => ({
      name: nation.name,
      user_id: testUserId,
      assessment_data: nation.assessmentData,
      custom_policies: nation.customPolicies,
      is_temporary: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data: insertedNations, error: insertError } = await supabase
      .from('saved_nations')
      .insert(insertData)
      .select();

    if (insertError) {
      console.error('Error inserting template nations:', insertError);
      return false;
    }

    console.log(`Successfully created ${insertedNations?.length || 0} template nations`);
    
    // Sign out test user
    await supabase.auth.signOut();
    
    return true;
  } catch (error) {
    console.error('Error populating template nations:', error);
    return false;
  }
};

// Auto-populate on module load (only in development)
if (import.meta.env.DEV) {
  // Small delay to ensure Supabase is initialized
  setTimeout(() => {
    populateTemplateNations().then(success => {
      if (success) {
        console.log('Template nations populated successfully');
      } else {
        console.log('Failed to populate template nations');
      }
    });
  }, 2000);
}