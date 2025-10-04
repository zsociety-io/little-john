import images from '../../assets/images';
import {
  SET_LEADERBOARD_DATA,
  SET_LEADERBOARD_LOADING,
  SET_LEADERBOARD_ERROR,
  SET_USER_STATS,
} from '../types';

// Données par défaut (fallback)
const defaultLeaderboard = [
  {
    id: 1,
    image: images.userLight,
    name: '4Nd1h1uA4qDbX4YAGn5ZsJg2r3bUnyBzh3e9CvKJ3RkL',
    points: 2450,
  },
  {
    id: 2,
    image: images.userLight,
    name: 'Gf8ZkdLVVqRvg1wQnF3LwDk3LEkc6u5tQm8qKrRcdt8A',
    points: 2380,
  },
  {
    id: 3,
    image: images.userLight,
    name: 'HfCyM7yo1cDUmTf9j1DwWGBHkAojbQmUjWqG1xEV7k6U',
    points: 2210,
  },
  {
    id: 4,
    image: images.userLight,
    name: '9fFkYQkq6yZhMvA1zJ4YY5EzNHpJ7P4vEtH5b1tVqUQy',
    points: 2150,
  },
  {
    id: 5,
    image: images.userLight,
    name: 'Ck12hzyhZXf2w8vvyoa5uY2rqzVV7ArFHwD9Z7A8QUX9',
    points: 2090,
  },
  {
    id: 6,
    image: images.userLight,
    name: 'Aq1eCbrUQtvQo8Y5qpGh8ZhoVY5x4BBTk7gT6qVzS3sG',
    points: 1980,
  },
  {
    id: 7,
    image: images.userLight,
    name: '6XyGpWbweYfpZTLrPiV1frbyYyt7SRZY3P8UGdpwnKQA',
    points: 1920,
  },
  {
    id: 8,
    image: images.userLight,
    name: '3pHq2n67PgF2ox9hF1w92NRNk7hLCnFoMf9zqCPGEA3X',
    points: 1850,
  },
  {
    id: 9,
    image: images.userLight,
    name: 'DZKbqJzWhuS1KDvUuDYsUYrB1ozKDTFXGzPoVGgLG3kR',
    points: 1780,
  },
  {
    id: 10,
    image: images.userLight,
    name: 'GvnswKEArhA4YxVcBxyvCRSqpHn9DbvGMY6ukHJqEJMX',
    points: 1720,
  },
];

const initialState = {
  data: defaultLeaderboard,
  loading: false,
  error: null,
  lastUpdate: null,
  userStats: {
    position: 23,
    points: 1250,
    name: 'You',
  },
};

const leaderboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LEADERBOARD_DATA:
      return {
        ...state,
        data: action.payload,
        lastUpdate: new Date().toISOString(),
      };

    case SET_LEADERBOARD_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case SET_LEADERBOARD_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case SET_USER_STATS:
      return {
        ...state,
        userStats: action.payload,
      };

    default:
      return state;
  }
};

export default leaderboardReducer;
