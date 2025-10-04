import {combineReducers} from 'redux';
import theme from './theme';
import profile from './profile';
import leaderboard from './leaderboard';

const rootReducer = combineReducers({
  theme,
  profile,
  leaderboard,
});

export default rootReducer;
