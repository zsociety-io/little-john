import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import { styles } from '../../../themes';
import CText from '../../../components/common/CText';
import { leaderboardData } from '../../../api/constant';
import { moderateScale } from '../../../common/constants';
import { useSelector } from 'react-redux';

export default function MyRewards() {
  const colors = useSelector(state => state.theme.theme);
  
  // Données simulées pour l'utilisateur actuel
  const currentUser = {
    position: 23,
    points: 1250,
    name: "You"
  };

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
    return (
      <View>
        <View style={localStyles.pointsContainer}>
          <CText type={'b32'} color={colors.primary} align={'center'}>
            {currentUser.points} {strings.points}
          </CText>
          <CText type={'r16'} align={'center'} style={styles.mt5}>
            {strings.yourCurrentPosition} #{currentUser.position}
          </CText>
        </View>

        <CText type={'b24'} style={[styles.mt20, styles.mb10]}>
          🏆 {strings.top10Leaderboard}</CText>
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
        <FlatList
          removeClippedSubviews={false} 
          data={leaderboardData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ph20}
          ListHeaderComponent={<RenderHeader />}
        />
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
