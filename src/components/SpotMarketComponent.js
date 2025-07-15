import {StyleSheet, View} from 'react-native';
import React from 'react';

// Custom components
import CText from './common/CText';
import {styles} from '../themes';

const SpotMarketComponent = ({item}) => {
  return (
    <View style={localStyles.spotMarketStatsContainer}>
      <View style={localStyles.leftContainer}>
        {item?.icon}
        <CText type="b18" style={styles.ph10} numberOfLines={1}>
          {item?.title}
        </CText>
      </View>
      <CText type="b18">{item?.value}</CText>
    </View>
  );
};

export default React.memo(SpotMarketComponent);

const localStyles = StyleSheet.create({
  spotMarketStatsContainer: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    ...styles.pv10,
  },
  leftContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    width: '50%',
  },
});
