import {Image, StyleSheet} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import {styles} from '../../../themes';
import CDivider from '../../../components/common/CDivider';
import {moderateScale} from '../../../common/constants';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import CButton from '../../../components/common/CButton';
import {UnlockOffer} from '../../../assets/svgs';
import strings from '../../../i18n/strings';
import {StackNav} from '../../../navigation/NavigationKeys';

export default function WithdrawSuccess({navigation, route}) {
  const {bank} = route.params;
  const colors = useSelector(state => state.theme.theme);

  const onPressContinue = () => navigation.navigate(StackNav.FundingActivity);

  return (
    <CSafeAreaView>
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <Image source={bank?.image} style={localStyles.imageStyle} />
        <CText type={'b32'} align={'center'} style={styles.mt10}>
          {bank?.title}
        </CText>
        <CText
          type={'s18'}
          align={'center'}
          color={colors.dark ? colors.grayScale3 : colors.grayScale6}
          style={styles.mt5}>
          {bank?.desc}
        </CText>
        <CDivider style={styles.mv30} />
        <UnlockOffer style={styles.mv20} />
        <CText
          type={'B46'}
          align={'center'}
          color={colors.primary}
          style={styles.mv20}>
          {'$15,000'}
        </CText>
        <CText type={'B20'} align={'center'} style={styles.mv10}>
          {'Withdrawals are being Processed!'}
        </CText>
        <CText
          type={'m18'}
          align={'center'}
          color={colors.dark ? colors.grayScale3 : colors.grayScale6}
          style={styles.mb30}>
          {
            'The withdrawal process will run 3-4 business days before the funds are deposited into your bank account.'
          }
        </CText>
        <CButton
          title={strings.ok}
          containerStyle={styles.mb15}
          onPress={onPressContinue}
        />
      </KeyBoardAvoidWrapper>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  outerContainer: {
    ...styles.rowSpaceAround,
    ...styles.mt20,
  },
  imageStyle: {
    height: moderateScale(100),
    width: moderateScale(100),
    resizeMode: 'contain',
    borderRadius: moderateScale(50),
    ...styles.selfCenter,
    ...styles.mt15,
  },
  innerContainer: {
    ...styles.center,
  },
});
