import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState, useMemo, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';

// Custom Imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import { moderateScale } from '../../../common/constants';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import { styles } from '../../../themes';
import CText from '../../../components/common/CText';
import { financialTransactionData } from '../../../api/constant';
import CDivider from '../../../components/common/CDivider';
import ListSkeleton from '../../../components/common/ListSkeleton';

export default function FinancialTransaction() {
  const colors = useSelector(state => state.theme.theme);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [transactionData, setTransactionData] = useState(null);

  // Charger les données de transaction (sans simulation)
  useEffect(() => {
    const loadTransactions = async () => {
      // Ici tu peux ajouter un vrai appel API plus tard
      setTransactionData(financialTransactionData);
    };
    loadTransactions();
  }, []);

  // Filtrage des données selon le filtre sélectionné
  const filteredData = useMemo(() => {
    if (!transactionData) return [];
    
    switch (selectedFilter) {
      case 'stocks':
        return transactionData.filter(
          item => ['stock_purchase', 'stock_sale', 'stock_exchange'].includes(item.transactionType)
        );
      case 'transfers':
        return transactionData.filter(
          item => item.transactionType === 'asset_transfer'
        );
      default:
        return transactionData;
    }
  }, [selectedFilter, transactionData]);

  const RightIcon = () => {
    return (
      <TouchableOpacity style={styles.pr10}>
        <Ionicons
          name="search-outline"
          size={moderateScale(26)}
          color={colors.textColor}
        />
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item, index }) => {
    const isTransfer = item.transactionType === 'asset_transfer';
    
    return (
      <View style={localStyles.settingsContainer}>
        <View style={localStyles.leftContainer}>
          <Image source={item.image} style={localStyles.imageStyle} />
          <View style={[styles.ph10, styles.flex]}>
            <CText type="b18" numberOfLines={1} style={styles.flex}>
              {item.title}
            </CText>
            <CText
              type="m14"
              numberOfLines={1}
              style={[styles.mt5, styles.flex]}
              color={isTransfer ? colors.primary : colors.grayScale6}>
              {isTransfer ? `${item.type.toUpperCase()} Transfer` : item.date}
            </CText>
          </View>
        </View>
        <View style={[styles.ph10, styles.itemsEnd]}>
          <CText 
            type="b18" 
            numberOfLines={1} 
            style={styles.flex}
            color={isTransfer && item.type === 'sent' ? colors.alertColor : colors.textColor}>
            {isTransfer && item.type === 'sent' ? '-' : ''}{item.amount}
          </CText>
          <CText type="m14" numberOfLines={1} style={[styles.mt5, styles.flex]}>
            {isTransfer ? `Fee: $${item.fees.toFixed(2)}` : item.value}
          </CText>
        </View>
      </View>
    );
  };

  const renderFilterButton = (filter, label) => (
    <TouchableOpacity
      style={[
        localStyles.filterButton,
        {
          backgroundColor: selectedFilter === filter 
            ? colors.primary 
            : (colors.dark ? colors.dark3 : colors.grayScale1),
        },
      ]}
      onPress={() => setSelectedFilter(filter)}>
      <CText 
        type="b14" 
        color={selectedFilter === filter ? colors.white : colors.textColor}>
        {label}
      </CText>
    </TouchableOpacity>
  );

  const separatorComponent = () => <CDivider />;

  return (
    <CSafeAreaView>
      <CHeader title={strings.financialTransaction} rightIcon={<RightIcon />} />
      
      {/* Filter Buttons */}
      <View style={localStyles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('stocks', 'Stocks')}
        {renderFilterButton('transfers', 'Transfers')}
      </View>

      {
        (transactionData == null) && (
          <ListSkeleton count={8} height={moderateScale(80)} />
        )
      }
      {
        (transactionData != null) && (
          <FlashList
            removeClippedSubviews={false}
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={10}
            contentContainerStyle={styles.ph20}
            ItemSeparatorComponent={separatorComponent}
          />
        )
      }
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
    ...styles.pv15,
  },
  leftContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.flex,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(20),
    gap: moderateScale(10),
  },
  filterButton: {
    flex: 1,
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
});
