import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {useSelector} from 'react-redux';
import {getHeight, moderateScale} from '../../common/constants';
import {styles} from '../../themes';
import typography from '../../themes/typography';
import CText from './CText';

export default CInput = props => {
  let {
    _value,
    label,
    inputContainerStyle,
    inputBoxStyle,
    toGetTextFieldValue,
    placeHolder,
    keyBoardType,
    _onFocus,
    _onBlur,
    _errorText,
    _autoFocus,
    _isSecure,
    _maxLength,
    _editable = true,
    autoCapitalize,
    required = false,
    labelStyle,
    multiline,
    errorStyle,
    fieldRef,
    insideLeftIcon,
    showError = true,
    rightAccessory,
  } = props;

  const colors = useSelector(state => state.theme.theme);

  // Change Text Input Value
  const onChangeText = val => {
    toGetTextFieldValue(val);
  };

  return (
    <View style={styles.mv10}>
      {label && (
        <View style={[localStyle.labelContainer, labelStyle]}>
          <View style={styles.flexRow}>
            <CText style={localStyle.labelText} type={'b16'}>
              {label}
            </CText>
            {required && (
              <CText style={{color: colors.alertColor}}>{' *'}</CText>
            )}
          </View>
        </View>
      )}
      <View
        style={[
          localStyle.inputContainer,
          {
            borderColor: _errorText ? colors.alertColor : colors.bColor,
            height: multiline ? moderateScale(75) : moderateScale(50),
          },
          inputContainerStyle,
        ]}>
        {insideLeftIcon ? (
          <View style={styles.pl10}>{insideLeftIcon()}</View>
        ) : null}
        <TextInput
          ref={fieldRef}
          secureTextEntry={_isSecure}
          value={_value}
          maxLength={_maxLength}
          defaultValue={_value}
          autoFocus={_autoFocus}
          autoCorrect={false}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={colors.placeHolderColor}
          onChangeText={onChangeText}
          keyboardType={keyBoardType}
          multiline={multiline}
          editable={_editable}
          onFocus={_onFocus}
          onBlur={_onBlur}
          placeholder={placeHolder}
          style={[
            localStyle.inputBox,
            {color: colors.textColor},
            {height: multiline ? getHeight(75) : getHeight(50)},
            inputBoxStyle,
            _editable == false && {color: colors.placeHolderColor},
          ]}
          {...props}
        />
        {/* Right Icon And Content Inside TextInput */}
        <View style={[styles.mr15]}>
          {rightAccessory ? rightAccessory() : null}
        </View>
      </View>
      {/* Error Text Message Of Input */}
      {_errorText && _errorText != '' ? (
        <CText
          style={{
            ...localStyle.errorText,
            ...errorStyle,
            color: colors.alertColor,
          }}>
          {_errorText}
        </CText>
      ) : null}

      {_maxLength && showError && _value?.length > _maxLength ? (
        <CText style={{...localStyle.errorText, ...errorStyle}}>
          It should be maximum {_maxLength} character
        </CText>
      ) : null}
    </View>
  );
};

const localStyle = StyleSheet.create({
  labelText: {
    textAlign: 'left',
    opacity: 0.9,
  },
  inputBox: {
    ...typography.fontSizes.f16,
    ...typography.fontWeights.Regular,
    // ...styles.ph10,
    ...styles.flex,
    ...styles.pt5,
  },
  inputContainer: {
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(6),
    ...styles.rowSpaceBetween,
    ...styles.mt5,
    width: '100%',
  },
  labelContainer: {
    ...styles.mt10,
    ...styles.rowSpaceBetween,
    ...styles.mb5,
  },
  errorText: {
    textAlign: 'left',
    ...typography.fontSizes.f12,
    ...styles.mt5,
    ...styles.ml10,
  },
});
