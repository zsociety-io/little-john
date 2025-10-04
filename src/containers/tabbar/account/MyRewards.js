import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import { styles } from '../../../themes';
import CText from '../../../components/common/CText';
import { moderateScale } from '../../../common/constants';
import { useSelector } from 'react-redux';

export default function MyRewards() {
  const colors = useSelector(state => state.theme.theme);
  
  // Récupérer les données depuis Redux (déjà chargées au niveau de l'App)
  const { data: leaderboard, loading, error, lastUpdate, userStats } = useSelector(
    state => state.leaderboard
  );
  
  // Pas de useEffect ici ! Les données viennent directement de Redux
  // Le refresh automatique est géré au niveau de l'App (index.js)

  const RightIcon = () => {
    return (
      <TouchableOpacity>
        <Ionicons name="search-outline" size={26} color={'#000'} />
      </TouchableOpacity>
    );
  };

const renderItem = ({ item, index }) => {
  const position = index + 1;
  let positionIcon = null;

  // Icônes pour le podium
  if (position === 1) positionIcon = '🥇';
  else if (position === 2) positionIcon = '🥈';
  else if (position === 3) positionIcon = '🥉';

  return (
    <View
      style={[
        localStyles.userStyle,
        {
          borderBottomColor: colors.dark3,
          backgroundColor: position <= 3 ? colors.primary + '10' : 'transparent'
        },
      ]}>
      <View style={localStyles.rowStyle}>
        <View style={localStyles.positionContainer}>
          {positionIcon ? (
            <CText type={'b20'}>{positionIcon}</CText>
          ) : (
            <CText type={'b18'} color={colors.primary}>#{position}</CText>
          )}
        </View>
        <Image source={item.image} style={localStyles.userImageStyle} />
        <View style={{ flex: 1 }}>
          <CText
            type={'b18'}
            numberOfLines={1}
            style={styles.flex}>
            {item.name}
          </CText>
          <CText
            type={'b16'}
            color={colors.primary}
            style={styles.mt5}>
            {item.points} {strings.points}
          </CText>
        </View>
      </View>
    </View>
  );
};

  const RenderHeader = () => {
    const lastUpdateDate = lastUpdate ? new Date(lastUpdate) : null;
    
    return (
      <View>
        <View style={localStyles.pointsContainer}>
          <CText type={'b32'} color={colors.primary} align={'center'}>
            {userStats.points} {strings.points}
          </CText>
          <CText type={'r16'} align={'center'} style={styles.mt5}>
            {strings.yourCurrentPosition} #{userStats.position}
          </CText>
          {lastUpdateDate && (
            <CText type={'m12'} color={colors.grayScale5} align={'center'} style={styles.mt10}>
              Last updated: {lastUpdateDate.toLocaleTimeString()}
            </CText>
          )}
          {error && (
            <CText type={'m12'} color={colors.error || colors.red} align={'center'} style={styles.mt5}>
              ⚠️ {error}
            </CText>
          )}
        </View>

        <CText type={'b24'} style={[styles.mt20, styles.mb10]}>
          🏆 {strings.top10Leaderboard}
        </CText>
      </View>
    );
  };

  const ButtonIcon = () => {
    return (
      <Ionicons
        name={'trophy'}
        size={moderateScale(24)}
        color={colors.white}
      />
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={strings.leaderboard} rightIcon={<RightIcon />} />
      <View style={styles.flex}>
        {loading ? (
          <View style={[styles.flex, styles.center]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <CText type={'m16'} color={colors.grayScale5} style={styles.mt10}>
              Loading leaderboard...
            </CText>
          </View>
        ) : (
          <FlatList
            removeClippedSubviews={false} 
            data={leaderboard}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ph20}
            ListHeaderComponent={<RenderHeader />}
          />
        )}
      </View>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  userImageStyle: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    resizeMode: 'contain',
    ...styles.mr15,
  },
  rowStyle: {
    ...styles.flexRow,
    ...styles.itemsCenter,
  },
  userStyle: {
    ...styles.rowSpaceBetween,
    ...styles.pv15,
    ...styles.ph10,
    borderBottomWidth: 1,
    borderRadius: moderateScale(8),
    marginVertical: moderateScale(2),
  },
  positionContainer: {
    width: moderateScale(40),
    alignItems: 'center',
    ...styles.mr10,
  },
  pointsContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: moderateScale(20),
    borderRadius: moderateScale(15),
    marginBottom: moderateScale(20),
  },
});
