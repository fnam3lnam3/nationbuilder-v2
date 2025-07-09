import { AssessmentData } from '../types';

export interface ArchetypeNation {
  id: string;
  name: string;
  source: string;
  assessmentData: AssessmentData;
  customPolicies: {
    ethical?: string;
    economic?: string;
    judicial?: string;
    environmental?: string;
  };
}

export const ARCHETYPE_NATIONS: ArchetypeNation[] = [
  {
    id: 'usa-modern',
    name: 'Modern United States',
    source: 'Contemporary Democracy (2020s)',
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
      ethical: 'Constitutional democracy with emphasis on individual rights and freedoms',
      economic: 'Mixed market economy with federal regulation and state-level variation',
      judicial: 'Federal court system with Supreme Court as final arbiter',
      environmental: 'Federal environmental protection with state implementation'
    }
  },
  {
    id: 'ottoman-peak',
    name: 'Ottoman Empire',
    source: 'Historical Empire (1500s Peak)',
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
      ethical: 'Islamic law combined with imperial edicts; religious tolerance for minorities',
      economic: 'State-controlled trade routes with guild system and agricultural taxation',
      judicial: 'Islamic courts with separate legal systems for different religious communities',
      environmental: 'Imperial control of water resources and sustainable agricultural practices'
    }
  },
  {
    id: 'nordic-model',
    name: 'Nordic Social Democracy',
    source: 'Modern Welfare State (Denmark/Sweden model)',
    assessmentData: {
      population: 10000000,
      territory: 450000,
      resources: 6,
      climate: ['Temperate', 'Arctic'],
      languages: 1,
      religiousDiversity: 2,
      educationLevel: 9,
      technologyLevel: 9,
      location: 'Earth-based',
      environmentalChallenges: ['Climate instability'],
      economicModel: 'Mixed system',
      politicalStructure: 'Representative democracy',
      socialOrganization: ['Communalism', 'Merit-based', 'Ethical acts-based'],
      educationSystem: ['Universal public'],
      healthcare: ['Universal access', 'Preventive care', 'Research-based medicine'],
      security: ['Professional military', 'Police force', 'Emergency response'],
      resourceManagement: ['Water management', 'Energy distribution', 'Environmental protection'],
      legalFramework: [
        'Habeas corpus',
        'Trial by peers',
        'Ability to appeal police actions',
        'Ability to appeal judicial judgments',
        'Punishment for graft'
      ]
    },
    customPolicies: {
      ethical: 'Social democratic values with emphasis on equality, solidarity, and human dignity',
      economic: 'High-tax, high-service welfare state with strong labor protections',
      judicial: 'Restorative justice system with emphasis on rehabilitation over punishment',
      environmental: 'Carbon neutrality goals with comprehensive environmental protection'
    }
  },
  {
    id: 'singapore-technocracy',
    name: 'Singapore Model',
    source: 'Modern Technocratic State',
    assessmentData: {
      population: 5800000,
      territory: 720,
      resources: 2,
      climate: ['Tropical'],
      languages: 4,
      religiousDiversity: 6,
      educationLevel: 9,
      technologyLevel: 10,
      location: 'Earth-based',
      environmentalChallenges: ['Limited space', 'Water scarcity'],
      economicModel: 'Mixed system',
      politicalStructure: 'Representative democracy',
      socialOrganization: ['Merit-based', 'Wealth-based', 'Ethical acts-based'],
      educationSystem: ['Universal public', 'Private'],
      healthcare: ['Universal access', 'Preventive care', 'Research-based medicine'],
      security: ['Professional military', 'Police force', 'Cybersecurity', 'Emergency response'],
      resourceManagement: ['Water management', 'Energy distribution', 'Food security', 'Environmental protection'],
      legalFramework: [
        'Trial by peers',
        'Executive power as final authority',
        'Capital punishment is available',
        'Punishment for graft',
        'Eligibility for holding elected roles is based upon more than age'
      ]
    },
    customPolicies: {
      ethical: 'Pragmatic governance with emphasis on meritocracy and social harmony',
      economic: 'State-guided capitalism with strategic government investment',
      judicial: 'Efficient legal system with strong rule of law and swift justice',
      environmental: 'Urban sustainability with green building standards and water recycling'
    }
  },
  {
    id: 'mars-colony',
    name: 'Mars Colony Alpha',
    source: 'Theoretical Space Settlement',
    assessmentData: {
      population: 50000,
      territory: 1000,
      resources: 3,
      climate: ['harsh climate'],
      languages: 2,
      religiousDiversity: 3,
      educationLevel: 9,
      technologyLevel: 10,
      location: 'Planetary colony',
      environmentalChallenges: ['High radiation', 'harsh climate', 'Limited space', 'Air quality issues', 'Water scarcity'],
      economicModel: 'Mixed system',
      politicalStructure: 'Representative democracy',
      socialOrganization: ['Communalism', 'Merit-based', 'Knowledge-based'],
      educationSystem: ['Universal public', 'Virtual-remote'],
      healthcare: ['Universal access', 'Research-based medicine', 'Emergency response'],
      security: ['Emergency response'],
      resourceManagement: ['Water management', 'Energy distribution', 'Food security', 'Environmental protection'],
      legalFramework: [
        'Habeas corpus',
        'Trial by peers',
        'Ability to appeal judicial judgments',
        'Punishment for graft'
      ]
    },
    customPolicies: {
      ethical: 'Survival-focused ethics with emphasis on collective responsibility and scientific rationality',
      economic: 'Resource-based economy with strict rationing and recycling requirements',
      judicial: 'Streamlined legal system adapted for small population and survival conditions',
      environmental: 'Closed-loop life support systems with zero waste tolerance'
    }
  },
  {
    id: 'dystopian-surveillance',
    name: 'Surveillance State',
    source: 'Dystopian Archetype',
    assessmentData: {
      population: 100000000,
      territory: 2000000,
      resources: 4,
      climate: ['Temperate', 'Arid'],
      languages: 1,
      religiousDiversity: 1,
      educationLevel: 4,
      technologyLevel: 9,
      location: 'Earth-based',
      environmentalChallenges: ['Air quality issues', 'Water scarcity', 'Climate instability'],
      economicModel: 'AI-managed',
      politicalStructure: 'Fascism',
      socialOrganization: ['Caste heritage', 'Wealth-based'],
      educationSystem: ['Universal public'],
      healthcare: ['Universal access'],
      security: ['Professional military', 'Police force', 'Border security', 'Cybersecurity', 'Intelligence services'],
      resourceManagement: ['Water management', 'Energy distribution', 'Food security'],
      legalFramework: [
        'Executive power as final authority',
        'Capital punishment is available',
        'Incarceration without being read your rights or told your charge',
        'Eligibility for holding elected roles is based upon more than age'
      ]
    },
    customPolicies: {
      ethical: 'State supremacy with individual rights subordinated to collective security',
      economic: 'Centrally planned economy with AI optimization and citizen monitoring',
      judicial: 'Administrative justice system with limited appeals and state security priority',
      environmental: 'Environmental controls used as tools of population management'
    }
  }
];

