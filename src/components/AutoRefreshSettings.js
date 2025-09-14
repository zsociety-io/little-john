import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CText from './common/CText';
import { moderateScale } from '../common/constants';
import { styles } from '../themes';

const AutoRefreshSettings = ({ 
  visible, 
  onClose, 
  autoRefresh, 
  setAutoRefresh, 
  refreshInterval, 
  setRefreshInterval 
}) => {
  const colors = useSelector(state => state.theme.theme);
  
  const intervalOptions = [
    { label: 'Once per day', value: 86400 }, // 24 hours in seconds
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={localStyles.modalContainer}>
        <View style={[localStyles.modalContent, { backgroundColor: colors.backgroundColor }]}>
          {/* Header */}
          <View style={localStyles.modalHeader}>
            <CText type={'b20'}>Daily Auto-Refresh Settings</CText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={moderateScale(24)}
                color={colors.textColor}
              />
            </TouchableOpacity>
          </View>

          {/* Auto-refresh toggle */}
          <View style={localStyles.settingRow}>
            <View style={styles.flex}>
              <CText type={'b16'}>Enable Daily Auto-Refresh</CText>
              <CText 
                type={'m12'} 
                color={colors.grayScale6}
                style={styles.mt5}>
                Automatically update stock prices once per day
              </CText>
            </View>
            <TouchableOpacity
              style={[
                localStyles.toggleButton,
                { backgroundColor: autoRefresh ? colors.primary : colors.grayScale4 }
              ]}
              onPress={() => setAutoRefresh(!autoRefresh)}>
              <View
                style={[
                  localStyles.toggleThumb,
                  { 
                    backgroundColor: colors.white,
                    transform: [{ translateX: autoRefresh ? moderateScale(22) : moderateScale(2) }]
                  }
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Interval selection */}
          {autoRefresh && (
            <View style={localStyles.settingSection}>
              <CText type={'b16'} style={styles.mb15}>
                Daily Refresh Settings
              </CText>
              
              {intervalOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    localStyles.intervalOption,
                    { 
                      backgroundColor: refreshInterval === option.value 
                        ? colors.primary + '20' 
                        : 'transparent',
                      borderColor: refreshInterval === option.value 
                        ? colors.primary 
                        : colors.grayScale4
                    }
                  ]}
                  onPress={() => setRefreshInterval(option.value)}>
                  <CText 
                    type={'m14'} 
                    color={refreshInterval === option.value ? colors.primary : colors.textColor}>
                    {option.label}
                  </CText>
                  {refreshInterval === option.value && (
                    <Ionicons
                      name="checkmark"
                      size={moderateScale(18)}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Info section */}
          <View style={localStyles.infoSection}>
            <View style={styles.flexRow}>
              <Ionicons
                name="information-circle-outline"
                size={moderateScale(20)}
                color={colors.primary}
              />
              <View style={[styles.flex, styles.ml10]}>
                <CText type={'m12'} color={colors.grayScale6}>
                  Daily auto-refresh will update stock prices automatically once every 24 hours. 
                  This helps keep your data fresh while conserving battery and data usage.
                </CText>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(40),
    maxHeight: '80%',
  },
  modalHeader: {
    ...styles.rowSpaceBetween,
    ...styles.itemsCenter,
    ...styles.mb20,
  },
  settingRow: {
    ...styles.rowSpaceBetween,
    ...styles.itemsCenter,
    ...styles.mb20,
  },
  toggleButton: {
    width: moderateScale(50),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    position: 'relative',
  },
  toggleThumb: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    position: 'absolute',
  },
  settingSection: {
    ...styles.mb20,
  },
  intervalOption: {
    ...styles.rowSpaceBetween,
    ...styles.itemsCenter,
    ...styles.p15,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    ...styles.mb10,
  },
  infoSection: {
    ...styles.p15,
    borderRadius: moderateScale(10),
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
  },
});

export default AutoRefreshSettings;
