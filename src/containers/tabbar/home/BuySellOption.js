import {
  Image,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CDivider from '../../../components/common/CDivider';
import {styles} from '../../../themes';
import CText from '../../../components/common/CText';
import strings from '../../../i18n/strings';
import CHeader from '../../../components/common/CHeader';
import {getHeight, moderateScale} from '../../../common/constants';
import {buySellCategory} from '../../../api/constant';

const RenderHeader = val => {
  return (
    <CText type="b20" style={styles.mv10}>
      {val?.section?.title}
    </CText>
  );
};

export default function BuySellOption({navigation, route}) {
  const {item} = route?.params;
  const colors = useSelector(state => state.theme.theme);

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity style={localStyles.renderItemContainer}>
        <View style={localStyles.rowStyle}>
          {item?.image}
          <View style={localStyles.innerContainer}>
            <CText type={'b20'} numberOfLines={1}>
              {item.desc}
            </CText>
            <CText type={'m16'} numberOfLines={2} style={styles.mt5}>
              {item.title}
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

  const RenderHeaderComponent = () => {
    return (
      <View>
        <View style={localStyles.settingsContainer}>
          <View style={localStyles.leftContainer}>
            <Image source={item?.image} style={localStyles.imageStyle} />
            <View style={localStyles.stockNameContainer}>
              <CText type="b18" numberOfLines={1}>
                {item?.companyName}
              </CText>
              <CText
                type="m14"
                numberOfLines={1}
                color={colors.dark ? colors.grayScale : colors.grayScale6}
                style={styles.mt10}>
                {item?.stockName}
              </CText>
            </View>
          </View>
          <View style={styles.itemsEnd}>
            <CText
              type="s14"
              color={colors.dark ? colors.grayScale : colors.grayScale6}>
              {strings.marketPrice}
            </CText>
            <CText type="b18" style={styles.mt10}>
              {item?.currentValue}
            </CText>
          </View>
        </View>
        <CDivider style={styles.mv20} />
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader />
      <SectionList
        sections={buySellCategory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={RenderHeader}
        contentContainerStyle={styles.ph20}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<RenderHeaderComponent />}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  settingsContainer: {
    ...styles.rowSpaceBetween,
    ...styles.pv10,
  },
  leftContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    width: '50%',
  },
  stockNameContainer: {
    ...styles.ph10,
    ...styles.flex,
    ...styles.itemsStart,
  },
  imageStyle: {
    height: getHeight(60),
    width: moderateScale(60),
    resizeMode: 'contain',
  },
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
