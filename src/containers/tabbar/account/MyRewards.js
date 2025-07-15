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
import {styles} from '../../../themes';
import CText from '../../../components/common/CText';
import {myRewardsData} from '../../../api/constant';
import {moderateScale} from '../../../common/constants';
import {useSelector} from 'react-redux';
import CButton from '../../../components/common/CButton';

export default function MyRewards() {
  const colors = useSelector(state => state.theme.theme);

  const onPressContinue = () => {};

  const RightIcon = () => {
    return (
      <TouchableOpacity>
        <Ionicons name="search-outline" size={26} color={'#000'} />
      </TouchableOpacity>
    );
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={[
          localStyles.userStyle,
          {
            borderBottomColor: colors.dark3,
          },
        ]}>
        <View style={localStyles.rowStyle}>
          <Image source={item.image} style={localStyles.userImageStyle} />
          <CText
            type={'b18'}
            nunberOfLines={1}
            // style={styles.flex}
          >
            {item.name}
          </CText>
        </View>
        <View style={localStyles.rowStyle}>
          <CText type={'r16'}>{item.earning}</CText>
          <Ionicons
            name="chevron-forward-outline"
            size={moderateScale(24)}
            color={colors.primary}
            style={styles.ml10}
          />
        </View>
      </View>
    );
  };

  const RenderHeader = () => {
    return (
      <View>
        <CText type={'B30'}>{strings.myRewardsTitle}</CText>
        <CText style={styles.mv15} type={'r18'}>
          {strings.myRewardsDesc}
        </CText>
      </View>
    );
  };

  const ButtonIcon = () => {
    return (
      <Ionicons
        name={'paper-plane'}
        size={moderateScale(24)}
        color={colors.white}
      />
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={strings.myRewards} rightIcon={<RightIcon />} />
      <View style={styles.flex}>
        <FlatList
          data={myRewardsData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ph20}
          ListHeaderComponent={<RenderHeader />}
        />
      </View>
      <CButton
        title={strings.shareMyInviteLink}
        style={styles.ml10}
        containerStyle={localStyles.bottomButton}
        onPress={onPressContinue}
        frontIcon={<ButtonIcon />}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  userImageStyle: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    resizeMode: 'contain',
    ...styles.mr10,
  },
  rowStyle: {
    ...styles.flexRow,
    ...styles.itemsCenter,
  },
  userStyle: {
    ...styles.rowSpaceBetween,
    ...styles.pv15,
    borderBottomWidth: 1,
  },
  bottomButton: {
    ...styles.mv20,
    ...styles.mh20,
  },
});
