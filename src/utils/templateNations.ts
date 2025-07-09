// Historical template nations for leaderboard population
import { AssessmentData } from '../types';

export interface TemplateNation {
  name: string;
  assessmentData: AssessmentData;
  customPolicies: {
    ethical?: string;
    economic?: string;
    judicial?: string;
    environmental?: string;
  };
}

export const TEMPLATE_NATIONS: TemplateNation[] = [
  // Modern USA (2020s)
  {
    name: 'Modern United States',
    assessmentData: {
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
    },
    customPolicies: {
      ethical: 'Constitutional democracy with emphasis on individual rights, religious freedom, and pluralistic values',
      economic: 'Mixed market economy with federal regulation, progressive taxation, and social safety nets',
      judicial: 'Federal court system with Supreme Court as final constitutional arbiter and jury trial rights',
      environmental: 'Federal environmental protection agencies with state-level implementation and climate initiatives'
    }
  },

  // Colonial USA (1783-1800)
  {
    name: 'Early American Republic',
    assessmentData: {
      population: 3900000,
      territory: 2100000,
      resources: 9,
      climate: ['Temperate', 'Coastal'],
      languages: 1,
      religiousDiversity: 3,
      educationLevel: 3,
      technologyLevel: 2,
      location: 'Earth-based',
      environmentalChallenges: ['harsh climate'],
      economicModel: 'Free market',
      politicalStructure: 'Representative democracy',
      socialOrganization: ['Individualism', 'Merit-based', 'Wealth-based'],
      educationSystem: ['Private'],
      healthcare: ['Privatized payment'],
      security: ['Citizen militia', 'Border security'],
      resourceManagement: ['Water management', 'Food security'],
      legalFramework: [
        'Habeas corpus',
        'Trial by peers',
        'Sentencing by peers',
        'Ability to appeal judicial judgments',
        'Ability to lobby lawmakers directly',
        'Punishment for graft',
        'Eligibility for holding elected roles is based upon more than age'
      ]
    },
    customPolicies: {
      ethical: 'Natural rights philosophy with emphasis on life, liberty, and property; Protestant Christian moral framework',
      economic: 'Agrarian capitalism with minimal government intervention and emphasis on individual enterprise',
      judicial: 'Common law system with local magistrates and circuit courts; emphasis on property rights',
      environmental: 'Westward expansion with abundant natural resources; minimal conservation concerns'
    }
  },

  // Ottoman Empire (1500s peak)
  {
    name: 'Ottoman Empire at Peak',
    assessmentData: {
      population: 35000000,
      territory: 5200000,
      resources: 7,
      climate: ['Temperate', 'Arid', 'Coastal'],
      languages: 8,
      religiousDiversity: 4,
      educationLevel: 4,
      technologyLevel: 4,
      location: 'Earth-based',
      environmentalChallenges: ['Water scarcity', 'harsh climate'],
      economicModel: 'Regulated market',
      politicalStructure: 'Monarchy',
      socialOrganization: ['Caste heritage', 'Merit-based', 'Wealth-based'],
      educationSystem: ['Private', 'Apprenticeship under a master'],
      healthcare: ['Cultural medicine', 'Privatized payment'],
      security: ['Professional military', 'Police force', 'Border security', 'Intelligence services'],
      resourceManagement: ['Water management', 'Food security', 'Natural resource extraction'],
      legalFramework: [
        'Trial by peers',
        'Ability to appeal judicial judgments',
        'Executive power as final authority',
        'Capital punishment is available',
        'Eligibility for holding elected roles is based upon more than age'
      ]
    },
    customPolicies: {
      ethical: 'Islamic law (Sharia) combined with imperial edicts; religious tolerance for People of the Book',
      economic: 'State-controlled trade routes with guild system and agricultural taxation',
      judicial: 'Islamic courts with qadi judges; separate legal systems for different religious communities',
      environmental: 'Imperial control of water resources and agricultural lands; sustainable practices in core territories'
    }
  },

  // 1850s China (Qing Dynasty)
  {
    name: 'Qing Dynasty China',
    assessmentData: {
      population: 430000000,
      territory: 11400000,
      resources: 6,
      climate: ['Temperate', 'Tropical', 'Arid', 'harsh climate'],
      languages: 12,
      religiousDiversity: 5,
      educationLevel: 3,
      technologyLevel: 3,
      location: 'Earth-based',
      environmentalChallenges: ['Natural disasters', 'Water scarcity', 'Food insecurity'],
      economicModel: 'Regulated market',
      politicalStructure: 'Monarchy',
      socialOrganization: ['Caste heritage', 'Merit-based', 'Seniority-based'],
      educationSystem: ['Private', 'Apprenticeship under a master'],
      healthcare: ['Cultural medicine', 'Privatized payment'],
      security: ['Professional military', 'Police force', 'Border security'],
      resourceManagement: ['Water management', 'Food security', 'Natural resource extraction'],
      legalFramework: [
        'Executive power as final authority',
        'Capital punishment is available',
        'Incarceration without being read your rights or told your charge',
        'Eligibility for holding elected roles is based upon more than age'
      ]
    },
    customPolicies: {
      ethical: 'Confucian moral philosophy with emphasis on hierarchy, filial piety, and social harmony',
      economic: 'Imperial monopolies on salt and iron; agricultural taxation and tribute system',
      judicial: 'Imperial legal code with magistrate courts; emphasis on collective responsibility',
      environmental: 'Imperial water management systems; agricultural terracing and flood control'
    }
  },

  // 2010s Lesotho
  {
    name: 'Kingdom of Lesotho',
    assessmentData: {
      population: 2100000,
      territory: 30355,
      resources: 3,
      climate: ['Temperate', 'harsh climate'],
      languages: 2,
      religiousDiversity: 2,
      educationLevel: 5,
      technologyLevel: 4,
      location: 'Earth-based',
      environmentalChallenges: ['Water scarcity', 'Food insecurity', 'harsh climate'],
      economicModel: 'Mixed system',
      politicalStructure: 'Constitutional monarchy',
      socialOrganization: ['Communalism', 'Caste heritage', 'Seniority-based'],
      educationSystem: ['Universal public', 'Private'],
      healthcare: ['Universal access', 'Cultural medicine'],
      security: ['Professional military', 'Police force', 'Border security'],
      resourceManagement: ['Water management', 'Food security'],
      legalFramework: [
        'Habeas corpus',
        'Trial by peers',
        'Ability to appeal judicial judgments',
        'Executive power as final authority',
        'Eligibility for holding elected roles is based upon more than age'
      ]
    },
    customPolicies: {
      ethical: 'Traditional Basotho values combined with Christian principles; emphasis on ubuntu and community',
      economic: 'Mixed economy with textile manufacturing, diamond mining, and subsistence agriculture',
      judicial: 'Dual legal system combining Roman-Dutch law with traditional Basotho customary law',
      environmental: 'Highland water management for regional export; sustainable mountain agriculture practices'
    }
  }
];