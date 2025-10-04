import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLeaderboard, getUserScore } from '../../api/campaign';
import {
  SET_LEADERBOARD_DATA,
  SET_LEADERBOARD_LOADING,
  SET_LEADERBOARD_ERROR,
  SET_USER_STATS,
} from '../types';

const LEADERBOARD_STORAGE_KEY = '@leaderboard_data';
const USER_STATS_STORAGE_KEY = '@user_stats';

// Action pour mettre à jour les données du leaderboard
export const setLeaderboardData = (data) => ({
  type: SET_LEADERBOARD_DATA,
  payload: data,
});

export const setLeaderboardLoading = (loading) => ({
  type: SET_LEADERBOARD_LOADING,
  payload: loading,
});

export const setLeaderboardError = (error) => ({
  type: SET_LEADERBOARD_ERROR,
  payload: error,
});

export const setUserStats = (stats) => ({
  type: SET_USER_STATS,
  payload: stats,
});

// Charger les données depuis AsyncStorage au démarrage
export const loadLeaderboardFromStorage = () => async (dispatch) => {
  try {
    const [leaderboardJson, userStatsJson] = await Promise.all([
      AsyncStorage.getItem(LEADERBOARD_STORAGE_KEY),
      AsyncStorage.getItem(USER_STATS_STORAGE_KEY),
    ]);

    if (leaderboardJson) {
      const leaderboard = JSON.parse(leaderboardJson);
      dispatch(setLeaderboardData(leaderboard));
      console.log('Leaderboard chargé depuis le cache');
    }

    if (userStatsJson) {
      const userStats = JSON.parse(userStatsJson);
      dispatch(setUserStats(userStats));
      console.log('User stats chargées depuis le cache');
    }
  } catch (error) {
    console.error('Erreur lors du chargement du cache:', error);
  }
};

// Récupérer les données depuis l'API et les sauvegarder
export const fetchAndSaveLeaderboard = (limit = 10) => async (dispatch) => {
  dispatch(setLeaderboardLoading(true));

  try {
    console.log('Récupération du leaderboard depuis l\'API...');
    const response = await getLeaderboard(limit);

    if (response.success && response.leaderboard.length > 0) {
      // Transformer les données pour l'affichage
      const transformedData = response.leaderboard.map((entry, index) => ({
        id: index + 1,
        name: entry.wallet,
        points: entry.score,
        image: require('../../assets/images/userLight.png'), // Image par défaut
        rank: entry.rank,
        lastUpdate: entry.lastUpdate,
      }));

      // Sauvegarder dans Redux
      dispatch(setLeaderboardData(transformedData));

      // Sauvegarder dans AsyncStorage
      await AsyncStorage.setItem(
        LEADERBOARD_STORAGE_KEY,
        JSON.stringify(transformedData)
      );

      dispatch(setLeaderboardError(null));
      console.log('Leaderboard mis à jour et sauvegardé');
    } else if (response.leaderboard.length === 0) {
      console.log('Leaderboard vide');
      dispatch(setLeaderboardError('Leaderboard is empty'));
    } else {
      console.error('Erreur API:', response.error);
      dispatch(setLeaderboardError(response.error || 'Failed to load leaderboard'));
    }
  } catch (error) {
    console.error('Erreur réseau:', error);
    dispatch(setLeaderboardError('Network error. Using cached data.'));
  } finally {
    dispatch(setLeaderboardLoading(false));
  }
};

// Sauvegarder les stats utilisateur
export const saveUserStats = (stats) => async (dispatch) => {
  try {
    dispatch(setUserStats(stats));
    await AsyncStorage.setItem(USER_STATS_STORAGE_KEY, JSON.stringify(stats));
    console.log('User stats sauvegardées');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des stats:', error);
  }
};

// Récupérer le score de l'utilisateur depuis l'API
export const fetchAndSaveUserScore = (publicKey) => async (dispatch) => {
  try {
    if (!publicKey) {
      console.error('❌ Public key is required for fetching user score');
      return;
    }

    console.log('🔄 Récupération du score utilisateur depuis l\'API...');
    const response = await getUserScore(publicKey);

    if (response.success && response.wallet) {
      const { wallet } = response;
      
      // Transformer les données pour le format attendu
      const userStats = {
        address: wallet.address,
        points: wallet.score || 0,
        position: wallet.rank || null,
        name: 'You',
        lastUpdate: wallet.lastUpdate,
      };

      // Sauvegarder dans Redux et AsyncStorage
      await dispatch(saveUserStats(userStats));
      console.log('✅ Score utilisateur mis à jour:', userStats);
    } else {
      console.warn('⚠️ Score utilisateur non trouvé ou erreur:', response.error);
      // Si l'utilisateur n'a pas de score, on garde les valeurs par défaut
    }
  } catch (error) {
    console.error('❌ Erreur récupération score utilisateur:', error);
  }
};
