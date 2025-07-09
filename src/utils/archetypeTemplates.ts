import { AssessmentData } from '../types';

// Historical archetype nations for auto-population
export interface ArchetypeTemplate {
  id: string;
  name: string;
  description: string;
  assessmentData: AssessmentData;
}

export const ARCHETYPE_TEMPLATES: Record<string, ArchetypeTemplate> = {
  utopia: {
    id: 'denmark-modern',
    name: 'Modern Denmark (Utopian Archetype)',
    description: 'Based on contemporary Denmark with high social welfare, democratic governance, and sustainable practices',
    assessmentData: {
      population: 5800000,
      territory: 43094,
      resources: 6,
      climate: ['Temperate', 'Coastal'],
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
      resourceManagement: ['Water management', 'Energy distribution', 'Environmental protection', 'Infrastructure maintenance'],
      legalFramework: [
        'Habeas corpus',
        'Trial by peers',
        'Ability to appeal police actions',
        'Ability to appeal judicial judgments',
        'Punishment for graft',
        'Referendum is available to remove an elected official'
      ]
    }
  },
  
  dystopia: {
    id: 'siberia-1600s',
    name: '1600s Siberian Exile Colony (Dystopian Archetype)',
    description: 'Based on harsh 17th century Siberian penal colonies with authoritarian control and survival conditions',
    assessmentData: {
      population: 50000,
      territory: 500000,
      resources: 2,
      climate: ['Arctic', 'harsh climate'],
      languages: 2,
      religiousDiversity: 1,
      educationLevel: 2,
      technologyLevel: 1,
      location: 'Earth-based',
      environmentalChallenges: ['harsh climate', 'Food insecurity', 'Water scarcity', 'Natural disasters'],
      economicModel: 'Feudal',
      politicalStructure: 'Martial law/Anarchic',
      socialOrganization: ['Caste heritage', 'Seniority-based'],
      educationSystem: ['Apprenticeship under a master'],
      healthcare: ['Cultural medicine'],
      security: ['Citizen militia'],
      resourceManagement: ['Food security'],
      legalFramework: [
        'Executive power as final authority',
        'Capital punishment is available',
        'Incarceration without being read your rights or told your charge'
      ]
    }
  },
  
  mars: {
    id: 'australia-colonial-iss',
    name: 'Colonial Australia + ISS Constraints (Mars Archetype)',
    description: 'Australian colonial governance (30 years post-British colonization) with International Space Station resource constraints',
    assessmentData: {
      population: 400,
      territory: 1000,
      resources: 3,
      climate: ['harsh climate'],
      languages: 1,
      religiousDiversity: 2,
      educationLevel: 6,
      technologyLevel: 8,
      location: 'Space station or space-traveling coommunity',
      environmentalChallenges: ['High radiation', 'harsh climate', 'Limited space', 'Air quality issues', 'Water scarcity', 'Food insecurity'],
      economicModel: 'Colonialism',
      politicalStructure: 'Constitutional monarchy',
      socialOrganization: ['Caste heritage', 'Merit-based', 'Communalism'],
      educationSystem: ['Universal public', 'Apprenticeship under a master'],
      healthcare: ['Universal access', 'Emergency response', 'Research-based medicine'],
      security: ['Professional military', 'Emergency response'],
      resourceManagement: ['Water management', 'Energy distribution', 'Food security', 'Environmental protection'],
      legalFramework: [
        'Habeas corpus',
        'Trial by peers',
        'Ability to appeal judicial judgments',
        'Executive power as final authority',
        'Eligibility for holding elected roles is based upon more than age'
      ]
    }
  }
};

export const getArchetypeTemplate = (type: 'utopia' | 'dystopia' | 'mars'): ArchetypeTemplate => {
  return ARCHETYPE_TEMPLATES[type];
};