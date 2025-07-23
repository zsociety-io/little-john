import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import CText from '../../../components/common/CText';
import CButton from '../../../components/common/CButton';
import CDivider from '../../../components/common/CDivider';
import { styles } from '../../../themes';
import { moderateScale, getHeight } from '../../../common/constants';
import strings from '../../../i18n/strings';
import { StackNav } from '../../../navigation/NavigationKeys';
import { myStockData } from '../../../api/constant';

const TransferEntryScreen = ({ navigation, route }) => {
  const colors = useSelector(state => state.theme.theme);
  
  // États du formulaire
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  // Écouter les paramètres de retour de l'AssetSelector
  useEffect(() => {
    if (route.params?.selectedAsset) {
      setSelectedAsset(route.params.selectedAsset);
      // Nettoyer le paramètre pour éviter les re-sélections
      navigation.setParams({ selectedAsset: undefined });
    }
  }, [route.params?.selectedAsset, navigation]);
  
  // Données des actifs
  const availableAssets = useMemo(() => {
    return myStockData.map((stock, index) => ({
      ...stock,
      uniqueId: `asset_${index}_${stock.stockName || 'unknown'}_${stock.companyName || 'company'}`,
      originalId: stock.id, // Gardons l'ID original pour référence
      stakedAmount: stock.staking?.staked || '$0.00',
      unstakedAmount: stock.staking?.unstaked || stock.currentValue,
      totalAmount: stock.currentValue,
      type: 'stock',
    }));
  }, []);

  // Calculs dynamiques
  const estimatedFees = useMemo(() => {
    if (!amount || !selectedAsset) return '$0.00';
    const numAmount = parseFloat(amount) || 0;
    const feeRate = 0.001; // 0.1% de frais
    return `$${(numAmount * feeRate).toFixed(2)}`;
  }, [amount, selectedAsset]);

  const totalDebited = useMemo(() => {
    if (!amount || !selectedAsset) return '$0.00';
    const numAmount = parseFloat(amount) || 0;
    const fees = parseFloat(estimatedFees.replace('$', '')) || 0;
    return `$${(numAmount + fees).toFixed(2)}`;
  }, [amount, estimatedFees, selectedAsset]);

  const newBalance = useMemo(() => {
    if (!amount || !selectedAsset) return selectedAsset?.currentValue || '$0.00';
    const currentBalance = parseFloat(selectedAsset.currentValue.replace('$', '').replace(',', '')) || 0;
    const debited = parseFloat(totalDebited.replace('$', '')) || 0;
    return `$${(currentBalance - debited).toFixed(2)}`;
  }, [amount, totalDebited, selectedAsset]);

  // Validation du formulaire
  const isFormValid = useMemo(() => {
    return selectedAsset && 
           recipientAddress.length > 10 && 
           amount && 
           parseFloat(amount) > 0;
  }, [selectedAsset, recipientAddress, amount]);

  // Fonctions utilitaires
  const setPercentageAmount = (percentage) => {
    if (!selectedAsset) return;
    const currentBalance = parseFloat(selectedAsset.currentValue.replace('$', '').replace(',', '')) || 0;
    const newAmount = (currentBalance * percentage / 100).toFixed(2);
    setAmount(newAmount);
  };

  const onPressNext = () => {
    if (!isFormValid) return;
    
    const transferData = {
      asset: selectedAsset,
      recipientAddress,
      amount: parseFloat(amount),
      estimatedFees,
      totalDebited,
      newBalance,
    };
    
    navigation.navigate(StackNav.TransferConfirm, { transferData });
  };

  const handleAssetSelection = (asset) => {
    setSelectedAsset(asset);
  };

  return (
    <CSafeAreaView>
      <CHeader
        title="Transfer Assets"
        isHideBack={false}
        onPressBack={() => navigation.goBack()}
      />
      
      <ScrollView 
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.ph20}>
          
          {/* Sélecteur d'actif */}
          <View style={styles.mb20}>
            <CText type="b18" style={styles.mb10}>
              Select Asset
            </CText>
            <TouchableOpacity
              style={[
                localStyles.selector,
                {
                  backgroundColor: colors.dark ? colors.dark2 : colors.white,
                  borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
                },
              ]}
              onPress={() => {
                navigation.navigate('AssetSelector', {
                  availableAssets: availableAssets
                });
              }}>
              {selectedAsset ? (
                <View style={localStyles.selectedAsset}>
                  <View style={localStyles.selectedAssetRow}>
                    <Image 
                      source={selectedAsset.image} 
                      style={localStyles.selectedAssetImage}
                    />
                    <View style={localStyles.selectedAssetInfo}>
                      <CText type="b16">{selectedAsset.stockName}</CText>
                      <CText type="m14" color={colors.grayScale5}>
                        {selectedAsset.companyName}
                      </CText>
                      <CText type="s12" color={colors.grayScale5}>
                        Balance: {selectedAsset.currentValue}
                      </CText>
                    </View>
                  </View>
                </View>
              ) : (
                <CText type="m16" color={colors.grayScale5}>
                  Choose an asset to transfer
                </CText>
              )}
              <Ionicons
                name="chevron-down-outline"
                size={moderateScale(20)}
                color={colors.grayScale5}
              />
            </TouchableOpacity>
          </View>

          {/* Champ adresse destinataire */}
          <View style={styles.mb20}>
            <CText type="b18" style={styles.mb10}>
              Recipient Address
            </CText>
            <View style={localStyles.inputContainer}>
              <TextInput
                style={[
                  localStyles.input,
                  {
                    backgroundColor: colors.dark ? colors.dark2 : colors.white,
                    borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
                    color: colors.textColor,
                  },
                ]}
                placeholder="Enter Solana wallet address"
                placeholderTextColor={colors.grayScale5}
                value={recipientAddress}
                onChangeText={setRecipientAddress}
                multiline
              />
              <TouchableOpacity style={localStyles.qrButton}>
                <Ionicons
                  name="qr-code-outline"
                  size={moderateScale(20)}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Champ montant */}
          <View style={styles.mb20}>
            <CText type="b18" style={styles.mb10}>
              Amount
            </CText>
            <View style={localStyles.amountSection}>
              <TextInput
                style={[
                  localStyles.amountInput,
                  {
                    backgroundColor: colors.dark ? colors.dark2 : colors.white,
                    borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
                    color: colors.textColor,
                  },
                ]}
                placeholder="0.00"
                placeholderTextColor={colors.grayScale5}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[
                  localStyles.maxButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => setPercentageAmount(100)}>
                <CText type="b14" color={colors.white}>
                  MAX
                </CText>
              </TouchableOpacity>
            </View>
            
            {/* Boutons rapides */}
            <View style={localStyles.quickButtons}>
              {[25, 50, 75, 100].map((percentage) => (
                <TouchableOpacity
                  key={percentage}
                  style={[
                    localStyles.quickButton,
                    {
                      backgroundColor: colors.dark ? colors.dark3 : colors.grayScale1,
                    },
                  ]}
                  onPress={() => setPercentageAmount(percentage)}>
                  <CText type="m14">{percentage}%</CText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Résumé dynamique */}
          {selectedAsset && amount && (
            <View style={[
              localStyles.summary,
              {
                backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1,
                borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
              },
            ]}>
              <CText type="b18" style={styles.mb15}>
                Transfer Summary
              </CText>
              
              <View style={localStyles.summaryRow}>
                <CText type="m16" color={colors.grayScale6}>
                  Amount
                </CText>
                <CText type="b16">${amount}</CText>
              </View>
              
              <View style={localStyles.summaryRow}>
                <CText type="m16" color={colors.grayScale6}>
                  Estimated Fees
                </CText>
                <CText type="b16">{estimatedFees}</CText>
              </View>
              
              <CDivider style={styles.mv10} />
              
              <View style={localStyles.summaryRow}>
                <CText type="b16">
                  Total Debited
                </CText>
                <CText type="b16" color={colors.primary}>
                  {totalDebited}
                </CText>
              </View>
              
              <View style={localStyles.summaryRow}>
                <CText type="m16" color={colors.grayScale6}>
                  New Balance
                </CText>
                <CText type="b16">{newBalance}</CText>
              </View>
            </View>
          )}
        </View>

        {/* Boutons d'action */}
        <View style={localStyles.buttonContainer}>
          <CButton
            title="Cancel"
            type="S16"
            color={colors.grayScale6}
            bgColor={colors.dark ? colors.dark3 : colors.grayScale2}
            containerStyle={localStyles.cancelButton}
            onPress={() => navigation.goBack()}
          />
          <CButton
            title="Next"
            containerStyle={localStyles.nextButton}
            onPress={onPressNext}
            disabled={!isFormValid}
          />
        </View>
      </ScrollView>
    </CSafeAreaView>
  );
};

export default TransferEntryScreen;

const localStyles = StyleSheet.create({
  selector: {
    borderWidth: 1,
    borderRadius: moderateScale(12),
    padding: moderateScale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: moderateScale(60),
  },
  selectedAsset: {
    flex: 1,
  },
  selectedAssetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedAssetImage: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    marginRight: moderateScale(12),
  },
  selectedAssetInfo: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: moderateScale(12),
    padding: moderateScale(15),
    fontSize: moderateScale(16),
    textAlignVertical: 'top',
    minHeight: moderateScale(80),
  },
  qrButton: {
    marginLeft: moderateScale(10),
    padding: moderateScale(15),
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: moderateScale(12),
    padding: moderateScale(15),
    fontSize: moderateScale(18),
    textAlign: 'right',
  },
  maxButton: {
    marginLeft: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(15),
    borderRadius: moderateScale(8),
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(15),
  },
  quickButton: {
    flex: 1,
    marginHorizontal: moderateScale(5),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  summary: {
    borderWidth: 1,
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    marginBottom: moderateScale(20),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(10),
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(20),
    gap: moderateScale(15),
  },
  cancelButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
});
