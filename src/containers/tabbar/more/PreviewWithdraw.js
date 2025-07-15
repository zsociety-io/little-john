import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import CText from '../../../components/common/CText';
import CDivider from '../../../components/common/CDivider';
import CButton from '../../../components/common/CButton';
import {styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import strings from '../../../i18n/strings';
import {StackNav} from '../../../navigation/NavigationKeys';

export default function PreviewWithdraw({navigation, route}) {
  const {bank} = route.params;
  const colors = useSelector(state => state.theme.theme);

  const onPressWithdrawNow = () =>
    navigation.navigate(StackNav.WithdrawSuccess, {
      bank: bank,
    });

  const DescriptionLine = ({title, desc, color = false}) => {
    return (
      <View style={[styles.rowSpaceBetween]}>
        <CText
          type={'m18'}
          style={styles.flex}
          color={colors.dark ? colors.grayScale3 : colors.grayScale7}>
          {title}
        </CText>
        <CText
          type={'b20'}
          color={color ? color : colors.textColor}
          style={styles.flex}
          align={'right'}>
          {desc}
        </CText>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={strings.previewWithdraw} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <View style={localStyles.userContentContainer}>
          <View style={[styles.rowCenter, styles.flex]}>
            <Image source={bank?.image} style={localStyles.userImage} />
            <View style={[styles.mh10, styles.flex]}>
              <CText type="b20">{bank?.title}</CText>
              <CText type="m14" numberOfLines={1} style={styles.mt5}>
                {bank?.withdraw ? bank?.desc : '⚡️ Instant | Free'}
              </CText>
            </View>
          </View>
          <CText type="m14">{'Withdraw in Dollars'}</CText>
        </View>
        <CDivider style={styles.mv20} />
        <View
          style={[
            localStyles.descContainer,
            {
              backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1,
              borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
            },
          ]}>
          <DescriptionLine
            title={'Account Holder Name'}
            desc={'Andrew Ainsley'}
          />
          <DescriptionLine title={'Account Number'} desc={'888856458259'} />
          <DescriptionLine title={'Bank Name'} desc={bank?.title} />
          <CDivider />
          <DescriptionLine title={'Amount'} desc={'$15,000.00'} />
          <DescriptionLine title={'Withdrawal Fee'} desc={'$20.00'} />
          <CDivider />
          <DescriptionLine
            title={'Total Proceeds'}
            desc={'$15,020.00'}
            color={colors.primary}
          />
        </View>
      </KeyBoardAvoidWrapper>
      <CButton
        title={strings.withdrawNow}
        containerStyle={styles.bottomButton}
        onPress={onPressWithdrawNow}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  userContentContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mv10,
  },
  userImage: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
  },
  descContainer: {
    ...styles.ph20,
    ...styles.pv30,
    ...styles.mv20,
    gap: moderateScale(20),
    borderRadius: moderateScale(24),
    borderWidth: moderateScale(1),
  },
  imageStyle: {
    height: moderateScale(100),
    width: moderateScale(100),
    borderRadius: moderateScale(50),
    ...styles.selfCenter,
    resizeMode: 'contain',
  },
});
