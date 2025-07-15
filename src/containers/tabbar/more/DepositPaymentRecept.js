import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import CText from '../../../components/common/CText';
import {styles} from '../../../themes';
import {getHeight, moderateScale} from '../../../common/constants';
import CDivider from '../../../components/common/CDivider';
import {CopyIcon} from '../../../assets/svgs';
import CButton from '../../../components/common/CButton';
import strings from '../../../i18n/strings';
import {StackNav} from '../../../navigation/NavigationKeys';

export default function DepositPaymentRecept({navigation, route}) {
  const {bank} = route.params;
  const colors = useSelector(state => state.theme.theme);

  const onPressPaymentMade = () => navigation.navigate(StackNav.TabBar);

  const onPressPaymentLater = () => navigation.navigate(StackNav.TabBar);

  const DescriptionLine = ({title, desc}) => {
    return (
      <View style={[styles.rowSpaceBetween, styles.flex]}>
        <CText
          type={'m18'}
          style={styles.flex}
          numberOfLines={1}
          color={colors.dark ? colors.grayScale3 : colors.grayScale7}>
          {title}
        </CText>
        <View style={[styles.flexRow, styles.itemsCenter, styles.flex]}>
          <CText
            type={'b20'}
            numberOfLines={1}
            style={styles.flex}
            align={'right'}>
            {desc}
          </CText>
          <TouchableOpacity style={styles.ml10}>
            <CopyIcon />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <Image
          source={bank.image}
          style={localStyles.imageStyle}
          resizeMode="contain"
        />
        <CText type="b20" align={'center'} style={styles.mv20}>
          {bank.title}
        </CText>
        <CText
          type="b20"
          color={colors.dark ? colors.grayScale3 : colors.grayScale7}
          align={'center'}>
          {'Awaiting funds ⏳'}
        </CText>
        <CText type="s18" align={'center'} style={styles.mt15}>
          {
            'We have created a virtual account for you. Log into your online banking and make the transfer.'
          }
        </CText>
        <CDivider style={styles.mv30} />
        <CText type="b32" align={'center'}>
          {'Instructions'}
        </CText>
        <View
          style={[
            localStyles.descContainer,
            {
              backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1,
              borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
            },
          ]}>
          <DescriptionLine title={'Amount'} desc={'$20,000'} />
          <DescriptionLine title={'Virtual Account no'} desc={'777791524465'} />
        </View>
      </KeyBoardAvoidWrapper>
      <CButton
        title={strings.iMadePayment}
        containerStyle={styles.bottomButton}
        onPress={onPressPaymentMade}
      />
      <CButton
        type={'S16'}
        title={strings.makePaymentLater}
        bgColor={colors.dark3}
        color={colors.primaryLightBtn}
        style={styles.ml10}
        containerStyle={styles.bottomButton}
        onPress={onPressPaymentLater}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  imageStyle: {
    width: moderateScale(100),
    height: getHeight(100),
    ...styles.mt20,
    ...styles.selfCenter,
  },
  descContainer: {
    ...styles.p15,
    ...styles.mv20,
    gap: moderateScale(15),
    borderRadius: moderateScale(24),
    borderWidth: moderateScale(1),
  },
});
