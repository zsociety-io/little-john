import { callApiPost, callApiGet } from './index';

// Vérifier si l'utilisateur possède un Seeker Phone
export const verifySeekerPhone = async (publicKey) => {
  try {
    const response = await callApiPost('campaign/verify-seeker-phone', {
      publicKey: publicKey.toString(),
    });
    
    return {
      success: response.hasSeeker || response.success || false,
      points: response.pointsAwarded || 100,
      isAlreadyVerified: response.isAlreadyVerified || false,
      message: response.message || 'Vérification terminée',
    };
  } catch (error) {
    console.error('Erreur vérification Seeker Phone:', error);
    throw error;
  }
};

// Vérifier si l'utilisateur possède le Seeker Genesis Token NFT
export const verifySeekerGenesisToken = async (publicKey) => {
  try {
    const response = await callApiPost('campaign/verify-seeker-phone', {
      publicKey: publicKey.toString(),
    });
    
    return {
      success: response.hasSeeker || response.success || false,
      points: response.pointsAwarded || 500, // 500 points pour le Seeker Genesis Token
      isAlreadyVerified: response.isAlreadyVerified || false,
      message: response.message || 'Vérification terminée',
    };
  } catch (error) {
    console.error('Erreur vérification Seeker Genesis Token:', error);
    throw error;
  }
};

// Obtenir le statut de vérification de l'utilisateur
export const getSeekerVerificationStatus = async (publicKey) => {
  try {
    const response = await callApiGet(`campaign/seeker-status/${publicKey}`);
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

// Obtenir le statut de vérification du Seeker Genesis Token
export const getSeekerGenesisStatus = async (publicKey) => {
  try {
    const response = await callApiGet(`campaign/seeker-status/${publicKey}`);
    return {
      isVerified: response.isVerified || false,
      verificationDate: response.verificationDate,
      pointsEarned: response.pointsEarned || 0,
    };
  } catch (error) {
    console.error('Erreur statut Seeker Genesis:', error);
    return { isVerified: false };
  }
};
