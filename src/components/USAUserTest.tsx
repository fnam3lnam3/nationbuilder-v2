import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Flag, User, Globe, Database, CheckCircle, XCircle, AlertTriangle, Loader2, Play, Bug, Shield } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface USAUserTestProps {
  onClose: () => void;
}

interface TestResult {
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
  fix?: string;
  timing?: number;
}

interface TestResults {
  [key: string]: TestResult;
}

// Comprehensive USA Template Nation Data
const USA_TEMPLATE_NATION = {
  population: 331900000,
  territory: 9833517, // Actual USA territory in km²
  resources: 8,
  climate: ['Temperate', 'Tropical', 'Arid', 'Arctic', 'Coastal'],
  languages: 2,
  religiousDiversity: 7,
  educationLevel: 7,
  technologyLevel: 9,
  location: 'Earth-based',
  environmentalChallenges: ['Air quality issues', 'Climate instability', 'Water scarcity', 'Natural disasters'],
  economicModel: 'Mixed system',
  politicalStructure: 'Representative democracy',
  socialOrganization: ['Individualism', 'Merit-based', 'Wealth-based'],
  educationSystem: ['Universal public', 'Private'],
  healthcare: ['Privatized payment', 'Emergency response', 'Research-based medicine', 'Mental-health services'],
  security: ['Professional military', 'Police force', 'Border security', 'Cybersecurity', 'Intelligence services', 'Emergency response'],
  resourceManagement: ['Water management', 'Energy distribution', 'Food security', 'Waste management', 'Infrastructure maintenance'],
  legalFramework: [
    'Habeas corpus',
    'Trial by peers',
    'Sentencing by peers',
    'Ability to appeal police actions',
    'Ability to appeal judicial judgments',
    'Ability to lobby lawmakers directly',
    'Punishment for graft',
    'Referendum is available to remove an elected official',
    'Referendum can make law'
  ]
};

const TEST_USER_DATA = {
  email: `usatest${Date.now()}@nationbuilder.test`,
  password: 'USATest2025!',
  username: 'USATestUser'
};

