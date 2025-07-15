import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';

//Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import CText from '../../components/common/CText';
import {commonColor, styles} from '../../themes';
import CButton from '../../components/common/CButton';
import strings from '../../i18n/strings';
import {StackNav} from '../../navigation/NavigationKeys';
import {getHeight, moderateScale} from '../../common/constants';
import CHeader from '../../components/common/CHeader';
import {DashedLine, UnlockOffer} from '../../assets/svgs';

export default UnlockScreen = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);

  const onPressContinue = () => navigation.navigate(StackNav.SetPinScreen);

  const RewardUnlock = ({bgColor, txtColor, price, desc}) => {
    return (
      <View style={localStyles.descriptionContainer}>
        <View
          style={[
            localStyles.rewardPrice,
            {
              backgroundColor: bgColor,
              shadowColor: bgColor,
            },
          ]}>
          <CText type={'B24'} color={txtColor}>
            {price}
          </CText>
        </View>
        <CText type={'S18'} style={styles.flex}>
          {desc}
        </CText>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <CText type={'B30'}>
          {strings.congratulationsYouGet}
          <CText type={'B30'} color={commonColor.primary}>
            {strings.unlockAnother}
          </CText>
        </CText>
        <UnlockOffer style={styles.mv20} />
        <RewardUnlock
          bgColor={commonColor.primary}
          txtColor={commonColor.white}
          price={'$5'}
          desc={strings.rewardDesc1}
        />
        <View style={localStyles.dividerLineStyle}>
          <DashedLine style={styles.mt10} />
        </View>
        <RewardUnlock
          bgColor={commonColor.primaryTransparent}
          txtColor={commonColor.primary}
          price={'$2'}
          desc={strings.rewardDesc2}
        />
      </KeyBoardAvoidWrapper>
      <CButton
        title={strings.makeDeposit}
        containerStyle={styles.bottomButton}
        onPress={onPressContinue}
      />
      <CButton
        type={'S16'}
        title={strings.skipThisStep}
        bgColor={colors.dark3}
        color={colors.primary}
        style={styles.ml10}
        containerStyle={styles.bottomButton}
        onPress={onPressContinue}
      />
    </CSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  rewardPrice: {
    height: moderateScale(80),
    width: moderateScale(80),
    borderRadius: moderateScale(40),
    ...styles.center,
    ...styles.mr20,
    shadowColor: commonColor.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  descriptionContainer: {
    ...styles.flex,
    ...styles.flexRow,
    ...styles.itemsCenter,
  },
  dividerLineStyle: {
    height: getHeight(50),
    width: moderateScale(80),
    ...styles.center,
  },
});
