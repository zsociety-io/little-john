import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';

// Local Imports
import { moderateScale } from '../../../common/constants';
import CHeader from '../../../components/common/CHeader';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import { commonColor, styles } from '../../../themes';
import { notificationData } from '../../../api/constant';
import strings from '../../../i18n/strings';

export default function Notification() {
  const colors = useSelector(state => state.theme.theme);

  const RightIcon = () => {
    return (
      <TouchableOpacity style={styles.ph10}>
        <Ionicons
          name="settings-outline"
          size={moderateScale(26)}
          color={colors.textColor}
        />
      </TouchableOpacity>
    );
  };

  const renderNotification = ({ item, index }) => {
    return (
      <View style={localStyles.settingsContainer}>
        <TouchableOpacity style={styles.rowSpaceBetween}>
          <View style={localStyles.leftContainer}>
            {item?.icon}
            <View style={localStyles.stockNameContainer}>
              <CText type="b18" numberOfLines={1}>
                {item?.title}
              </CText>
              <CText
                type="m14"
                numberOfLines={1}
                color={colors.dark ? colors.grayScale3 : colors.grayScale6}
                style={styles.mt10}>
                {item?.time}
              </CText>
            </View>
          </View>
          {item?.isNew && (
            <View style={localStyles.newContainer}>
              <CText type="b12" color={colors.white}>
                {'New'}
              </CText>
            </View>
          )}
        </TouchableOpacity>
        <CText
          type="r14"
          color={colors.dark ? colors.grayScale : colors.grayScale8}
          style={styles.mt10}
          numberOfLines={2}>
          {item?.desc}
        </CText>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={strings.notification} rightIcon={<RightIcon />} />
      <FlashList
        removeClippedSubviews={false}
        data={notificationData}
        renderItem={renderNotification}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={6}
        contentContainerStyle={styles.flex}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  settingsContainer: {
    ...styles.pv10,
    ...styles.ph20,
  },
  leftContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
  },
  stockNameContainer: {
    ...styles.ph10,
    ...styles.itemsStart,
  },
  newContainer: {
    ...styles.p5,
    ...styles.itemsEnd,
    backgroundColor: commonColor.primary,
    borderRadius: moderateScale(5),
  },
});