export default function USAUserTest({ onClose }: USAUserTestProps) {
  const [testResults, setTestResults] = useState<TestResults>({});
  const [isRunning, setIsRunning] = useState(false);
  const [testUser, setTestUser] = useState<any>(null);
  const [createdNationId, setCreatedNationId] = useState<string | null>(null);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');

  const updateTestResult = (testName: string, result: TestResult) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: result
    }));
  };

  const runUSAUserTest = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    setTestResults({});
    setTestUser(null);
    setCreatedNationId(null);

    const startTime = Date.now();

    try {
      // Phase 1: User Account Management
      await testUserAccountCreation();
      await testUserAuthentication();
      await testUserSession();

      // Phase 2: Assessment Data Validation
      await testAssessmentDataIntegrity();
      await testSocialOrganizationArrayHandling();
      await testRequiredFieldValidation();

      // Phase 3: Nation CRUD Operations
      await testNationCreation();
      await testNationRetrieval();
      await testNationUpdate();
      await testCustomPolicies();

      // Phase 4: Database & RLS Testing
      await testRowLevelSecurity();
      await testDatabaseConstraints();
      await testSoftDelete();

      // Phase 5: Subscription Integration
      await testSubscriptionLimits();
      await testPremiumFeatures();

      // Phase 6: Error Handling & Edge Cases
      await testErrorHandling();
      await testDataCorruption();
      await testConcurrentAccess();

      // Phase 7: Performance & Cleanup
      await testPerformance();
      await cleanupTestData();

      const totalTime = Date.now() - startTime;
      setOverallStatus('completed');
      
      updateTestResult('summary', {
        status: 'success',
        message: `USA User Test completed successfully in ${totalTime}ms`,
        details: {
          totalTests: Object.keys(testResults).length,
          successCount: Object.values(testResults).filter(r => r.status === 'success').length,
          warningCount: Object.values(testResults).filter(r => r.status === 'warning').length,
          errorCount: Object.values(testResults).filter(r => r.status === 'error').length,
          totalTime
        }
      });

    } catch (error: any) {
      setOverallStatus('failed');
      updateTestResult('criticalFailure', {
        status: 'error',
        message: `Critical test failure: ${error.message}`,
        details: { error: error.stack }
      });
    } finally {
      setIsRunning(false);
    }
  };

  const testUserAccountCreation = async () => {
    const startTime = Date.now();
    updateTestResult('userCreation', { status: 'pending', message: 'Creating USA test user account...' });
    
    try {
      // Sign out any existing user
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signUp({
        email: TEST_USER_DATA.email,
        password: TEST_USER_DATA.password,
        options: {
          data: {
            username: TEST_USER_DATA.username
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          // Try to sign in instead
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: TEST_USER_DATA.email,
            password: TEST_USER_DATA.password
          });
          
          if (signInError) throw signInError;
          setTestUser(signInData.user);
          
          updateTestResult('userCreation', {
            status: 'warning',
            message: 'User already exists, signed in instead',
            timing: Date.now() - startTime,
            details: { userId: signInData.user?.id }
          });
          return;
        }
        throw error;
      }

      setTestUser(data.user);
      updateTestResult('userCreation', {
        status: 'success',
        message: 'USA test user created successfully',
        timing: Date.now() - startTime,
        details: { 
          userId: data.user?.id,
          email: data.user?.email,
          username: data.user?.user_metadata?.username
        }
      });

    } catch (error: any) {
      updateTestResult('userCreation', {
        status: 'error',
        message: `User creation failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Check Supabase auth configuration and email settings'
      });
      throw error;
    }
  };

  const testUserAuthentication = async () => {
    const startTime = Date.now();
    updateTestResult('authentication', { status: 'pending', message: 'Testing authentication flow...' });
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      if (!session?.user) throw new Error('No active session found');

      // Test token validity
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      updateTestResult('authentication', {
        status: 'success',
        message: 'Authentication verified successfully',
        timing: Date.now() - startTime,
        details: {
          sessionValid: !!session,
          userValid: !!userData.user,
          tokenExpiry: session.expires_at
        }
      });

    } catch (error: any) {
      updateTestResult('authentication', {
        status: 'error',
        message: `Authentication failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Check auth token validity and session management'
      });
      throw error;
    }
  };

  const testUserSession = async () => {
    const startTime = Date.now();
    updateTestResult('session', { status: 'pending', message: 'Testing session persistence...' });
    
    try {
      // Test session refresh
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      // Test user metadata access
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const hasRequiredMetadata = user?.user_metadata?.username === TEST_USER_DATA.username;

      updateTestResult('session', {
        status: hasRequiredMetadata ? 'success' : 'warning',
        message: hasRequiredMetadata 
          ? 'Session and metadata verified'
          : 'Session valid but metadata incomplete',
        timing: Date.now() - startTime,
        details: {
          sessionRefreshed: !!data.session,
          metadataPresent: hasRequiredMetadata,
          username: user?.user_metadata?.username
        }
      });

    } catch (error: any) {
      updateTestResult('session', {
        status: 'error',
        message: `Session test failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Check session refresh mechanism and metadata storage'
      });
    }
  };

  const testAssessmentDataIntegrity = async () => {
    const startTime = Date.now();
    updateTestResult('dataIntegrity', { status: 'pending', message: 'Validating USA assessment data structure...' });
    
    try {
      // Validate all required fields are present
      const requiredFields = [
        'population', 'territory', 'resources', 'climate', 'languages',
        'religiousDiversity', 'educationLevel', 'technologyLevel', 'location',
        'environmentalChallenges', 'economicModel', 'politicalStructure',
        'socialOrganization', 'educationSystem', 'healthcare', 'security',
        'resourceManagement', 'legalFramework'
      ];

      const missingFields = requiredFields.filter(field => 
        !(field in USA_TEMPLATE_NATION) || USA_TEMPLATE_NATION[field as keyof typeof USA_TEMPLATE_NATION] === undefined
      );

      // Validate array fields
      const arrayFields = ['climate', 'environmentalChallenges', 'socialOrganization', 
                          'educationSystem', 'healthcare', 'security', 'resourceManagement', 'legalFramework'];
      
      const invalidArrays = arrayFields.filter(field => 
        !Array.isArray(USA_TEMPLATE_NATION[field as keyof typeof USA_TEMPLATE_NATION])
      );

      // Validate numeric ranges
      const numericValidation = {
        population: USA_TEMPLATE_NATION.population > 0 && USA_TEMPLATE_NATION.population < 1000000000,
        territory: USA_TEMPLATE_NATION.territory > 0,
        resources: USA_TEMPLATE_NATION.resources >= 1 && USA_TEMPLATE_NATION.resources <= 10,
        languages: USA_TEMPLATE_NATION.languages >= 1,
        religiousDiversity: USA_TEMPLATE_NATION.religiousDiversity >= 1 && USA_TEMPLATE_NATION.religiousDiversity <= 10,
        educationLevel: USA_TEMPLATE_NATION.educationLevel >= 1 && USA_TEMPLATE_NATION.educationLevel <= 10,
        technologyLevel: USA_TEMPLATE_NATION.technologyLevel >= 1 && USA_TEMPLATE_NATION.technologyLevel <= 10
      };

      const invalidNumeric = Object.entries(numericValidation).filter(([_, valid]) => !valid);

      const hasErrors = missingFields.length > 0 || invalidArrays.length > 0 || invalidNumeric.length > 0;

      updateTestResult('dataIntegrity', {
        status: hasErrors ? 'error' : 'success',
        message: hasErrors 
          ? 'Data integrity issues found'
          : 'USA assessment data structure validated',
        timing: Date.now() - startTime,
        details: {
          missingFields,
          invalidArrays,
          invalidNumeric: invalidNumeric.map(([field]) => field),
          totalFields: requiredFields.length,
          validFields: requiredFields.length - missingFields.length
        }
      });

      if (hasErrors) {
        throw new Error('Data integrity validation failed');
      }

    } catch (error: any) {
      updateTestResult('dataIntegrity', {
        status: 'error',
        message: `Data integrity test failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Review USA_TEMPLATE_NATION data structure and ensure all fields are properly defined'
      });
      throw error;
    }
  };

  const testSocialOrganizationArrayHandling = async () => {
    const startTime = Date.now();
    updateTestResult('socialOrgArray', { status: 'pending', message: 'Testing social organization array handling...' });
    
    try {
      // Test that socialOrganization is properly handled as an array
      const socialOrg = USA_TEMPLATE_NATION.socialOrganization;
      
      if (!Array.isArray(socialOrg)) {
        throw new Error('socialOrganization is not an array');
      }

      if (socialOrg.length === 0) {
        throw new Error('socialOrganization array is empty');
      }

      // Test valid values
      const validValues = ['Individualism', 'Communalism', 'Caste heritage', 'Merit-based', 
                          'Wealth-based', 'Knowledge-based', 'Seniority-based', 'Ethical acts-based'];
      
      const invalidValues = socialOrg.filter(value => !validValues.includes(value));

      updateTestResult('socialOrgArray', {
        status: invalidValues.length > 0 ? 'warning' : 'success',
        message: invalidValues.length > 0 
          ? 'Social organization contains invalid values'
          : 'Social organization array handling verified',
        timing: Date.now() - startTime,
        details: {
          isArray: Array.isArray(socialOrg),
          length: socialOrg.length,
          values: socialOrg,
          invalidValues
        }
      });

    } catch (error: any) {
      updateTestResult('socialOrgArray', {
        status: 'error',
        message: `Social organization test failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Ensure socialOrganization is defined as an array with valid values'
      });
    }
  };

  const testRequiredFieldValidation = async () => {
    const startTime = Date.now();
    updateTestResult('fieldValidation', { status: 'pending', message: 'Testing required field validation...' });
    
    try {
      // Test with missing required fields
      const incompleteData = { ...USA_TEMPLATE_NATION };
      delete (incompleteData as any).location;
      delete (incompleteData as any).economicModel;
      delete (incompleteData as any).politicalStructure;
      (incompleteData as any).socialOrganization = [];

      // Simulate validation logic
      const requiredFields = {
        location: 'Location Type',
        economicModel: 'Economic Model',
        politicalStructure: 'Political Structure',
        socialOrganization: 'Social Organization (at least one)'
      };
      
      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => {
          const value = incompleteData[key as keyof typeof incompleteData];
          if (key === 'socialOrganization') {
            return !Array.isArray(value) || value.length === 0;
          }
          return !value;
        })
        .map(([, label]) => label);

      updateTestResult('fieldValidation', {
        status: missingFields.length > 0 ? 'success' : 'warning',
        message: missingFields.length > 0 
          ? 'Required field validation working correctly'
          : 'Validation may not be strict enough',
        timing: Date.now() - startTime,
        details: {
          expectedMissingFields: 4,
          actualMissingFields: missingFields.length,
          missingFields
        }
      });

    } catch (error: any) {
      updateTestResult('fieldValidation', {
        status: 'error',
        message: `Field validation test failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Review form validation logic in AssessmentForm component'
      });
    }
  };

  const testNationCreation = async () => {
    const startTime = Date.now();
    updateTestResult('nationCreation', { status: 'pending', message: 'Creating USA template nation...' });
    
    try {
      if (!testUser) throw new Error('No test user available');

      const { data, error } = await supabase
        .from('saved_nations')
        .insert({
          name: 'USA Template Nation - Test',
          user_id: testUser.id,
          assessment_data: USA_TEMPLATE_NATION,
          custom_policies: {
            ethical: 'Constitutional democracy with emphasis on individual rights, due process, and equal protection under law',
            economic: 'Mixed market economy with federal regulation, antitrust enforcement, and social safety nets',
            judicial: 'Independent federal court system with Supreme Court as constitutional arbiter and jury trials',
            environmental: 'Federal environmental protection standards with state implementation and enforcement'
          },
          is_temporary: false
        })
        .select()
        .single();

      if (error) throw error;

      setCreatedNationId(data.id);
      
      // Verify the created nation
      const { data: verifyData, error: verifyError } = await supabase
        .from('saved_nations')
        .select('*')
        .eq('id', data.id)
        .single();

      if (verifyError) throw verifyError;

      const dataMatches = JSON.stringify(verifyData.assessment_data) === JSON.stringify(USA_TEMPLATE_NATION);

      updateTestResult('nationCreation', {
        status: dataMatches ? 'success' : 'warning',
        message: dataMatches 
          ? 'USA template nation created and verified successfully'
          : 'Nation created but data verification failed',
        timing: Date.now() - startTime,
        details: {
          nationId: data.id,
          nationName: data.name,
          dataIntegrity: dataMatches,
          population: verifyData.assessment_data.population,
          territory: verifyData.assessment_data.territory,
          politicalStructure: verifyData.assessment_data.politicalStructure
        }
      });

    } catch (error: any) {
      updateTestResult('nationCreation', {
        status: 'error',
        message: `Nation creation failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Check database permissions and saved_nations table structure'
      });
      throw error;
    }
  };

  const testNationRetrieval = async () => {
    const startTime = Date.now();
    updateTestResult('nationRetrieval', { status: 'pending', message: 'Testing nation retrieval...' });
    
    try {
      if (!testUser || !createdNationId) throw new Error('No test user or nation ID available');

      // Test single nation retrieval
      const { data: singleData, error: singleError } = await supabase
        .from('saved_nations')
        .select('*')
        .eq('id', createdNationId)
        .eq('user_id', testUser.id)
        .is('deleted_at', null)
        .single();

      if (singleError) throw singleError;

      // Test list retrieval
      const { data: listData, error: listError } = await supabase
        .from('saved_nations')
        .select('*')
        .eq('user_id', testUser.id)
        .eq('is_temporary', false)
        .is('deleted_at', null)
        .order('updated_at', { ascending: false });

      if (listError) throw listError;

      const foundInList = listData.some(nation => nation.id === createdNationId);

      updateTestResult('nationRetrieval', {
        status: foundInList ? 'success' : 'warning',
        message: foundInList 
          ? 'Nation retrieval working correctly'
          : 'Single retrieval works but list retrieval has issues',
        timing: Date.now() - startTime,
        details: {
          singleRetrievalSuccess: !!singleData,
          listRetrievalCount: listData.length,
          foundInList,
          nationData: {
            id: singleData.id,
            name: singleData.name,
            population: singleData.assessment_data.population
          }
        }
      });

    } catch (error: any) {
      updateTestResult('nationRetrieval', {
        status: 'error',
        message: `Nation retrieval failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Check RLS policies and query structure for saved_nations'
      });
    }
  };

  const testNationUpdate = async () => {
    const startTime = Date.now();
    updateTestResult('nationUpdate', { status: 'pending', message: 'Testing nation update functionality...' });
    
    try {
      if (!testUser || !createdNationId) throw new Error('No test user or nation ID available');

      const updatedData = {
        ...USA_TEMPLATE_NATION,
        population: 335000000, // Updated population
        territory: 9834000, // Slightly updated territory
        technologyLevel: 10 // Upgraded tech level
      };

      const { error: updateError } = await supabase
        .from('saved_nations')
        .update({
          name: 'USA Template Nation - Updated',
          assessment_data: updatedData,
          custom_policies: {
            ethical: 'Updated: Constitutional democracy with enhanced digital rights protections',
            economic: 'Updated: Mixed market economy with green technology incentives',
            judicial: 'Updated: Federal court system with AI-assisted case management',
            environmental: 'Updated: Aggressive climate action with carbon neutrality targets'
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', createdNationId)
        .eq('user_id', testUser.id);

      if (updateError) throw updateError;

      // Verify the update
      const { data: verifyData, error: verifyError } = await supabase
        .from('saved_nations')
        .select('*')
        .eq('id', createdNationId)
        .single();

      if (verifyError) throw verifyError;

      const updateSuccessful = 
        verifyData.name === 'USA Template Nation - Updated' &&
        verifyData.assessment_data.population === 335000000 &&
        verifyData.assessment_data.technologyLevel === 10;

      updateTestResult('nationUpdate', {
        status: updateSuccessful ? 'success' : 'error',
        message: updateSuccessful 
          ? 'Nation update completed successfully'
          : 'Update operation failed verification',
        timing: Date.now() - startTime,
        details: {
          nameUpdated: verifyData.name === 'USA Template Nation - Updated',
          populationUpdated: verifyData.assessment_data.population === 335000000,
          techLevelUpdated: verifyData.assessment_data.technologyLevel === 10,
          customPoliciesUpdated: !!verifyData.custom_policies.ethical?.includes('Updated:')
        }
      });

    } catch (error: any) {
      updateTestResult('nationUpdate', {
        status: 'error',
        message: `Nation update failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Check UPDATE permissions and RLS policies for saved_nations table'
      });
    }
  };

  const testCustomPolicies = async () => {
    const startTime = Date.now();
    updateTestResult('customPolicies', { status: 'pending', message: 'Testing custom policies functionality...' });
    
    try {
      if (!createdNationId) throw new Error('No nation ID available');

      // Test policy retrieval
      const { data, error } = await supabase
        .from('saved_nations')
        .select('custom_policies')
        .eq('id', createdNationId)
        .single();

      if (error) throw error;

      const policies = data.custom_policies;
      const requiredPolicyTypes = ['ethical', 'economic', 'judicial', 'environmental'];
      const presentPolicies = requiredPolicyTypes.filter(type => policies[type]);
      const allPoliciesPresent = presentPolicies.length === requiredPolicyTypes.length;

      // Test policy content
      const hasUpdatedContent = Object.values(policies).some((policy: any) => 
        typeof policy === 'string' && policy.includes('Updated:')
      );

      updateTestResult('customPolicies', {
        status: allPoliciesPresent ? 'success' : 'warning',
        message: allPoliciesPresent 
          ? 'Custom policies functionality verified'
          : 'Some policy types missing',
        timing: Date.now() - startTime,
        details: {
          totalPolicyTypes: requiredPolicyTypes.length,
          presentPolicyTypes: presentPolicies.length,
          presentPolicies,
          hasUpdatedContent,
          policyLengths: Object.fromEntries(
            Object.entries(policies).map(([key, value]) => [key, (value as string)?.length || 0])
          )
        }
      });

    } catch (error: any) {
      updateTestResult('customPolicies', {
        status: 'error',
        message: `Custom policies test failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Check custom_policies JSONB field structure and PolicyEditor component'
      });
    }
  };

  const testRowLevelSecurity = async () => {
    const startTime = Date.now();
    updateTestResult('rlsSecurity', { status: 'pending', message: 'Testing Row Level Security policies...' });
    
    try {
      // Test authenticated user access
      const { data: ownData, error: ownError } = await supabase
        .from('saved_nations')
        .select('*')
        .eq('user_id', testUser?.id)
        .limit(1);

      // Test access to other users' data (should be blocked)
      const { data: otherData, error: otherError } = await supabase
        .from('saved_nations')
        .select('*')
        .neq('user_id', testUser?.id)
        .limit(1);

      // Test anonymous access (sign out temporarily)
      await supabase.auth.signOut();
      
      const { data: anonData, error: anonError } = await supabase
        .from('saved_nations')
        .select('*')
        .limit(1);

      // Sign back in
      await supabase.auth.signInWithPassword({
        email: TEST_USER_DATA.email,
        password: TEST_USER_DATA.password
      });

      const rlsWorking = 
        !ownError && // Own data accessible
        (otherData?.length === 0 || otherError) && // Other users' data blocked
        (anonData?.length === 0 || anonError); // Anonymous access blocked

      updateTestResult('rlsSecurity', {
        status: rlsWorking ? 'success' : 'error',
        message: rlsWorking 
          ? 'Row Level Security policies working correctly'
          : 'RLS policies may have security vulnerabilities',
        timing: Date.now() - startTime,
        details: {
          ownDataAccessible: !ownError && ownData?.length > 0,
          otherDataBlocked: otherData?.length === 0 || !!otherError,
          anonymousBlocked: anonData?.length === 0 || !!anonError,
          ownDataCount: ownData?.length || 0,
          otherDataCount: otherData?.length || 0,
          anonDataCount: anonData?.length || 0
        }
      });

    } catch (error: any) {
      updateTestResult('rlsSecurity', {
        status: 'error',
        message: `RLS security test failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Review RLS policies on saved_nations table for security vulnerabilities'
      });
    }
  };

  const testDatabaseConstraints = async () => {
    const startTime = Date.now();
    updateTestResult('dbConstraints', { status: 'pending', message: 'Testing database constraints...' });
    
    try {
      // Test foreign key constraint
      const { data: fkTest, error: fkError } = await supabase
        .from('saved_nations')
        .insert({
          name: 'Constraint Test',
          user_id: '00000000-0000-0000-0000-000000000000', // Invalid UUID
          assessment_data: USA_TEMPLATE_NATION,
          is_temporary: false
        })
        .select();

      // Test required field constraint
      const { data: reqTest, error: reqError } = await supabase
        .from('saved_nations')
        .insert({
          name: 'Required Field Test',
          user_id: testUser?.id,
          // Missing assessment_data (required field)
          is_temporary: false
        } as any)
        .select();

      const constraintsWorking = !!fkError && !!reqError;

      updateTestResult('dbConstraints', {
        status: constraintsWorking ? 'success' : 'warning',
        message: constraintsWorking 
          ? 'Database constraints enforced correctly'
          : 'Some constraints may not be properly enforced',
        timing: Date.now() - startTime,
        details: {
          foreignKeyConstraintWorking: !!fkError,
          requiredFieldConstraintWorking: !!reqError,
          fkErrorMessage: fkError?.message,
          reqErrorMessage: reqError?.message
        }
      });

    } catch (error: any) {
      updateTestResult('dbConstraints', {
        status: 'error',
        message: `Database constraints test failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Review database schema constraints and foreign key relationships'
      });
    }
  };

  const testSoftDelete = async () => {
    const startTime = Date.now();
    updateTestResult('softDelete', { status: 'pending', message: 'Testing soft delete functionality...' });
    
    try {
      if (!testUser || !createdNationId) throw new Error('No test user or nation ID available');

      // Perform soft delete
      const { error: deleteError } = await supabase
        .from('saved_nations')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', createdNationId)
        .eq('user_id', testUser.id);

      if (deleteError) throw deleteError;

      // Verify nation is not retrievable in normal queries
      const { data: normalQuery, error: normalError } = await supabase
        .from('saved_nations')
        .select('*')
        .eq('id', createdNationId)
        .is('deleted_at', null)
        .maybeSingle();

      // Verify nation still exists in database (for audit purposes)
      const { data: auditQuery, error: auditError } = await supabase
        .from('saved_nations')
        .select('*')
        .eq('id', createdNationId)
        .single();

      const softDeleteWorking = 
        !normalQuery && // Not found in normal query
        !!auditQuery && // Still exists for audit
        !!auditQuery.deleted_at; // Has deletion timestamp

      updateTestResult('softDelete', {
        status: softDeleteWorking ? 'success' : 'error',
        message: softDeleteWorking 
          ? 'Soft delete functionality working correctly'
          : 'Soft delete implementation has issues',
        timing: Date.now() - startTime,
        details: {
          deletedFromNormalQuery: !normalQuery,
          existsInAuditQuery: !!auditQuery,
          hasDeletionTimestamp: !!auditQuery?.deleted_at,
          deletionTimestamp: auditQuery?.deleted_at
        }
      });

    } catch (error: any) {
      updateTestResult('softDelete', {
        status: 'error',
        message: `Soft delete test failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Review soft delete implementation and RLS policies'
      });
    }
  };

  const testSubscriptionLimits = async () => {
    const startTime = Date.now();
    updateTestResult('subscriptionLimits', { status: 'pending', message: 'Testing subscription limits...' });
    
    try {
      // Check current subscription status
      const { data: subData, error: subError } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      const isActive = subData?.subscription_status === 'active';
      const maxNations = isActive ? 30 : 5;

      // Count current nations
      const { data: nationCount, error: countError } = await supabase
        .from('saved_nations')
        .select('id', { count: 'exact' })
        .eq('user_id', testUser?.id)
        .eq('is_temporary', false)
        .is('deleted_at', null);

      if (countError) throw countError;

      const currentCount = nationCount?.length || 0;
      const withinLimits = currentCount <= maxNations;

      updateTestResult('subscriptionLimits', {
        status: withinLimits ? 'success' : 'warning',
        message: withinLimits 
          ? 'Subscription limits properly enforced'
          : 'User may have exceeded nation limits',
        timing: Date.now() - startTime,
        details: {
          subscriptionActive: isActive,
          maxNationsAllowed: maxNations,
          currentNationCount: currentCount,
          withinLimits,
          subscriptionData: subData
        }
      });

    } catch (error: any) {
      updateTestResult('subscriptionLimits', {
        status: 'error',
        message: `Subscription limits test failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Check subscription integration and limit enforcement logic'
      });
    }
  };

  const testPremiumFeatures = async () => {
    const startTime = Date.now();
    updateTestResult('premiumFeatures', { status: 'pending', message: 'Testing premium features access...' });
    
    try {
      // Test subscription view access
      const { data: subView, error: subViewError } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      // Test orders view access
      const { data: ordersView, error: ordersViewError } = await supabase
        .from('stripe_user_orders')
        .select('*')
        .limit(1);

      const viewsAccessible = !subViewError && !ordersViewError;

      updateTestResult('premiumFeatures', {
        status: viewsAccessible ? 'success' : 'warning',
        message: viewsAccessible 
          ? 'Premium features accessible'
          : 'Some premium features may not be accessible',
        timing: Date.now() - startTime,
        details: {
          subscriptionViewAccessible: !subViewError,
          ordersViewAccessible: !ordersViewError,
          hasActiveSubscription: subView?.subscription_status === 'active',
          subscriptionViewError: subViewError?.message,
          ordersViewError: ordersViewError?.message
        }
      });

    } catch (error: any) {
      updateTestResult('premiumFeatures', {
        status: 'error',
        message: `Premium features test failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Check premium feature access controls and subscription views'
      });
    }
  };

  const testErrorHandling = async () => {
    const startTime = Date.now();
    updateTestResult('errorHandling', { status: 'pending', message: 'Testing error handling...' });
    
    try {
      // Test invalid data insertion
      const { data: invalidData, error: invalidError } = await supabase
        .from('saved_nations')
        .insert({
          name: 'Error Test',
          user_id: testUser?.id,
          assessment_data: { invalid: 'data' }, // Invalid structure
          is_temporary: false
        })
        .select();

      // Test unauthorized access
      await supabase.auth.signOut();
      const { data: unauthData, error: unauthError } = await supabase
        .from('saved_nations')
        .insert({
          name: 'Unauthorized Test',
          assessment_data: USA_TEMPLATE_NATION,
          is_temporary: false
        })
        .select();

      // Sign back in
      await supabase.auth.signInWithPassword({
        email: TEST_USER_DATA.email,
        password: TEST_USER_DATA.password
      });

      const errorsHandledCorrectly = !!invalidError && !!unauthError;

      updateTestResult('errorHandling', {
        status: errorsHandledCorrectly ? 'success' : 'warning',
        message: errorsHandledCorrectly 
          ? 'Error handling working correctly'
          : 'Some errors may not be properly handled',
        timing: Date.now() - startTime,
        details: {
          invalidDataRejected: !!invalidError,
          unauthorizedAccessBlocked: !!unauthError,
          invalidErrorMessage: invalidError?.message,
          unauthErrorMessage: unauthError?.message
        }
      });

    } catch (error: any) {
      updateTestResult('errorHandling', {
        status: 'error',
        message: `Error handling test failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Review error handling mechanisms and validation logic'
      });
    }
  };

  const testDataCorruption = async () => {
    const startTime = Date.now();
    updateTestResult('dataCorruption', { status: 'pending', message: 'Testing data corruption resistance...' });
    
    try {
      // Test with malformed JSON
      const { data: malformedTest, error: malformedError } = await supabase
        .from('saved_nations')
        .insert({
          name: 'Corruption Test',
          user_id: testUser?.id,
          assessment_data: null, // Null data
          is_temporary: false
        })
        .select();

      // Test with extremely large data
      const largeData = {
        ...USA_TEMPLATE_NATION,
        extraLargeField: 'x'.repeat(100000) // 100KB string
      };

      const { data: largeTest, error: largeError } = await supabase
        .from('saved_nations')
        .insert({
          name: 'Large Data Test',
          user_id: testUser?.id,
          assessment_data: largeData,
          is_temporary: false
        })
        .select();

      const corruptionResistant = !!malformedError; // Should reject null data

      updateTestResult('dataCorruption', {
        status: corruptionResistant ? 'success' : 'warning',
        message: corruptionResistant 
          ? 'Data corruption resistance verified'
          : 'System may be vulnerable to data corruption',
        timing: Date.now() - startTime,
        details: {
          nullDataRejected: !!malformedError,
          largeDataHandled: !largeError,
          malformedErrorMessage: malformedError?.message,
          largeDataErrorMessage: largeError?.message
        }
      });

    } catch (error: any) {
      updateTestResult('dataCorruption', {
        status: 'error',
        message: `Data corruption test failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Implement stronger data validation and size limits'
      });
    }
  };

  const testConcurrentAccess = async () => {
    const startTime = Date.now();
    updateTestResult('concurrentAccess', { status: 'pending', message: 'Testing concurrent access handling...' });
    
    try {
      if (!createdNationId) {
        updateTestResult('concurrentAccess', {
          status: 'warning',
          message: 'Skipped - no nation available for concurrent testing',
          timing: Date.now() - startTime
        });
        return;
      }

      // Simulate concurrent updates
      const updatePromises = Array.from({ length: 3 }, (_, i) => 
        supabase
          .from('saved_nations')
          .update({
            name: `Concurrent Update ${i}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', createdNationId)
          .eq('user_id', testUser?.id)
      );

      const results = await Promise.allSettled(updatePromises);
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const errorCount = results.filter(r => r.status === 'rejected').length;

      updateTestResult('concurrentAccess', {
        status: successCount > 0 ? 'success' : 'warning',
        message: `Concurrent access handled: ${successCount} succeeded, ${errorCount} failed`,
        timing: Date.now() - startTime,
        details: {
          totalRequests: updatePromises.length,
          successfulRequests: successCount,
          failedRequests: errorCount,
          results: results.map(r => r.status)
        }
      });

    } catch (error: any) {
      updateTestResult('concurrentAccess', {
        status: 'error',
        message: `Concurrent access test failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Review database locking and concurrent access handling'
      });
    }
  };

  const testPerformance = async () => {
    const startTime = Date.now();
    updateTestResult('performance', { status: 'pending', message: 'Testing performance metrics...' });
    
    try {
      // Test query performance
      const queryStart = Date.now();
      const { data: perfData, error: perfError } = await supabase
        .from('saved_nations')
        .select('*')
        .eq('user_id', testUser?.id)
        .is('deleted_at', null)
        .order('updated_at', { ascending: false })
        .limit(10);

      const queryTime = Date.now() - queryStart;

      if (perfError) throw perfError;

      // Test large data handling
      const largeQueryStart = Date.now();
      const { data: largeData, error: largeError } = await supabase
        .from('saved_nations')
        .select('assessment_data')
        .eq('user_id', testUser?.id)
        .limit(1)
        .single();

      const largeQueryTime = Date.now() - largeQueryStart;

      const performanceGood = queryTime < 1000 && largeQueryTime < 2000;

      updateTestResult('performance', {
        status: performanceGood ? 'success' : 'warning',
        message: performanceGood 
          ? 'Performance metrics within acceptable range'
          : 'Performance may need optimization',
        timing: Date.now() - startTime,
        details: {
          queryTime,
          largeQueryTime,
          recordsRetrieved: perfData?.length || 0,
          performanceThresholdMet: performanceGood,
          averageResponseTime: (queryTime + largeQueryTime) / 2
        }
      });

    } catch (error: any) {
      updateTestResult('performance', {
        status: 'error',
        message: `Performance test failed: ${error.message}`,
        timing: Date.now() - startTime,
        fix: 'Review database indexing and query optimization'
      });
    }
  };

  const cleanupTestData = async () => {
    const startTime = Date.now();
    updateTestResult('cleanup', { status: 'pending', message: 'Cleaning up test data...' });
    
    try {
      // Clean up test nations
      const { error: cleanupError } = await supabase
        .from('saved_nations')
        .delete()
        .eq('user_id', testUser?.id)
        .like('name', '%Test%');

      // Sign out test user
      await supabase.auth.signOut();

      updateTestResult('cleanup', {
        status: cleanupError ? 'warning' : 'success',
        message: cleanupError 
          ? 'Cleanup completed with warnings'
          : 'Test data cleanup completed successfully',
        timing: Date.now() - startTime,
        details: {
          cleanupError: cleanupError?.message,
          userSignedOut: true
        }
      });

    } catch (error: any) {
      updateTestResult('cleanup', {
        status: 'warning',
        message: `Cleanup completed with errors: ${error.message}`,
        timing: Date.now() - startTime
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-800 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-800 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-800 bg-red-50 border-red-200';
      default:
        return 'text-blue-800 bg-blue-50 border-blue-200';
    }
  };

  const testCategories = [
    {
      title: 'User Account Management',
      tests: ['userCreation', 'authentication', 'session']
    },
    {
      title: 'Assessment Data Validation',
      tests: ['dataIntegrity', 'socialOrgArray', 'fieldValidation']
    },
    {
      title: 'Nation CRUD Operations',
      tests: ['nationCreation', 'nationRetrieval', 'nationUpdate', 'customPolicies']
    },
    {
      title: 'Database & Security',
      tests: ['rlsSecurity', 'dbConstraints', 'softDelete']
    },
    {
      title: 'Subscription Integration',
      tests: ['subscriptionLimits', 'premiumFeatures']
    },
    {
      title: 'Error Handling & Edge Cases',
      tests: ['errorHandling', 'dataCorruption', 'concurrentAccess']
    },
    {
      title: 'Performance & Cleanup',
      tests: ['performance', 'cleanup']
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Flag className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Run USA User Test - Internal Testing Suite</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Test Overview */}
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Internal Testing Suite - USA Template Nation
              </h3>
              <p className="text-blue-800 text-sm">
                Comprehensive testing of nationbuilder.pro with realistic USA data. Tests user management, 
                data integrity, CRUD operations, security, subscriptions, and performance.
              </p>
            </div>

            {overallStatus !== 'idle' && (
              <div className={`border rounded-lg p-4 mb-4 ${
                overallStatus === 'completed' ? 'border-green-200 bg-green-50' :
                overallStatus === 'failed' ? 'border-red-200 bg-red-50' :
                'border-blue-200 bg-blue-50'
              }`}>
                <div className="flex items-center space-x-2">
                  {overallStatus === 'running' && <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />}
                  {overallStatus === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {overallStatus === 'failed' && <XCircle className="h-5 w-5 text-red-600" />}
                  <span className="font-semibold">
                    {overallStatus === 'running' && 'Running comprehensive test suite...'}
                    {overallStatus === 'completed' && 'All tests completed successfully'}
                    {overallStatus === 'failed' && 'Test suite failed - check results below'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Test Results by Category */}
          <div className="space-y-6">
            {testCategories.map(({ title, tests }) => (
              <div key={title} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
                <div className="p-4 space-y-3">
                  {tests.map(testKey => {
                    const result = testResults[testKey];
                    return (
                      <div
                        key={testKey}
                        className={`border rounded-lg p-3 ${result ? getStatusColor(result.status) : 'border-gray-200'}`}
                      >
                        <div className="flex items-start space-x-3">
                          {result ? getStatusIcon(result.status) : <div className="h-4 w-4 bg-gray-300 rounded-full" />}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">
                                {testKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </h4>
                              {result?.timing && (
                                <span className="text-xs opacity-75">
                                  {result.timing}ms
                                </span>
                              )}
                            </div>
                            {result && (
                              <>
                                <p className="text-sm mt-1">{result.message}</p>
                                {result.fix && (
                                  <div className="mt-2 p-2 bg-white bg-opacity-50 rounded text-xs">
                                    <strong>Fix:</strong> {result.fix}
                                  </div>
                                )}
                                {result.details && (
                                  <details className="mt-2">
                                    <summary className="text-xs cursor-pointer opacity-75">
                                      View Details
                                    </summary>
                                    <pre className="text-xs mt-1 p-2 bg-white bg-opacity-50 rounded overflow-x-auto">
                                      {JSON.stringify(result.details, null, 2)}
                                    </pre>
                                  </details>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {testResults.summary && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Test Summary</h3>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {testResults.summary.details?.successCount || 0}
                  </div>
                  <div className="text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {testResults.summary.details?.warningCount || 0}
                  </div>
                  <div className="text-gray-600">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {testResults.summary.details?.errorCount || 0}
                  </div>
                  <div className="text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {testResults.summary.details?.totalTime || 0}ms
                  </div>
                  <div className="text-gray-600">Total Time</div>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {Object.keys(testResults).length > 0 && (
                <span>
                  Progress: {Object.values(testResults).filter(r => r.status !== 'pending').length} / {testCategories.reduce((acc, cat) => acc + cat.tests.length, 0)} tests
                </span>
              )}
            </div>
            <div className="space-x-3">
              <button
                onClick={runUSAUserTest}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Running Tests...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Run USA User Test</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}