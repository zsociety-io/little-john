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
    if (!publicKey) {
      console.error('Public key is required');
      return { 
        isVerified: false, 
        error: 'Public key is required',
        state: null 
      };
    }

    const response = await callApiGet(`campaign/${publicKey}/seeker-status`);
    
    // Handle backend error responses
    if (response.error) {
      console.error('Backend error:', response.error);
      return {
        isVerified: false,
        error: response.error,
        state: response.state,
      };
    }

    // Parse successful response
    return {
      isVerified: response.verified || false,
      state: response.state,
      publicKey: response.publicKey,
      timestamp: response.timestamp,
      record: response.record,
    };
  } catch (error) {
    console.error('Erreur statut vérification:', error);
    return { 
      isVerified: false,
      error: error.message || 'Network error',
      state: null,
    };
  }
};

// Obtenir le statut de vérification du Seeker Genesis Token
export const getSeekerGenesisStatus = async (publicKey) => {
  try {
    if (!publicKey) {
      console.error('Public key is required');
      return { 
        isVerified: false, 
        error: 'Public key is required',
        state: null 
      };
    }

    const response = await callApiGet(`campaign/${publicKey}/seeker-status`);
    
    // Handle backend error responses
    if (response.error) {
      console.error('Backend error:', response.error);
      return {
        isVerified: false,
        error: response.error,
        state: response.state,
      };
    }

    // Parse successful response
    return {
      isVerified: response.verified || false,
      state: response.state,
      publicKey: response.publicKey,
      timestamp: response.timestamp,
      record: response.record,
    };
  } catch (error) {
    console.error('Erreur statut Seeker Genesis:', error);
    return { 
      isVerified: false,
      error: error.message || 'Network error',
      state: null,
    };
  }
};

// Récupérer le leaderboard de la campagne
export const getLeaderboard = async (limit = 10) => {
  try {
    // Validate limit
    if (limit < 1 || limit > 100) {
      console.error('Limit must be between 1 and 100');
      return {
        success: false,
        error: 'Limit must be between 1 and 100',
        leaderboard: [],
      };
    }

    const response = await callApiGet(`campaign/leaderboard?limit=${limit}`);
    
    // Handle backend error responses
    if (response.error) {
      console.error('Leaderboard error:', response.error);
      return {
        success: false,
        error: response.error,
        message: response.message,
        leaderboard: [],
      };
    }

    // Parse successful response
    return {
      success: true,
      season: response.season,
      leaderboard: response.leaderboard || [],
      meta: response.meta,
    };
  } catch (error) {
    console.error('Erreur récupération leaderboard:', error);
    return {
      success: false,
      error: error.message || 'Network error',
      leaderboard: [],
    };
  }
};

// Récupérer le score d'un utilisateur spécifique
export const getUserScore = async (publicKey) => {
  try {
    // Validate public key
    if (!publicKey) {
      console.error('Public key is required');
      return {
        success: false,
        error: 'Public key is required',
        wallet: null,
      };
    }

    const response = await callApiGet(`campaign/${publicKey}/score`);
    
    // Handle backend error responses
    if (response.error) {
      console.error('User score error:', response.error);
      return {
        success: false,
        error: response.error,
        message: response.message,
        wallet: null,
      };
    }

    // Parse successful response
    return {
      success: true,
      season: response.season || 'global',
      wallet: {
        address: response.wallet.address,
        score: response.wallet.score || 0,
        rank: response.wallet.rank || null,
        lastUpdate: response.wallet.lastUpdate,
      },
    };
  } catch (error) {
    console.error('Erreur récupération score utilisateur:', error);
    return {
      success: false,
      error: error.message || 'Network error',
      wallet: null,
    };
  }
};
