import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

// Custom Imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import CText from '../../../components/common/CText';
import {styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import CDivider from '../../../components/common/CDivider';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import CButton from '../../../components/common/CButton';
import {StackNav} from '../../../navigation/NavigationKeys';
import strings from '../../../i18n/strings';

export default function ConfirmBankAccountDetail({route, navigation}) {
  const {bank} = route.params;
  const colors = useSelector(state => state.theme.theme);

  const DescriptionLine = ({title, desc}) => {
    return (
      <View style={[styles.rowSpaceBetween]}>
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
    );
  };

  const onPressButton = () => {
    if (bank?.added) {
      navigation.navigate(StackNav.DepositToOtradePayment, {
        bank: {
          title: bank.title,
          image: bank.image,
          desc: 'Account ending *3278',
          withdraw: true,
        },
      });
    } else {
      navigation.navigate(StackNav.WithdrawalAccount);
    }
  };

  return (
    <CSafeAreaView>
      <CHeader />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <CText type={'B30'}>
          {bank?.added ? 'Andrew Ainsley 🇺🇸' : 'Confirm your bank details 🏦'}
        </CText>
        <View
          style={[
            localStyles.descContainer,
            {
              backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1,
              borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
            },
          ]}>
          <Image
            source={bank?.image}
            style={localStyles.imageStyle}
            resizeMode="contain"
          />
          <CDivider />
          <DescriptionLine
            title={'Account Holder Name'}
            desc={'Andrew Ainsley'}
          />
          <DescriptionLine title={'Account Number'} desc={'888856458259'} />
          <DescriptionLine title={'Bank Name'} desc={bank?.title} />
          <DescriptionLine title={'City'} desc={'New York'} />
          <DescriptionLine title={'Currency'} desc={'USD'} />
          <DescriptionLine title={'Account Type'} desc={'Savings'} />
        </View>
      </KeyBoardAvoidWrapper>
      <CButton
        title={bank?.added ? strings.sendThisAccount : strings.addAccount}
        containerStyle={styles.bottomButton}
        onPress={onPressButton}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
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
