import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Database, User, Globe, CheckCircle, XCircle, Loader2, Play, Trash2 } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface ServerStorageTestProps {
  onClose: () => void;
}

interface TestResult {
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  data?: any;
}

interface TestResults {
  [key: string]: TestResult;
}

// USA Template Nation Data
const USA_TEMPLATE_NATION = {
  population: 331000000,
  territory: 9150000,
  resources: 8,
  climate: ['Temperate', 'Tropical', 'Arid', 'Arctic', 'Coastal'],
  languages: 2,
  religiousDiversity: 7,
  educationLevel: 7,
  technologyLevel: 9,
  location: 'Earth-based',
  environmentalChallenges: ['Air quality issues', 'Climate instability', 'Water scarcity'],
  economicModel: 'Mixed system',
  politicalStructure: 'Representative democracy',
  socialOrganization: ['Individualism', 'Merit-based', 'Wealth-based'],
  educationSystem: ['Universal public', 'Private'],
  healthcare: ['Privatized payment', 'Emergency response', 'Research-based medicine'],
  security: ['Professional military', 'Police force', 'Border security', 'Cybersecurity', 'Intelligence services', 'Emergency response'],
  resourceManagement: ['Water management', 'Energy distribution', 'Food security', 'Infrastructure maintenance'],
  legalFramework: [
    'Habeas corpus',
    'Trial by peers',
    'Sentencing by peers',
    'Ability to appeal police actions',
    'Ability to appeal judicial judgments',
    'Ability to lobby lawmakers directly',
    'Punishment for graft',
    'Referendum is available to remove an elected official'
  ]
};

const TEST_USER_DATA = {
  email: 'testuser@nationbuilder.test',
  password: 'TestPassword123!',
  username: 'TestUser'
};

