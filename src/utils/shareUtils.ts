export interface SharedNationData {
  name: string;
  assessmentData: any;
  customPolicies?: any;
  createdAt: string;
}

export const parseSharedNationFromUrl = async (url: string): Promise<SharedNationData | null> => {
  try {
    // Extract the shared parameter from URL
    const urlObj = new URL(url);
    const sharedData = urlObj.searchParams.get('shared');
    
    if (!sharedData) {
      return null;
    }
    
    // Decode the base64 data
    const decodedData = JSON.parse(atob(sharedData));
    
    // Validate the structure
    if (!decodedData.name || !decodedData.assessmentData) {
      return null;
    }
    
    return {
      name: decodedData.name,
      assessmentData: decodedData.assessmentData,
      customPolicies: decodedData.customPolicies || {},
      createdAt: decodedData.createdAt || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error parsing shared nation URL:', error);
    return null;
  }
};