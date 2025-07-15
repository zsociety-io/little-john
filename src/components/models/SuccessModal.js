// Libraries import
import React from 'react';
import {Modal, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {ModalIcon} from '../../assets/svgs';

// Local import
import {getHeight, moderateScale} from '../../common/constants';
import strings from '../../i18n/strings';
import {commonColor, styles} from '../../themes';
import CButton from '../common/CButton';
import CText from '../common/CText';

const SuccessModal = props => {
  const colors = useSelector(state => state.theme.theme);

  const {
    visible,
    onPressModalClose,
    btnText1 = false,
    btnText2 = false,
    onPressBtn1,
    onPressBtn2,
    headerTitle,
    subTitle,
    itemImage,
  } = props;
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <TouchableOpacity
        style={localStyles.modalMainContainer}
        activeOpacity={1}
        onPress={onPressModalClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={[localStyles.root, {backgroundColor: colors.inputBg}]}>
          {!!itemImage ? itemImage : <ModalIcon style={styles.selfCenter} />}
          <CText
            type={'b24'}
            align={'center'}
            color={colors.primary}
            style={styles.mt25}>
            {!!headerTitle ? headerTitle : strings.successful}
          </CText>
          <CText type={'r16'} align={'center'} style={styles.mt20}>
            {!!subTitle ? subTitle : strings.modalDesc}
          </CText>
          {!!btnText1 && (
            <CButton
              title={btnText1}
              type={'S14'}
              containerStyle={localStyles.signBtnContainer}
              onPress={onPressBtn1}
            />
          )}
          {!!btnText2 && (
            <CButton
              title={btnText2}
              type={'S14'}
              color={!!colors.dark ? colors.white : colors.primary}
              bgColor={colors.dark3}
              containerStyle={localStyles.signBtnContainer}
              onPress={onPressBtn2}
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  root: {
    ...styles.p30,
    ...styles.mh30,
    borderRadius: moderateScale(52),
    ...styles.alignCenter,
  },
  modalMainContainer: {
    ...styles.flex,
    ...styles.center,
    backgroundColor: commonColor.modalBg,
  },
  signBtnContainer: {
    ...styles.mt20,
    height: getHeight(45),
    borderRadius: moderateScale(22),
    width: moderateScale(190),
    ...styles.selfCenter,
  },
});

export default SuccessModal;
