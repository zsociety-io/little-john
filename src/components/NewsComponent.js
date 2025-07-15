import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

// Custom components
import CText from './common/CText';
import {styles} from '../themes';

const NewsComponent = ({item}) => {
  const colors = useSelector(state => state.theme.theme);

  const subTextColor = colors.dark ? colors.grayScale3 : colors.grayScale6;
  return (
    <View style={localStyles.newsContainer}>
      <View style={styles.rowSpaceBetween}>
        <CText type="s14" numberOfLines={1}>
          {item?.title}
        </CText>
        <CText type="m14" color={subTextColor}>
          {item?.time}
        </CText>
      </View>
      <CText type="s18" numberOfLines={2} style={styles.mt10}>
        {item?.desc}
      </CText>
    </View>
  );
};

export default React.memo(NewsComponent);

const localStyles = StyleSheet.create({
  newsContainer: {
    ...styles.ph20,
    ...styles.pv10,
  },
});
