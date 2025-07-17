//Library Imports
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

//Local Imports
import { getHeight, moderateScale } from '../../common/constants';
import { styles } from '../../themes';
import CText from './CText';

export default function CButton({
  title,
  type = 'S16',
  color,
  onPress,
  containerStyle,
  style,
  icon = null,
  frontIcon = null,
  bgColor = null,
  children,
  disabled = false, // <-- add disabled prop
  ...props
}) {
  const colors = useSelector(state => state.theme.theme);

  return (
    <TouchableOpacity
      style={[
        localStyle.btnContainer,
        styles.rowCenter,
        containerStyle,
        bgColor
          ? { backgroundColor: bgColor }
          : { backgroundColor: colors.primary },
        disabled && { opacity: 0.5 }, // <-- visual feedback when disabled
      ]}
      onPress={onPress}
      disabled={disabled} // <-- functionality
      {...props}>
      {frontIcon}
      <CText type={type} style={style} color={color ? color : colors.white}>
        {title}
      </CText>
      {icon}
      {children}
    </TouchableOpacity>
  );
}

const localStyle = StyleSheet.create({
  btnContainer: {
    height: getHeight(55),
    borderRadius: moderateScale(55) / 2,
  },
});
