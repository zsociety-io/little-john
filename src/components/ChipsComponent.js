import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
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
    return (
      <TouchableOpacity
        onPress={() => onPressChips(item)}
        style={[
          localStyles.chipsContainer,
          { borderColor: colors.primary },
          selectedChips.includes(item) && { backgroundColor: colors.primary },
        ]}
      >
        <TouchableOpacity
          onPress={() => onPressChips(item)}
          style={[
            localStyles.chipsContainer,
            { borderColor: colors.primary },
            selectedChips.includes(item) && { backgroundColor: colors.primary },
          ]}>
          <CText
            type={'s16'}
            color={selectedChips.includes(item) ? colors.white : colors.primary}>
            {item}
          </CText>
        </TouchableOpacity>
      </TouchableOpacity >
    );
  };

  return (
    <FlatList
      removeClippedSubviews={false} data={data}
      renderItem={RenderChips}
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      columnWrapperStyle={styles.wrap}
      numColumns={2}
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
  },
});
