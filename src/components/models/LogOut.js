// Library import
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import ActionSheet from 'react-native-actions-sheet';

// Local import
import {moderateScale} from '../../common/constants';
import {styles} from '../../themes';
import strings from '../../i18n/strings';
import CButton from '../common/CButton';
import CText from '../common/CText';

const LogOut = props => {
  const {SheetRef, onPressCancel, onPressLogOut} = props;
  const colors = useSelector(state => state.theme.theme);

  return (
    <ActionSheet
      ref={SheetRef}
      containerStyle={[
        localStyles.actionSheetContainer,
        {backgroundColor: colors.backgroundColor},
      ]}>
      <View style={localStyles.bottomContainer}>
        <CText
          type={'M24'}
          style={styles.mt10}
          color={colors.alertColor}
          align={'center'}>
          {strings.logout}
        </CText>
        <View
          style={[
            localStyles.divider,
            {
              backgroundColor: colors.dark
                ? colors.grayScale8
                : colors.grayScale3,
            },
          ]}
        />

        <CText type={'b20'} align={'center'}>
          {strings.logOutDescription}
        </CText>
        <View style={localStyles.btnContainer}>
          <CButton
            title={strings.cancel}
            textType={'b18'}
            color={colors.dark ? colors.whiteColor : colors.primary}
            containerStyle={localStyles.skipBtnContainer}
            bgColor={colors.dark3}
            onPress={onPressCancel}
          />
          <CButton
            title={strings.yesLogOut}
            textType={'b18'}
            color={colors.whiteColor}
            containerStyle={localStyles.skipBtnContainer}
            onPress={onPressLogOut}
          />
        </View>
      </View>
    </ActionSheet>
  );
};

const localStyles = StyleSheet.create({
  actionSheetContainer: {
    ...styles.ph20,
  },
  btnContainer: {
    ...styles.pv30,
    ...styles.rowSpaceAround,
  },
  skipBtnContainer: {
    width: '45%',
  },
  bottomContainer: {
    ...styles.pv10,
  },
  divider: {
    height: moderateScale(1),
    ...styles.mv25,
  },
});

export default LogOut;