export const getArchetypeNations = (): ArchetypeNation[] => {
  return ARCHETYPE_NATIONS;
};

export const getMostDissimilarArchetype = (baseData: AssessmentData): ArchetypeNation | null => {
  let mostDissimilar: ArchetypeNation | null = null;
  let maxDifference = 0;

  ARCHETYPE_NATIONS.forEach(archetype => {
    let difference = 0;
    
    // Compare key characteristics
    if (baseData.politicalStructure !== archetype.assessmentData.politicalStructure) difference += 3;
    if (baseData.economicModel !== archetype.assessmentData.economicModel) difference += 3;
    if (baseData.location !== archetype.assessmentData.location) difference += 2;
    
    // Compare population scale (log difference)
    const popDiff = Math.abs(Math.log10(baseData.population) - Math.log10(archetype.assessmentData.population));
    difference += popDiff;
    
    // Compare technology and education levels
    difference += Math.abs(baseData.technologyLevel - archetype.assessmentData.technologyLevel) * 0.5;
    difference += Math.abs(baseData.educationLevel - archetype.assessmentData.educationLevel) * 0.5;
    
    // Compare social organization
    const baseSocial = Array.isArray(baseData.socialOrganization) ? baseData.socialOrganization : [baseData.socialOrganization];
    const archetypeSocial = Array.isArray(archetype.assessmentData.socialOrganization) ? 
      archetype.assessmentData.socialOrganization : [archetype.assessmentData.socialOrganization];
    
    const commonSocial = baseSocial.filter(s => archetypeSocial.includes(s)).length;
    difference += (baseSocial.length + archetypeSocial.length - 2 * commonSocial) * 0.5;
    
    if (difference > maxDifference) {
      maxDifference = difference;
      mostDissimilar = archetype;
    }
  });

  return mostDissimilar;
};