export default function ServerStorageTest({ onClose }: ServerStorageTestProps) {
  const [testResults, setTestResults] = useState<TestResults>({});
  const [isRunning, setIsRunning] = useState(false);
  const [testUser, setTestUser] = useState<any>(null);
  const [createdNationId, setCreatedNationId] = useState<string | null>(null);

  const updateTestResult = (testName: string, result: TestResult) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: result
    }));
  };

  const runCompleteTest = async () => {
    setIsRunning(true);
    setTestResults({});
    setTestUser(null);
    setCreatedNationId(null);

    try {
      // Test 1: Create Test User Account
      await createTestUser();
      
      // Test 2: Authenticate Test User
      await authenticateTestUser();
      
      // Test 3: Create USA Template Nation
      await createUSATemplateNation();
      
      // Test 4: Retrieve Saved Nation
      await retrieveSavedNation();
      
      // Test 5: Update Nation Data
      await updateNationData();
      
      // Test 6: Test Nation Deletion
      await testNationDeletion();
      
      // Test 7: Cleanup Test User
      await cleanupTestUser();
      
    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const createTestUser = async () => {
    updateTestResult('createUser', { status: 'pending', message: 'Creating test user account...' });
    
    try {
      // First, try to sign out any existing user
      await supabase.auth.signOut();
      
      // Create new test user
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
        // If user already exists, try to sign in instead
        if (error.message.includes('already registered')) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: TEST_USER_DATA.email,
            password: TEST_USER_DATA.password
          });
          
          if (signInError) throw signInError;
          
          setTestUser(signInData.user);
          updateTestResult('createUser', { 
            status: 'warning', 
            message: 'Test user already exists, signed in instead',
            data: { userId: signInData.user?.id }
          });
          return;
        }
        throw error;
      }

      setTestUser(data.user);
      updateTestResult('createUser', { 
        status: 'success', 
        message: 'Test user created successfully',
        data: { userId: data.user?.id }
      });
      
    } catch (error: any) {
      updateTestResult('createUser', { 
        status: 'error', 
        message: `Failed to create test user: ${error.message}` 
      });
      throw error;
    }
  };

  const authenticateTestUser = async () => {
    updateTestResult('authenticate', { status: 'pending', message: 'Verifying authentication...' });
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (!session || !session.user) {
        throw new Error('No active session found');
      }

      updateTestResult('authenticate', { 
        status: 'success', 
        message: 'User authenticated successfully',
        data: { 
          userId: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.username
        }
      });
      
    } catch (error: any) {
      updateTestResult('authenticate', { 
        status: 'error', 
        message: `Authentication failed: ${error.message}` 
      });
      throw error;
    }
  };

  const createUSATemplateNation = async () => {
    updateTestResult('createNation', { status: 'pending', message: 'Creating USA template nation...' });
    
    try {
      if (!testUser) throw new Error('No test user available');

      const { data, error } = await supabase
        .from('saved_nations')
        .insert({
          name: 'USA Template Nation',
          user_id: testUser.id,
          assessment_data: USA_TEMPLATE_NATION,
          custom_policies: {
            ethical: 'Constitutional democracy with emphasis on individual rights and freedoms',
            economic: 'Mixed market economy with federal regulation and state-level variation',
            judicial: 'Federal court system with Supreme Court as final arbiter',
            environmental: 'Federal environmental protection with state implementation'
          },
          is_temporary: false
        })
        .select()
        .single();

      if (error) throw error;

      setCreatedNationId(data.id);
      updateTestResult('createNation', { 
        status: 'success', 
        message: 'USA template nation created successfully',
        data: { 
          nationId: data.id,
          nationName: data.name,
          population: USA_TEMPLATE_NATION.population,
          territory: USA_TEMPLATE_NATION.territory
        }
      });
      
    } catch (error: any) {
      updateTestResult('createNation', { 
        status: 'error', 
        message: `Failed to create nation: ${error.message}` 
      });
      throw error;
    }
  };

  const retrieveSavedNation = async () => {
    updateTestResult('retrieveNation', { status: 'pending', message: 'Retrieving saved nation...' });
    
    try {
      if (!testUser || !createdNationId) throw new Error('No test user or nation ID available');

      const { data, error } = await supabase
        .from('saved_nations')
        .select('*')
        .eq('id', createdNationId)
        .eq('user_id', testUser.id)
        .is('deleted_at', null)
        .single();

      if (error) throw error;

      if (!data) throw new Error('Nation not found');

      // Verify data integrity
      const assessmentData = data.assessment_data;
      const isDataValid = 
        assessmentData.population === USA_TEMPLATE_NATION.population &&
        assessmentData.territory === USA_TEMPLATE_NATION.territory &&
        assessmentData.politicalStructure === USA_TEMPLATE_NATION.politicalStructure;

      updateTestResult('retrieveNation', { 
        status: isDataValid ? 'success' : 'warning', 
        message: isDataValid 
          ? 'Nation retrieved successfully with correct data'
          : 'Nation retrieved but data integrity check failed',
        data: { 
          nationId: data.id,
          dataIntegrity: isDataValid,
          retrievedData: {
            population: assessmentData.population,
            territory: assessmentData.territory,
            politicalStructure: assessmentData.politicalStructure
          }
        }
      });
      
    } catch (error: any) {
      updateTestResult('retrieveNation', { 
        status: 'error', 
        message: `Failed to retrieve nation: ${error.message}` 
      });
      throw error;
    }
  };

  const updateNationData = async () => {
    updateTestResult('updateNation', { status: 'pending', message: 'Testing nation update...' });
    
    try {
      if (!testUser || !createdNationId) throw new Error('No test user or nation ID available');

      const updatedData = {
        ...USA_TEMPLATE_NATION,
        population: 335000000, // Updated population
        name: 'USA Template Nation (Updated)'
      };

      const { error } = await supabase
        .from('saved_nations')
        .update({
          name: 'USA Template Nation (Updated)',
          assessment_data: updatedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', createdNationId)
        .eq('user_id', testUser.id);

      if (error) throw error;

      // Verify update
      const { data: verifyData, error: verifyError } = await supabase
        .from('saved_nations')
        .select('name, assessment_data')
        .eq('id', createdNationId)
        .single();

      if (verifyError) throw verifyError;

      const updateSuccessful = 
        verifyData.name === 'USA Template Nation (Updated)' &&
        verifyData.assessment_data.population === 335000000;

      updateTestResult('updateNation', { 
        status: updateSuccessful ? 'success' : 'warning', 
        message: updateSuccessful 
          ? 'Nation updated successfully'
          : 'Update completed but verification failed',
        data: { 
          updatedName: verifyData.name,
          updatedPopulation: verifyData.assessment_data.population
        }
      });
      
    } catch (error: any) {
      updateTestResult('updateNation', { 
        status: 'error', 
        message: `Failed to update nation: ${error.message}` 
      });
      throw error;
    }
  };

  const testNationDeletion = async () => {
    updateTestResult('deleteNation', { status: 'pending', message: 'Testing nation deletion (soft delete)...' });
    
    try {
      if (!testUser || !createdNationId) throw new Error('No test user or nation ID available');

      // Soft delete the nation
      const { error } = await supabase
        .from('saved_nations')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', createdNationId)
        .eq('user_id', testUser.id);

      if (error) throw error;

      // Verify deletion - should not be retrievable
      const { data: verifyData, error: verifyError } = await supabase
        .from('saved_nations')
        .select('*')
        .eq('id', createdNationId)
        .is('deleted_at', null)
        .maybeSingle();

      // Should not find the nation (verifyData should be null)
      const deletionSuccessful = verifyData === null;

      updateTestResult('deleteNation', { 
        status: deletionSuccessful ? 'success' : 'error', 
        message: deletionSuccessful 
          ? 'Nation soft-deleted successfully'
          : 'Deletion failed - nation still retrievable',
        data: { 
          nationStillExists: verifyData !== null
        }
      });
      
    } catch (error: any) {
      updateTestResult('deleteNation', { 
        status: 'error', 
        message: `Failed to delete nation: ${error.message}` 
      });
      throw error;
    }
  };

  const cleanupTestUser = async () => {
    updateTestResult('cleanup', { status: 'pending', message: 'Cleaning up test data...' });
    
    try {
      // Sign out the test user
      await supabase.auth.signOut();
      
      updateTestResult('cleanup', { 
        status: 'success', 
        message: 'Test cleanup completed successfully'
      });
      
    } catch (error: any) {
      updateTestResult('cleanup', { 
        status: 'warning', 
        message: `Cleanup completed with warnings: ${error.message}` 
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <CheckCircle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
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

  const testSteps = [
    { key: 'createUser', title: 'Create Test User Account', icon: User },
    { key: 'authenticate', title: 'Authenticate Test User', icon: CheckCircle },
    { key: 'createNation', title: 'Create USA Template Nation', icon: Globe },
    { key: 'retrieveNation', title: 'Retrieve Saved Nation', icon: Database },
    { key: 'updateNation', title: 'Update Nation Data', icon: Database },
    { key: 'deleteNation', title: 'Test Nation Deletion', icon: Trash2 },
    { key: 'cleanup', title: 'Cleanup Test Data', icon: CheckCircle }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Server & Storage Test - USA Template Nation</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">Test Overview</h3>
              <p className="text-blue-800 text-sm">
                This test creates a complete USA template nation with realistic data, tests all CRUD operations,
                and verifies data integrity throughout the process.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">USA Template Nation Specs:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <strong>Population:</strong> {USA_TEMPLATE_NATION.population.toLocaleString()}
                </div>
                <div>
                  <strong>Territory:</strong> {USA_TEMPLATE_NATION.territory.toLocaleString()} km²
                </div>
                <div>
                  <strong>Political System:</strong> {USA_TEMPLATE_NATION.politicalStructure}
                </div>
                <div>
                  <strong>Economic Model:</strong> {USA_TEMPLATE_NATION.economicModel}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {testSteps.map(({ key, title, icon: Icon }) => {
              const result = testResults[key];
              return (
                <div
                  key={key}
                  className={`border rounded-lg p-4 ${result ? getStatusColor(result.status) : 'border-gray-200'}`}
                >
                  <div className="flex items-start space-x-3">
                    {result ? getStatusIcon(result.status) : <Icon className="h-5 w-5 text-gray-400" />}
                    <div className="flex-1">
                      <h3 className="font-semibold">{title}</h3>
                      {result && (
                        <>
                          <p className="text-sm mt-1">{result.message}</p>
                          {result.data && (
                            <div className="mt-2 text-xs bg-white bg-opacity-50 rounded p-2">
                              <pre>{JSON.stringify(result.data, null, 2)}</pre>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {Object.keys(testResults).length > 0 && (
                <span>
                  Completed: {Object.values(testResults).filter(r => r.status !== 'pending').length} / {testSteps.length}
                </span>
              )}
            </div>
            <div className="space-x-3">
              <button
                onClick={runCompleteTest}
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
                    <span>Run Complete Test</span>
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