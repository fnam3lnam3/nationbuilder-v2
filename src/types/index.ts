export interface AssessmentData {
  population: number;
  territory: number;
  resources: number;
  climate: string[];
  languages: number;
  religiousDiversity: number;
  educationLevel: number;
  technologyLevel: number;
  location: string;
  environmentalChallenges: string[];
  economicModel: string;
  politicalStructure: string;
  socialOrganization: string;
  educationSystem: string[];
  healthcare: string[];
  security: string[];
  resourceManagement: string[];
  legalFramework: string[];
}

export interface User {
  id: string;
  username: string;
  city: string;
  country: string;
  age: number;
  email: string;
  createdAt: Date;
}

export interface SavedNation {
  id: string;
  name: string;
  assessmentData: AssessmentData;
  customPolicies?: {
    ethical?: string;
    economic?: string;
    judicial?: string;
    environmental?: string;
  };
  createdAt: Date;
  lastModified: Date;
}

export interface ResultsData {
  metrics: {
    resourceEfficiency: number;
    rightsProtection: number;
    adaptability: number;
    socialCohesion: number;
    economicGrowth: number;
    sustainability: number;
  };
  politicalAnalysis: {
    actualGovernanceType: string;
    evolutionPrediction: string;
    failureCauses: string[];
    growthPathways: string[];
    institutionalRecommendations: string[];
  };
  economicAnalysis: {
    actualEconomicSystem: string;
    systemEvolution: string;
    failureRisks: string[];
    gdpGrowthPathways: string[];
    stabilizationMeasures: string[];
  };
  recommendations: {
    governanceStructure: string;
    keyInstitutions: string[];
    economicFramework: string;
    socialPolicies: string[];
  };
  comparisons: {
    historicalSimilar: string[];
    strengthsWeaknesses: {
      strengths: string[];
      weaknesses: string[];
    };
  };
  constitution: {
    preamble: string;
    articles: Array<{
      title: string;
      content: string;
    }>;
    adoptionMechanism: string;
    amendmentProcess: string;
    lawmakingProcess: string;
    signatureBlock: string[];
  };
}