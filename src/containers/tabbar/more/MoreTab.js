import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import { AppLogoLight } from '../../../assets/svgs';
import { moderateScale } from '../../../common/constants';
import { styles } from '../../../themes';
import CText from '../../../components/common/CText';
import { moreData } from '../../../api/constant';
import CDivider from '../../../components/common/CDivider';

const MoreTab = ({ navigation }) => {
  const colors = useSelector(state => state.theme.theme);
  const [extraData, setExtraData] = useState(false);

  useEffect(() => {
    setExtraData(!extraData);
  }, [colors]);

  const onPressItem = item => navigation.navigate(item.route);

  const LeftIcon = () => {
    return (
      <View style={styles.pr10}>
        <AppLogoLight height={moderateScale(30)} width={moderateScale(30)} />
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onPressItem(item)}
        style={localStyles.renderItemContainer}>
        <View style={localStyles.rowStyle}>
          {item.icon}
          <View style={localStyles.innerContainer}>
            <CText type={'b20'} numberOfLines={1}>
              {item.title}
            </CText>
            <CText type={'m16'} numberOfLines={2} style={styles.mt5}>
              {item.desc}
            </CText>
          </View>
        </View>
        <Ionicons
          name="chevron-forward-outline"
          size={moderateScale(22)}
          color={colors.primary}
        />
      </TouchableOpacity>
    );
  };

  const separatorComponent = () => <CDivider />;

  return (
    <CSafeAreaView>
      <CHeader
        isHideBack={true}
        title={strings.more}
        isLeftIcon={<LeftIcon />}
      />
      <FlashList
        removeClippedSubviews={false}
        data={moreData}
        renderItem={renderItem}
        extraData={extraData}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ph20}
        estimatedItemSize={10}
        ItemSeparatorComponent={separatorComponent}
      />
    </CSafeAreaView>
  );
};

export default MoreTab;

const localStyles = StyleSheet.create({
  renderItemContainer: {
    ...styles.rowSpaceBetween,
    ...styles.pv15,
  },
  innerContainer: {
    ...styles.ph15,
    ...styles.flex,
  },
  rowStyle: {
    ...styles.flex,
    ...styles.flexRow,
    ...styles.itemsCenter,
  },
});
