import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import CText from '../../../components/common/CText';
import CDivider from '../../../components/common/CDivider';
import { styles } from '../../../themes';
import { moderateScale, getHeight } from '../../../common/constants';
import strings from '../../../i18n/strings';
import { financialTransactionData } from '../../../api/constant';

const TransferHistoryScreen = ({ navigation }) => {
  const colors = useSelector(state => state.theme.theme);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter only transfer transactions from financial data
  const transferHistory = financialTransactionData.filter(
    transaction => transaction.transactionType === 'asset_transfer'
  );

  const filteredHistory = useMemo(() => {
    if (selectedFilter === 'all') return transferHistory;
    return transferHistory.filter(transfer => transfer.type === selectedFilter);
  }, [selectedFilter, transferHistory]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (address) => {
    if (address.length <= 20) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return colors.primary;
      case 'pending':
        return colors.yellow || '#FFA500';
      case 'failed':
        return colors.alertColor;
      default:
        return colors.grayScale5;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'pending':
        return 'time-outline';
      case 'failed':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const openTransferDetail = (transfer) => {
    setSelectedTransfer(transfer);
    setShowDetailModal(true);
  };

  const renderTransferItem = ({ item }) => (
    <TouchableOpacity
      style={[
        localStyles.transferItem,
        {
          backgroundColor: colors.dark ? colors.dark2 : colors.white,
          borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
        },
      ]}
      onPress={() => openTransferDetail(item)}>
      
      {/* Transfer Type Icon */}
      <View style={[
        localStyles.typeIcon,
        {
          backgroundColor: item.type === 'sent' 
            ? colors.alertColor + '20' 
            : colors.primary + '20'
        }
      ]}>
        <Ionicons
          name={item.type === 'sent' ? 'arrow-up' : 'arrow-down'}
          size={moderateScale(20)}
          color={item.type === 'sent' ? colors.alertColor : colors.primary}
        />
      </View>

      {/* Transfer Info */}
      <View style={localStyles.transferInfo}>
        <View style={localStyles.transferHeader}>
          <CText type="b16" numberOfLines={1}>
            {item.title}
          </CText>
          <View style={localStyles.statusContainer}>
            <Ionicons
              name={getStatusIcon(item.status)}
              size={moderateScale(12)}
              color={getStatusColor(item.status)}
            />
            <CText 
              type="s12" 
              color={getStatusColor(item.status)}
              style={styles.ml5}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </CText>
          </View>
        </View>
        
        <CText type="m14" color={colors.grayScale6} numberOfLines={1}>
          {item.title.split(':')[0]} Transfer
        </CText>
        
        <View style={localStyles.transferDetails}>
          <CText type="m12" color={colors.grayScale5}>
            {item.type === 'sent' 
              ? `To: ${formatAddress(item.recipientAddress)}`
              : `From: ${formatAddress(item.senderAddress)}`
            }
          </CText>
          <CText type="m12" color={colors.grayScale5}>
            {formatDate(item.date)}
          </CText>
        </View>
      </View>

      {/* Amount */}
      <View style={localStyles.amountContainer}>
        <CText 
          type="b16" 
          color={item.type === 'sent' ? colors.alertColor : colors.primary}>
          {item.type === 'sent' ? '-' : '+'}{item.amount}
        </CText>
        <CText type="s12" color={colors.grayScale5}>
          Fee: ${item.fees.toFixed(2)}
        </CText>
      </View>
    </TouchableOpacity>
  );

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

  return (
    <CSafeAreaView>
      <CHeader
        title="Transfer History"
        isHideBack={false}
        onPressBack={() => navigation.goBack()}
      />
      
      {/* Filter Buttons */}
      <View style={localStyles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('sent', 'Sent')}
        {renderFilterButton('received', 'Received')}
      </View>

      {/* Transfer List */}
      <FlashList
        data={filteredHistory}
        renderItem={renderTransferItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        estimatedItemSize={100}
        contentContainerStyle={styles.ph20}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={[styles.center, styles.mt50]}>
            <Ionicons
              name="document-outline"
              size={moderateScale(60)}
              color={colors.grayScale5}
            />
            <CText type="b18" color={colors.grayScale5} style={styles.mt20}>
              No transfers found
            </CText>
            <CText type="m14" color={colors.grayScale5} align="center" style={styles.mt10}>
              Your transfer history will appear here
            </CText>
          </View>
        }
      />

      {/* Transfer Detail Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        presentationStyle="pageSheet">
        <CSafeAreaView>
          <CHeader
            title="Transfer Details"
            isHideBack={false}
            onPressBack={() => setShowDetailModal(false)}
          />
          
          {selectedTransfer && (
            <View style={styles.ph20}>
              
              {/* Status Header */}
              <View style={[
                localStyles.statusHeader,
                {
                  backgroundColor: getStatusColor(selectedTransfer.status) + '20',
                  borderColor: getStatusColor(selectedTransfer.status),
                },
              ]}>
                <View style={localStyles.statusInfo}>
                  <Ionicons
                    name={getStatusIcon(selectedTransfer.status)}
                    size={moderateScale(24)}
                    color={getStatusColor(selectedTransfer.status)}
                  />
                  <CText 
                    type="b18" 
                    color={getStatusColor(selectedTransfer.status)}
                    style={styles.ml10}>
                    {selectedTransfer.status.charAt(0).toUpperCase() + selectedTransfer.status.slice(1)}
                  </CText>
                </View>
                <CText type="m14" color={colors.grayScale6}>
                  {formatDate(selectedTransfer.date)}
                </CText>
              </View>

              {/* Transfer Details */}
              <View style={[
                localStyles.detailSection,
                {
                  backgroundColor: colors.dark ? colors.dark2 : colors.white,
                  borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
                },
              ]}>
                <View style={localStyles.detailRow}>
                  <CText type="m16" color={colors.grayScale6}>Type</CText>
                  <CText type="b16">
                    {selectedTransfer.type === 'sent' ? 'Sent' : 'Received'}
                  </CText>
                </View>
                
                <View style={localStyles.detailRow}>
                  <CText type="m16" color={colors.grayScale6}>Asset</CText>
                  <CText type="b16">{selectedTransfer.title.split(':')[0]}</CText>
                </View>
                
                <View style={localStyles.detailRow}>
                  <CText type="m16" color={colors.grayScale6}>Amount</CText>
                  <CText type="b18" color={colors.primary}>
                    {selectedTransfer.amount}
                  </CText>
                </View>
                
                <View style={localStyles.detailRow}>
                  <CText type="m16" color={colors.grayScale6}>Network Fees</CText>
                  <CText type="b16">${selectedTransfer.fees.toFixed(2)}</CText>
                </View>
                
                <CDivider style={styles.mv10} />
                
                <View style={localStyles.detailRow}>
                  <CText type="m16" color={colors.grayScale6}>
                    {selectedTransfer.type === 'sent' ? 'Recipient' : 'Sender'}
                  </CText>
                  <CText type="m14" style={localStyles.addressDetail}>
                    {selectedTransfer.type === 'sent' 
                      ? selectedTransfer.recipientAddress
                      : selectedTransfer.senderAddress
                    }
                  </CText>
                </View>
                
                <View style={localStyles.detailRow}>
                  <CText type="m16" color={colors.grayScale6}>Transaction Hash</CText>
                  <TouchableOpacity>
                    <CText type="m14" color={colors.primary} style={localStyles.addressDetail}>
                      {selectedTransfer.transactionHash}
                    </CText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </CSafeAreaView>
      </Modal>
    </CSafeAreaView>
  );
};

export default TransferHistoryScreen;

const localStyles = StyleSheet.create({
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
  transferItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(15),
    marginBottom: moderateScale(10),
    borderRadius: moderateScale(12),
    borderWidth: 1,
  },
  typeIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(15),
  },
  transferInfo: {
    flex: 1,
  },
  transferHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(5),
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transferDetails: {
    marginTop: moderateScale(5),
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  statusHeader: {
    borderWidth: 1,
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    marginBottom: moderateScale(20),
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(5),
  },
  detailSection: {
    borderWidth: 1,
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: moderateScale(15),
  },
  addressDetail: {
    flex: 1,
    textAlign: 'right',
    marginLeft: moderateScale(10),
    fontSize: moderateScale(12),
  },
});
