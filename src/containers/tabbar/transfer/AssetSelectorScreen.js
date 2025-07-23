import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import CText from '../../../components/common/CText';
import { styles } from '../../../themes';
import { moderateScale } from '../../../common/constants';

const AssetSelectorScreen = ({ route, navigation }) => {
  const colors = useSelector(state => state.theme.theme);
  const { availableAssets } = route.params;

  const handleAssetSelect = (asset) => {
    // Naviguer de retour en passant l'asset sélectionné
    navigation.navigate('TransferEntry', { selectedAsset: asset });
  };

  const renderAssetItem = ({ item }) => (
    <TouchableOpacity
      style={[
        localStyles.assetItem,
        {
          backgroundColor: colors.dark ? colors.dark2 : colors.white,
          borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
        },
      ]}
      onPress={() => handleAssetSelect(item)}>
      <View style={localStyles.assetInfo}>
        <Image 
          source={item.image} 
          style={localStyles.assetIconImage}
        />
        <View style={localStyles.assetDetails}>
          <CText type="b18" numberOfLines={1}>
            {item.companyName}
          </CText>
          <CText type="m16" color={colors.grayScale5}>
            {item.stockName}
          </CText>
          <CText type="m14" color={colors.grayScale5}>
            Balance: {item.currentValue}
          </CText>
          {item.staking && (
            <CText type="s12" color={colors.grayScale5}>
              Staked: {item.stakedAmount} | Unstaked: {item.unstakedAmount}
            </CText>
          )}
        </View>
      </View>
      <Ionicons
        name="chevron-forward-outline"
        size={moderateScale(20)}
        color={colors.grayScale5}
      />
    </TouchableOpacity>
  );

  return (
    <CSafeAreaView>
      <CHeader
        title="Select Asset"
        isHideBack={false}
        onPressBack={() => navigation.goBack()}
      />
      
      <View style={[styles.flex, styles.ph20]}>
        <CText type="b18" style={[styles.mb20, styles.mt10]}>
          Available Assets ({availableAssets.length})
        </CText>
        
        <FlatList
          data={availableAssets}
          renderItem={renderAssetItem}
          keyExtractor={(item) => item.uniqueId}
          showsVerticalScrollIndicator={false}
          style={styles.flex}
        />
      </View>
    </CSafeAreaView>
  );
};

export default AssetSelectorScreen;

const localStyles = StyleSheet.create({
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(15),
    marginBottom: moderateScale(10),
    borderRadius: moderateScale(12),
    borderWidth: 1,
  },
  assetInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIconImage: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    marginRight: moderateScale(15),
    resizeMode: 'contain',
  },
  assetDetails: {
    flex: 1,
  },
});
