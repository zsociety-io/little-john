import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';

// Custom Imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import {moderateScale} from '../../../common/constants';
import {styles} from '../../../themes';
import CText from '../../../components/common/CText';
import {paymentMethodsData} from '../../../api/constant';
import CDivider from '../../../components/common/CDivider';

export default function PaymentMethods() {
  const colors = useSelector(state => state.theme.theme);

  const RightIcon = () => {
    return (
      <TouchableOpacity style={styles.pr10}>
        <Ionicons
          name="add"
          size={moderateScale(26)}
          color={colors.textColor}
        />
      </TouchableOpacity>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={localStyles.settingsContainer}>
        <View style={localStyles.leftContainer}>
          <Image source={item.image} style={localStyles.imageStyle} />
          <CText type="b18" style={[styles.ph10, styles.flex]}>
            {item.title}
          </CText>
        </View>
        <CText type="b16" color={colors.primary}>
          {strings.connected}
        </CText>
      </View>
    );
  };

  const separatorComponent = () => <CDivider />;

  return (
    <CSafeAreaView>
      <CHeader title={strings.paymentMethods} rightIcon={<RightIcon />} />
      <FlashList
        data={paymentMethodsData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={10}
        contentContainerStyle={styles.ph20}
        ItemSeparatorComponent={separatorComponent}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  imageStyle: {
    height: moderateScale(60),
    width: moderateScale(60),
    resizeMode: 'contain',
  },
  settingsContainer: {
    ...styles.rowSpaceBetween,
    ...styles.pv10,
  },
  leftContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.flex,
  },
});
