import { Platform, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// Local import
import CText from './common/CText';
import { styles } from '../themes';
import { moderateScale } from '../common/constants';

const ChipsComponent = ({ data }) => {
  const colors = useSelector(state => state.theme.theme);
  const [selectedChips, setSelectedChips] = useState([]);

  const onPressChips = item => {
    if (selectedChips.includes(item)) {
      setSelectedChips(selectedChips.filter(i => i !== item));
    } else {
      setSelectedChips([...selectedChips, item]);
    }
  };

  const RenderChips = ({ item }) => {
    const isSelected = selectedChips.includes(item);
    return (
      <TouchableOpacity
        onPress={() => onPressChips(item)}
        style={[
          localStyles.chipsContainer,
          { borderColor: colors.primary },
          isSelected && { backgroundColor: colors.primary },
          // Corrections spécifiques Android
          Platform.OS === 'android' && {
            elevation: isSelected ? 3 : 1,
            shadowColor: 'transparent', // Désactiver shadow sur Android
          }
        ]}
        activeOpacity={0.7}
      >
        <CText
          type={'s16'}
          color={isSelected ? colors.white : colors.primary}>
          {item}
        </CText>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      removeClippedSubviews={false}
      data={data}
      renderItem={RenderChips}
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      columnWrapperStyle={[
        styles.wrap,
        // Corrections Android pour l'espacement
        Platform.OS === 'android' && {
          paddingHorizontal: moderateScale(5),
        }
      ]}
      numColumns={2}
      contentContainerStyle={Platform.OS === 'android' && styles.ph10}
    />
  );
};

export default React.memo(ChipsComponent);

const localStyles = StyleSheet.create({
  chipsContainer: {
    ...styles.ph20,
    ...styles.pv5,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(25),
    ...styles.mt15,
    ...styles.mh5,
    // Corrections spécifiques Android
    ...Platform.select({
      android: {
        minHeight: moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: moderateScale(8),
        paddingHorizontal: moderateScale(16),
      },
      ios: {
        paddingVertical: moderateScale(5),
        paddingHorizontal: moderateScale(20),
      }
    }),
  },
});
