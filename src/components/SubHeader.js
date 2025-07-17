import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// Custom Imports
import { styles } from '../themes';
import { deviceWidth, getHeight, moderateScale } from '../common/constants';

function SubHeader({ status, nothing }) {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();

  return (
    <View style={localStyles.root}>
      <TouchableOpacity style={styles.pr10} onPress={goBack}>
        <Ionicons
          name="arrow-back-outline"
          size={moderateScale(26)}
          color={colors.textColor}
        />
      </TouchableOpacity>
      {!nothing && (<>
        <View
          style={[
            localStyles.OuterContainer,
            {
              backgroundColor: colors.dark ? colors.dark3 : colors.grayScale2,
            },
          ]}>
          <View
            style={[
              localStyles.InnerContainer,
              {
                width: status === 0 ? 0 : (deviceWidth / 2) * (status / 19),
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>
        <View style={styles.pr10} onPress={goBack}>
          <Ionicons
            name="arrow-back-outline"
            size={moderateScale(26)}
            color={colors.textRevertColor}
          />
        </View>
      </>)}
    </View>
  );
}

export default React.memo(SubHeader);

const localStyles = StyleSheet.create({
  root: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    ...styles.pv15,
  },
  OuterContainer: {
    width: deviceWidth / 2,
    height: getHeight(12),
    borderRadius: moderateScale(6),
  },
  InnerContainer: {
    height: getHeight(12),
    borderRadius: moderateScale(6),
  },
});
