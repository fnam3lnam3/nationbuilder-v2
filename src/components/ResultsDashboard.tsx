import React, { useState } from 'react';
import { Download, Share2, RefreshCw, ChevronLeft, BarChart3, PieChart, TrendingUp, Shield, Edit3, Save, LogIn, Scale, ChevronRight } from 'lucide-react';
import PolicyEditor from './PolicyEditor';
import { AssessmentData, User, ResultsData } from '../types';

interface ResultsDashboardProps {
  assessmentData: AssessmentData;
  customPolicies?: Record<string, string>;
  onBack: () => void;
  onStartNew: () => void;
  onPolicyUpdate: (policies: Record<string, string>) => void;
  user?: User | null;
  onLogin: () => void;
  onSaveNation: () => void;
  isExistingNation?: boolean;
}

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
  const [activeTab, setActiveTab] = useState<'overview' | 'constitution' | 'analysis'>('overview');
  const [showPolicyEditor, setShowPolicyEditor] = useState(false);
  
  // Debug logging - more detailed
  console.log('ResultsDashboard - Component rendered');
  console.log('ResultsDashboard - assessmentData:', assessmentData);
  
  if (assessmentData) {
    console.log('ResultsDashboard - assessmentData type:', typeof assessmentData);
    console.log('ResultsDashboard - assessmentData keys:', Object.keys(assessmentData));
    console.log('ResultsDashboard - Required fields check:', {
      location: assessmentData.location,
      economicModel: assessmentData.economicModel,
      politicalStructure: assessmentData.politicalStructure,
      socialOrganization: assessmentData.socialOrganization
    });
  }
  
  // Early return if no assessment data
  if (!assessmentData) {
    console.error('No assessment data provided to ResultsDashboard');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No Assessment Data</h2>
          <p className="text-gray-600 mb-4">Please complete an assessment first.</p>
          <button
            onClick={onStartNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    );
  }
  
  // Validate required fields
  const requiredFields = ['location', 'economicModel', 'politicalStructure', 'socialOrganization'];
  const missingFields = requiredFields.filter(field => {
    const value = assessmentData[field as keyof AssessmentData];
    return !value || (typeof value === 'string' && value.trim() === '');
  });
  
  if (missingFields.length > 0) {
    console.error('Missing required fields:', missingFields);
    console.error('Assessment data received:', assessmentData);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Incomplete Assessment Data</h2>
          <p className="text-gray-600 mb-4">Some required fields are missing: {missingFields.join(', ')}</p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Complete Assessment
          </button>
        </div>
      </div>
    );
  }
  
  // Mock results generation based on assessment data
  const generateResults = (data: AssessmentData): ResultsData => {
    console.log('ResultsDashboard - generateResults called with:', data);
    
    try {
      // Validate data before processing
      if (!data.location || !data.economicModel || !data.politicalStructure || !data.socialOrganization) {
        throw new Error('Missing required assessment data fields');
      }
      
      // This would normally call an AI service
      const baseEfficiency = Math.min(90, (data.resources * 8) + (data.technologyLevel * 5) + (data.educationLevel * 3));
      const baseRights = Math.min(95, (data.educationLevel * 7) + (data.technologyLevel * 4) + (data.religiousDiversity * 3));
      const baseAdaptability = Math.min(88, (data.technologyLevel * 8) + (data.educationLevel * 5) + (data.resources * 2));
      const baseCohesion = Math.min(92, (100 - data.religiousDiversity * 5) + (data.educationLevel * 4) + (data.languages <= 3 ? 20 : 0));
      
      const results = {
        metrics: {
          resourceEfficiency: baseEfficiency,
          rightsProtection: baseRights,
          adaptability: baseAdaptability,
          socialCohesion: baseCohesion,
          economicGrowth: Math.min(85, baseEfficiency * 0.8 + baseAdaptability * 0.2),
          sustainability: Math.min(90, baseEfficiency * 0.6 + baseAdaptability * 0.4)
        },
        politicalAnalysis: {
          actualGovernanceType: getActualGovernanceType(data),
          evolutionPrediction: getPoliticalEvolution(data),
          failureCauses: getPoliticalFailureCauses(data),
          growthPathways: getPoliticalGrowthPathways(data),
          institutionalRecommendations: getInstitutionalRecommendations(data)
        },
        economicAnalysis: {
          actualEconomicSystem: getActualEconomicSystem(data),
          systemEvolution: getEconomicEvolution(data),
          failureRisks: getEconomicFailureRisks(data),
          gdpGrowthPathways: getGDPGrowthPathways(data),
          stabilizationMeasures: getStabilizationMeasures(data)
        },
        recommendations: {
          governanceStructure: getGovernanceRecommendation(data),
          keyInstitutions: getInstitutionRecommendations(data),
          economicFramework: getEconomicRecommendation(data),
          socialPolicies: getSocialPolicyRecommendations(data)
        },
        comparisons: {
          historicalSimilar: getHistoricalComparisons(data),
          strengthsWeaknesses: getStrengthsWeaknesses(data)
        },
        constitution: generateConstitution(data, customPolicies)
      };
      
      console.log('ResultsDashboard - Generated results successfully:', results);
      return results;
    } catch (error) {
      console.error('Error in generateResults:', error);
      throw new Error(`Failed to generate results: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getActualGovernanceType = (data: AssessmentData): string => {
    if (data.technologyLevel >= 8 && data.educationLevel >= 7) {
      return 'Digital Techno-Democracy with AI Advisory Systems';
    }
    if (data.population > 100000000 && data.languages > 5) {
      return 'Federal Representative Democracy with Regional Autonomy';
    }
    if (data.resources <= 3 && data.environmentalChallenges.length > 4) {
      return 'Crisis-Responsive Technocratic Republic';
    }
    return data.politicalStructure || 'Adaptive Democratic Republic';
  };

  const getPoliticalEvolution = (data: AssessmentData): string => {
    const timeframes = [];
    if (data.technologyLevel >= 7) {
      timeframes.push('5-10 years: Integration of AI-assisted decision making');
    }
    if (data.educationLevel >= 8) {
      timeframes.push('10-15 years: Transition to more direct democratic participation');
    }
    if (data.population > 50000000) {
      timeframes.push('15-25 years: Potential federal restructuring for better representation');
    }
    return timeframes.join('; ') || 'Gradual institutional strengthening over 20-30 years';
  };

  const getPoliticalFailureCauses = (data: AssessmentData): string[] => {
    const risks = [];
    if (data.languages > 7) risks.push('Linguistic fragmentation leading to separatist movements');
    if (data.religiousDiversity > 8) risks.push('Religious conflicts undermining national unity');
    if (data.resources <= 2) risks.push('Resource scarcity causing governmental legitimacy crisis');
    if (data.environmentalChallenges.length > 5) risks.push('Environmental disasters overwhelming institutional capacity');
    if (data.population > 500000000 && data.technologyLevel < 6) risks.push('Governance scale exceeding technological capacity');
    return risks.length > 0 ? risks : ['Democratic backsliding during economic crisis', 'Institutional corruption undermining public trust'];
  };

  const getPoliticalGrowthPathways = (data: AssessmentData): string[] => {
    const pathways = [];
    if (data.educationLevel >= 7) pathways.push('Citizen education programs enhancing democratic participation');
    if (data.technologyLevel >= 6) pathways.push('Digital governance platforms increasing transparency and efficiency');
    if (data.legalFramework.includes('Dispute resolution')) pathways.push('Strengthened judicial independence and rule of law');
    pathways.push('Regional governance experiments testing innovative democratic models');
    return pathways;
  };

  const getInstitutionalRecommendations = (data: AssessmentData): string[] => {
    const institutions = ['Constitutional Court', 'Electoral Commission', 'Anti-Corruption Agency'];
    if (data.technologyLevel >= 7) institutions.push('Digital Governance Innovation Lab');
    if (data.environmentalChallenges.length > 3) institutions.push('Climate Adaptation Authority');
    if (data.languages > 3) institutions.push('Linguistic Rights Commission');
    if (data.resources <= 4) institutions.push('Strategic Resource Management Council');
    return institutions;
  };

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
    if (data.population < 100000 && data.socialOrganization === 'Community Role-based') {
      return 'Cooperative Community Economy with Limited Markets';
    }
    return 'Regulated Market Economy with Strong Social Safety Net';
  };

  const getEconomicEvolution = (data: AssessmentData): string => {
    const phases = [];
    phases.push('Phase 1 (0-5 years): Economic stabilization and infrastructure development');
    if (data.technologyLevel >= 6) {
      phases.push('Phase 2 (5-15 years): Technology-driven productivity growth and automation integration');
    }
    if (data.educationLevel >= 7) {
      phases.push('Phase 3 (15-25 years): Knowledge economy transition with innovation clusters');
    }
    phases.push('Phase 4 (25+ years): Sustainable circular economy with advanced resource recycling');
    return phases.join('; ');
  };

  const getEconomicFailureRisks = (data: AssessmentData): string[] => {
    const risks = [];
    if (data.resources <= 3) risks.push('Resource depletion crisis within 10-15 years');
    if (data.technologyLevel >= 8) risks.push('Technological unemployment exceeding retraining capacity');
    if (data.environmentalChallenges.includes('Climate instability')) risks.push('Climate-induced economic disruption');
    if (data.population > 100000000 && data.educationLevel < 5) risks.push('Demographic dividend failure due to skill gaps');
    if (data.location === 'Space habitat') risks.push('Supply chain vulnerability from Earth dependence');
    return risks.length > 0 ? risks : ['Market volatility from external trade dependence', 'Inequality-driven social unrest'];
  };

  const getGDPGrowthPathways = (data: AssessmentData): string[] => {
    const pathways = [];
    if (data.educationLevel >= 6) pathways.push('Human capital development: 2-4% annual GDP growth through education');
    if (data.technologyLevel >= 7) pathways.push('Innovation economy: 3-6% growth through R&D and tech adoption');
    if (data.resources >= 6) pathways.push('Resource optimization: 1-3% growth through efficient extraction and processing');
    if (data.healthcare.includes('Universal access')) pathways.push('Health dividend: 1-2% growth through improved population health');
    pathways.push('Infrastructure investment: 2-5% growth through strategic development projects');
    return pathways;
  };

  const getStabilizationMeasures = (data: AssessmentData): string[] => {
    const measures = [];
    measures.push('Establish sovereign wealth fund for economic buffer');
    if (data.resources <= 4) measures.push('Diversify economy away from resource dependence');
    if (data.technologyLevel >= 6) measures.push('Implement universal basic income pilot programs');
    measures.push('Create counter-cyclical fiscal policy framework');
    if (data.environmentalChallenges.length > 3) measures.push('Build climate-resilient economic infrastructure');
    return measures;
  };

  const getGovernanceRecommendation = (data: AssessmentData): string => {
    if (data.politicalStructure === 'Direct democracy') return 'Digital Direct Democracy with AI-assisted decision support';
    if (data.politicalStructure === 'Technocracy') return 'Merit-based Technocratic Council with citizen oversight';
    if (data.politicalStructure === 'AI-assisted governance') return 'Hybrid AI-Human governance with democratic validation';
    return 'Adaptive Representative Democracy with technological enhancement';
  };

  const getInstitutionRecommendations = (data: AssessmentData): string[] => {
    const institutions = ['Legislative Assembly', 'Executive Council', 'Judicial Review Board'];
    if (data.technologyLevel >= 7) institutions.push('AI Ethics Committee');
    if (data.environmentalChallenges.length > 3) institutions.push('Environmental Security Council');
    if (data.resources <= 3) institutions.push('Resource Allocation Authority');
    return institutions;
  };

  const getEconomicRecommendation = (data: AssessmentData): string => {
    if (data.economicModel === 'Resource-based') return 'Circular Resource Economy with Universal Basic Resources';
    if (data.economicModel === 'AI-managed economy') return 'AI-Optimized Resource Distribution with Human Oversight';
    if (data.economicModel === 'Market-based') return 'Regulated Market Economy with Strong Social Safety Net';
    return 'Mixed Economy with Democratic Economic Planning';
  };

  const getSocialPolicyRecommendations = (data: AssessmentData): string[] => {
    const policies = ['Universal Education Access', 'Healthcare Guarantee'];
    if (data.languages > 3) policies.push('Multilingual Rights Protection');
    if (data.religiousDiversity > 7) policies.push('Religious Freedom Safeguards');
    if (data.environmentalChallenges.includes('Limited space')) policies.push('Space Optimization Programs');
    return policies;
  };

  const getHistoricalComparisons = (data: AssessmentData): string[] => {
    const comparisons = [];
    if (data.politicalStructure === 'Direct democracy') comparisons.push('Ancient Athens (with modern safeguards)');
    if (data.economicModel === 'Resource-based') comparisons.push('Scandinavian Social Democracies');
    if (data.location === 'Space habitat') comparisons.push('International Space Station governance');
    if (data.socialOrganization === 'Merit-based') comparisons.push('Singapore\'s Technocratic Elements');
    return comparisons.length > 0 ? comparisons : ['Swiss Federal Democracy', 'Nordic Social Model'];
  };

  const getStrengthsWeaknesses = (data: AssessmentData) => {
    const strengths = [];
    const weaknesses = [];
    
    if (data.educationLevel >= 7) strengths.push('High human capital potential');
    if (data.technologyLevel >= 7) strengths.push('Advanced technological foundation');
    if (data.resources >= 7) strengths.push('Abundant natural resources');
    
    if (data.languages > 5) weaknesses.push('Communication complexity challenges');
    if (data.religiousDiversity > 8) weaknesses.push('Potential cultural friction points');
    if (data.environmentalChallenges.length > 4) weaknesses.push('Environmental stress factors');
    
    return { strengths, weaknesses };
  };

  const generateConstitution = (data: AssessmentData, policies: Record<string, string>) => {
    const ethicalClause = policies.ethical ? `\n\nEthical Framework: ${policies.ethical}` : '';
    const economicClause = policies.economic ? `\n\nEconomic Policies: ${policies.economic}` : '';
    const judicialClause = policies.judicial ? `\n\nJudicial Procedures: ${policies.judicial}` : '';
    const environmentalClause = policies.environmental ? `\n\nEnvironmental Stewardship: ${policies.environmental}` : '';

    return {
      preamble: `We, the people of this nation, united in our commitment to ${data.socialOrganization === 'Individual-focused' ? 'individual liberty and personal responsibility' : 'collective prosperity and social harmony'}, establish this Constitution to ensure ${data.politicalStructure === 'Direct democracy' ? 'direct democratic participation' : 'effective governance'} and promote the general welfare of all citizens.${ethicalClause}`,
      articles: [
        {
          title: 'Fundamental Rights and Freedoms',
          content: `All citizens shall enjoy fundamental rights including freedom of expression, assembly, and belief. ${data.legalFramework.includes('Habeas corpus') ? 'Habeas corpus protections ensure no citizen may be detained without legal justification.' : ''} ${data.legalFramework.includes('Trial by peers') ? 'All citizens have the right to trial by a jury of their peers.' : ''} ${data.legalFramework.includes('Ability to appeal judicial judgments') ? 'Citizens may appeal judicial decisions through established appellate processes.' : ''}${judicialClause}`
        },
        {
          title: 'Governance Structure and Institutions',
          content: `The nation shall be governed through ${data.politicalStructure.toLowerCase()} with power distributed among ${data.politicalStructure === 'Direct democracy' ? 'citizen assemblies and digital platforms' : 'elected representatives and appointed officials'}. The following institutions shall be established: ${getInstitutionalRecommendations(data).join(', ')}. ${data.technologyLevel >= 7 ? 'Advanced technology shall be used to enhance democratic participation and government efficiency.' : ''}`
        },
        {
          title: 'Economic System and Resource Management',
          content: `The economic system shall be based on ${getActualEconomicSystem(data)} principles, ensuring ${data.economicModel === 'Market-based' ? 'free enterprise with appropriate regulation' : data.economicModel === 'Resource-based' ? 'equitable resource distribution and sustainability' : 'optimal resource allocation for all citizens'}. Economic stabilization measures include: ${getStabilizationMeasures(data).join('; ')}.${economicClause}`
        },
        {
          title: 'Education, Healthcare, and Social Development',
          content: `Education shall be ${data.educationSystem.includes('Universal public') ? 'universally accessible and publicly funded' : 'available through diverse pathways'} to ensure all citizens can reach their full potential. ${data.educationSystem.includes('AI-enhanced') ? 'Artificial intelligence shall be used to personalize learning experiences.' : ''} Healthcare access shall be guaranteed through ${data.healthcare.includes('Universal access') ? 'universal coverage' : 'comprehensive public-private partnerships'}.`
        },
        {
          title: 'Environmental Protection and Sustainability',
          content: `Justice shall be administered fairly and transparently. ${data.legalFramework.includes('Trial by peers') ? 'Citizens accused of crimes have the right to trial by jury.' : ''} ${data.legalFramework.includes('Sentencing by peers') ? 'Sentencing shall involve peer participation where appropriate.' : ''} ${data.legalFramework.includes('Ability to appeal police actions') ? 'Citizens may challenge police actions through independent review processes.' : ''} ${data.legalFramework.includes('Punishment for graft') ? 'Corruption and graft shall be severely punished.' : ''} ${data.legalFramework.includes('Capital punishment is available') ? 'Capital punishment may be imposed for the most serious crimes.' : 'Capital punishment is prohibited.'} ${data.legalFramework.includes('Executive power as final authority') ? 'Executive authority serves as the final arbiter in matters of national security.' : ''}`
         },
         {
           title: 'Environmental Protection and Sustainability',
           content: `The nation commits to environmental protection and sustainable development. ${data.environmentalChallenges.length > 0 ? 'Special attention shall be given to addressing ' + data.environmentalChallenges.join(', ') + '.' : ''} Future generations have the right to a healthy environment. An Environmental Security Council shall oversee long-term sustainability planning.${environmentalClause}`
        },
        {
          title: 'Amendment Process and Legal Framework',
          content: `This Constitution may be amended by a ${data.politicalStructure === 'Direct democracy' ? 'two-thirds majority in a national referendum' : 'three-fourths majority of the Legislative Assembly followed by ratification in regional assemblies'}. Laws shall be enacted by the Legislative Assembly with review by the Constitutional Court. ${data.legalFramework.includes('Ability to lobby lawmakers directly') ? 'Citizens have the right to petition and lobby their representatives directly.' : ''} Emergency powers may be invoked only during declared national emergencies with automatic sunset clauses and judicial oversight. ${data.legalFramework.includes('Eligibility for holding elected roles is based upon more than age') ? 'Eligibility for elected office requires additional qualifications beyond minimum age.' : 'Elected office eligibility is based primarily on age and citizenship requirements.'}`
        }
      ],
      adoptionMechanism: data.politicalStructure === 'Direct democracy' 
        ? 'This Constitution shall be adopted by direct national referendum requiring a simple majority of eligible voters with minimum 60% turnout.'
        : 'This Constitution shall be adopted by a Constitutional Convention with ratification by regional assemblies representing at least 75% of the population.',
      amendmentProcess: data.politicalStructure === 'Direct democracy'
        ? 'Amendments require proposal by 100,000 citizens or the Legislative Assembly, followed by national referendum with two-thirds majority approval.'
        : 'Amendments require proposal by one-third of Legislative Assembly members, passage by three-fourths majority, and ratification by three-fourths of regional assemblies.',
      lawmakingProcess: `Laws are proposed by Legislative Assembly members or citizen initiative (${data.politicalStructure === 'Direct democracy' ? '50,000 signatures' : 'through representatives'}), debated in committee, voted by simple majority, reviewed by Constitutional Court for constitutionality, and signed by the Executive Council. Emergency legislation may bypass normal procedures with automatic review within 90 days.`,
      signatureBlock: data.politicalStructure === 'Direct democracy'
        ? ['Chief Citizen Advocate', 'Speaker of Citizen Assembly', 'Constitutional Court Chief Justice', 'Regional Representatives Council Chair']
        : data.politicalStructure === 'Technocracy'
        ? ['Chief Technical Officer', 'Science Council Chair', 'Constitutional Court Chief Justice', 'Citizens Oversight Committee Chair']
        : ['President/Prime Minister', 'Legislative Assembly Speaker', 'Constitutional Court Chief Justice', 'Regional Governors Council Chair']
    };
  };

  const results = generateResults(assessmentData);
  
  console.log('Generated results:', results);

  const downloadConstitution = () => {
    const content = `CONSTITUTION\n\nPREAMBLE\n${results.constitution.preamble}\n\n${results.constitution.articles.map((article, index) => `ARTICLE ${index + 1}: ${article.title.toUpperCase()}\n${article.content}`).join('\n\n')}\n\nADOPTION MECHANISM\n${results.constitution.adoptionMechanism}\n\nAMENDMENT PROCESS\n${results.constitution.amendmentProcess}\n\nLAWMAKING PROCESS\n${results.constitution.lawmakingProcess}\n\nSIGNATURE BLOCK\n${results.constitution.signatureBlock.map(role => `_________________________\n${role}`).join('\n\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'constitution.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveNation = () => {
    onSaveNation();
  };

  const MetricCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}/100</p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
      <div className="mt-4 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color.replace('text-', 'bg-')}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              <h1 className="text-xl font-bold text-gray-900">Nation Analysis Results</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPolicyEditor(true)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Customize Policies</span>
              </button>
              <button
                onClick={downloadConstitution}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download Constitution</span>
              </button>
              <button
                onClick={handleSaveNation}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>{isExistingNation ? 'Update Nation' : 'Save Nation'}</span>
              </button>
              <button
                onClick={onStartNew}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>New Analysis</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'analysis', label: 'Detailed Analysis', icon: TrendingUp },
              { id: 'constitution', label: 'Constitution', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Resource Efficiency"
                value={results.metrics.resourceEfficiency}
                icon={BarChart3}
                color="text-blue-600"
              />
              <MetricCard
                title="Rights Protection"
                value={results.metrics.rightsProtection}
                icon={Shield}
                color="text-green-600"
              />
              <MetricCard
                title="Adaptability"
                value={results.metrics.adaptability}
                icon={TrendingUp}
                color="text-purple-600"
              />
              <MetricCard
                title="Social Cohesion"
                value={results.metrics.socialCohesion}
                icon={PieChart}
                color="text-orange-600"
              />
              <MetricCard
                title="Economic Growth"
                value={results.metrics.economicGrowth}
                icon={TrendingUp}
                color="text-indigo-600"
              />
              <MetricCard
                title="Sustainability"
                value={results.metrics.sustainability}
                icon={BarChart3}
                color="text-green-600"
              />
            </div>

            {/* Call to Action for Policy Customization */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Customize Your Nation's Policies</h3>
                  <p className="text-gray-600">
                    Fine-tune your nation's ethical, economic, judicial, and environmental policies to see how they impact your governance analysis.
                  </p>
                </div>
                <button
                  onClick={() => setShowPolicyEditor(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Customize Policies
                </button>
              </div>
            </div>

            {/* State of Your Nation */}
            <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-lg p-8 shadow-lg border-2 border-blue-300">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">State of Your Nation</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Governance Structure */}
                <div className="bg-blue-600 rounded-lg p-6 text-white">
                  <h4 className="text-lg font-bold mb-3 flex items-center">
                    <Scale className="h-5 w-5 mr-2" />
                    Governance Structure
                  </h4>
                  <p className="text-blue-100">{results.recommendations.governanceStructure}</p>
                </div>
                
                {/* Economic Framework */}
                <div className="bg-green-600 rounded-lg p-6 text-white">
                  <h4 className="text-lg font-bold mb-3 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Economic Framework
                  </h4>
                  <p className="text-green-100">{results.recommendations.economicFramework}</p>
                </div>
                
                {/* Key Institutions */}
                <div className="bg-purple-600 rounded-lg p-6 text-white">
                  <h4 className="text-lg font-bold mb-3 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Key Institutions
                  </h4>
                  <ul className="text-purple-100 space-y-1">
                    {results.recommendations.keyInstitutions.map(institution => (
                      <li key={institution} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-purple-200 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <span className="text-sm">{institution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Next Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setActiveTab('analysis')}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                <span>View Detailed Analysis</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-8">
            {/* Political Analysis */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Political System Analysis</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Actual Governance Type</h4>
                  <p className="text-gray-600">{results.politicalAnalysis.actualGovernanceType}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Evolution Prediction</h4>
                  <p className="text-gray-600">{results.politicalAnalysis.evolutionPrediction}</p>
                </div>
                <div>
                  <h4 className="font-medium text-red-700">Most Likely Causes of Nation Failure</h4>
                  <ul className="text-gray-600 list-disc list-inside">
                    {results.politicalAnalysis.failureCauses.map(cause => (
                      <li key={cause}>{cause}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-700">Nation Growth Pathways</h4>
                  <ul className="text-gray-600 list-disc list-inside">
                    {results.politicalAnalysis.growthPathways.map(pathway => (
                      <li key={pathway}>{pathway}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Economic Analysis */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Economic System Analysis</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Actual Economic System</h4>
                  <p className="text-gray-600">{results.economicAnalysis.actualEconomicSystem}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">System Evolution</h4>
                  <p className="text-gray-600">{results.economicAnalysis.systemEvolution}</p>
                </div>
                <div>
                  <h4 className="font-medium text-red-700">Economic System Failure Risks</h4>
                  <ul className="text-gray-600 list-disc list-inside">
                    {results.economicAnalysis.failureRisks.map(risk => (
                      <li key={risk}>{risk}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-700">GDP Growth Pathways</h4>
                  <ul className="text-gray-600 list-disc list-inside">
                    {results.economicAnalysis.gdpGrowthPathways.map(pathway => (
                      <li key={pathway}>{pathway}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-700">Stabilization Measures</h4>
                  <ul className="text-gray-600 list-disc list-inside">
                    {results.economicAnalysis.stabilizationMeasures.map(measure => (
                      <li key={measure}>{measure}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Historical Comparisons */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Comparisons</h3>
              <div className="space-y-2">
                {results.comparisons.historicalSimilar.map(comparison => (
                  <div key={comparison} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">{comparison}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-green-700 mb-4">Strengths</h3>
                <div className="space-y-2">
                  {results.comparisons.strengthsWeaknesses.strengths.map(strength => (
                    <div key={strength} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-gray-700">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-red-700 mb-4">Areas for Attention</h3>
                <div className="space-y-2">
                  {results.comparisons.strengthsWeaknesses.weaknesses.map(weakness => (
                    <div key={weakness} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span className="text-gray-700">{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Next Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setActiveTab('constitution')}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                <span>View Constitution</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'constitution' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Constitution</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Preamble</h4>
                  <p className="text-gray-700 leading-relaxed">{results.constitution.preamble}</p>
                </div>
                
                {results.constitution.articles.map((article, index) => (
                  <div key={index} className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Article {index + 1}: {article.title}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{article.content}</p>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Adoption Mechanism</h4>
                  <p className="text-gray-700 leading-relaxed">{results.constitution.adoptionMechanism}</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Amendment Process</h4>
                  <p className="text-gray-700 leading-relaxed">{results.constitution.amendmentProcess}</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Lawmaking Process</h4>
                  <p className="text-gray-700 leading-relaxed">{results.constitution.lawmakingProcess}</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Signature Block</h4>
                  <div className="grid grid-cols-2 gap-8 mt-8">
                    {results.constitution.signatureBlock.map(role => (
                      <div key={role} className="text-center">
                        <div className="border-b border-gray-400 mb-2 pb-8"></div>
                        <p className="text-sm text-gray-600">{role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={downloadConstitution}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Download Full Constitution
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Policy Editor Modal */}
      {showPolicyEditor && (
        <PolicyEditor
          onSave={(policies) => {
            onPolicyUpdate(policies);
            setShowPolicyEditor(false);
          }}
          onClose={() => setShowPolicyEditor(false)}
          currentPolicies={customPolicies}
        />
      )}
    </div>
  );
}