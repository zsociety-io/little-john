import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import { styles } from '../../../themes';
import CDivider from '../../../components/common/CDivider';
import { AppLogoLight } from '../../../assets/svgs';
import { moderateScale } from '../../../common/constants';
import CText from '../../../components/common/CText';
import { aboutOtradeData } from '../../../api/constant';

export default function AboutOtrade() {
  const colors = useSelector(state => state.theme.theme);

  const RenderData = ({ item }) => {
    return (
      <TouchableOpacity style={localStyles.settingsContainer}>
        <CText type="s18">{item}</CText>
        <Ionicons
          name="chevron-forward-outline"
          size={moderateScale(20)}
          color={colors.textColor}
        />
      </TouchableOpacity>
    );
  };

  const RenderHeader = () => {
    return (
      <View>
        <View style={styles.selfCenter}>
          <AppLogoLight
            height={moderateScale(150)}
            width={moderateScale(150)}
          />
          <CText type="b24" align="center" style={styles.mv15}>
            {'Otrade v5.6.9'}
          </CText>
        </View>
        <CDivider />
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={strings.aboutOtrade} />
      <FlatList
        removeClippedSubviews={false} data={aboutOtradeData}
        renderItem={RenderData}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={RenderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ph20}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  settingsContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mt20,
  },
});
