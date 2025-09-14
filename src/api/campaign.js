import { callApiPost, callApiGet } from './index';

// Vérifier si l'utilisateur possède un Seeker Phone
export const verifySeekerPhone = async (publicKey) => {
  try {
    const response = await callApiPost('campaign/verify-seeker-phone/', {
      publicKey: publicKey.toString(),
    });
    
    return {
      success: response.hasSeeker || false,
      points: response.pointsAwarded || 100,
      message: response.message || 'Vérification terminée',
    };
  } catch (error) {
    console.error('Erreur vérification Seeker Phone:', error);
    throw error;
  }
};

// Obtenir le statut de vérification de l'utilisateur
export const getSeekerVerificationStatus = async (publicKey) => {
  try {
    const response = await callApiGet(`campaign/seeker-status/${publicKey}/`);
    return {
      isVerified: response.isVerified || false,
      verificationDate: response.verificationDate,
      pointsEarned: response.pointsEarned || 0,
    };
  } catch (error) {
    console.error('Erreur statut vérification:', error);
    return { isVerified: false };
  }
};
