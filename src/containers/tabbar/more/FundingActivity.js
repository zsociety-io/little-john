import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';

// Custom Imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import { moderateScale } from '../../../common/constants';
import CHeader from '../../../components/common/CHeader';
import { styles } from '../../../themes';
import CDivider from '../../../components/common/CDivider';
import CText from '../../../components/common/CText';
import { fundingActivityData } from '../../../api/constant';
import strings from '../../../i18n/strings';
import { StackNav } from '../../../navigation/NavigationKeys';

export default function FundingActivity({ navigation }) {
  const colors = useSelector(state => state.theme.theme);

  const onPressBack = () => navigation.navigate(StackNav.TabBar);

  const RightIcon = () => {
    return (
      <TouchableOpacity style={styles.pr10}>
        <Ionicons
          name="search-outline"
          size={moderateScale(26)}
          color={colors.textColor}
        />
      </TouchableOpacity>
    );
  };

  const DescriptionLine = ({ title, desc }) => {
    return (
      <View>
        <View style={[styles.rowSpaceBetween, styles.pv20]}>
          <CText
            type={'m18'}
            style={styles.flex}
            color={colors.dark ? colors.grayScale3 : colors.grayScale7}>
            {title}
          </CText>
          <CText type={'b20'} style={styles.flex} align={'right'}>
            {desc}
          </CText>
        </View>
        <CDivider />
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={localStyles.settingsContainer}>
        <View style={localStyles.leftContainer}>
          <Image source={item.bank} style={localStyles.imageStyle} />
          <View style={[styles.ph10, styles.flex]}>
            <CText type="b18">{item.date}</CText>
            <CText
              type="m14"
              numberOfLines={1}
              style={[styles.mt5, styles.flex]}>
              {item.desc}
            </CText>
            <View
              style={[
                localStyles.statusContainer,
                {
                  borderColor:
                    item.status === strings.successful
                      ? colors.primary
                      : colors.redColor,
                },
              ]}>
              <CText
                type="s12"
                color={
                  item.status === strings.successful
                    ? colors.primary
                    : colors.redColor
                }>
                {item.status === strings.successful
                  ? strings.successful
                  : strings.expired}
              </CText>
            </View>
          </View>
        </View>
        <CText type="m14" style={styles.mt5}>
          {item.amount}
        </CText>
      </View>
    );
  };

  const RenderHeader = () => {
    return (
      <View>
        <DescriptionLine title={'Total Deposit'} desc={'$166,745.00'} />
        <DescriptionLine title={'Total Withdraw'} desc={'$49,528.00'} />
        <DescriptionLine title={'Net Deposits'} desc={'$166,745.00'} />
        <DescriptionLine title={'Net Withdraw'} desc={'$49,400.00'} />
        <CText
          type={'b20'}
          style={[styles.mt20, styles.mb10]}
          color={colors.dark ? colors.grayScale3 : colors.grayScale7}>
          {strings.fundingHistory}
        </CText>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader
        onPressBack={onPressBack}
        title={strings.fundingActivity}
        rightIcon={<RightIcon />}
      />
      <FlashList
        removeClippedSubviews={false}
        data={fundingActivityData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={10}
        contentContainerStyle={styles.ph20}
        ListHeaderComponent={RenderHeader}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  imageStyle: {
    height: moderateScale(60),
    width: moderateScale(60),
    resizeMode: 'contain',
  },
  settingsContainer: {
    ...styles.rowSpaceBetween,
    ...styles.pv15,
  },
  leftContainer: {
    ...styles.flexRow,
    ...styles.itemsStart,
    ...styles.flex,
  },
  statusContainer: {
    ...styles.ph5,
    paddingVertical: moderateScale(4),
    ...styles.mt10,
    ...styles.selfStart,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(6),
  },
});
