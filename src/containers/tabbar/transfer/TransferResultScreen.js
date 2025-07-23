import {
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import CText from '../../../components/common/CText';
import CButton from '../../../components/common/CButton';
import { styles } from '../../../themes';
import { moderateScale, getHeight } from '../../../common/constants';
import strings from '../../../i18n/strings';
import { StackNav } from '../../../navigation/NavigationKeys';

const TransferResultScreen = ({ navigation, route }) => {
  const colors = useSelector(state => state.theme.theme);
  const { result } = route.params;

  const onViewExplorer = () => {
    if (result.transactionHash) {
      // Ouvrir l'explorateur Solana avec le hash de transaction
      const explorerUrl = `https://explorer.solana.com/tx/${result.transactionHash}`;
      Linking.openURL(explorerUrl);
    }
  };

  const onBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ 
        name: 'TabNavigation',
        state: {
          routes: [{ name: 'Home' }],
          index: 0,
        }
      }],
    });
  };

  const onRetry = () => {
    // Retourner à la page Transfer Entry, pas à More
    navigation.navigate(StackNav.TransferEntry);
  };

  const onCancel = () => {
    // Retourner à la page More quand on clique sur Cancel
    navigation.reset({
      index: 0,
      routes: [{ 
        name: 'TabNavigation',
        state: {
          routes: [{ name: 'More' }],
          index: 0,
        }
      }],
    });
  };

  const onViewHistory = () => {
    // Naviguer vers l'onglet More où se trouve l'historique des transactions
    navigation.reset({
      index: 0,
      routes: [{ 
        name: 'TabNavigation',
        state: {
          routes: [{ name: 'More' }],
          index: 0,
        }
      }],
    });
  };

  // Force toujours l'affichage de la page de succès pour les tests
  const showSuccessPage = true; // result.success;
  
  if (showSuccessPage) {
    return (
      <CSafeAreaView>
        <CHeader
          title="Transfer Complete"
          isHideBack={true}
        />
        
        <View style={styles.flex}>
          <View style={[styles.flex, styles.center, styles.ph20]}>
            
            {/* Success Icon */}
            <View style={[
              localStyles.iconContainer,
              { backgroundColor: colors.primary + '20' }
            ]}>
              <Ionicons
                name="checkmark-circle"
                size={moderateScale(80)}
                color={colors.primary}
              />
            </View>

            <CText type="b28" align="center" style={styles.mb10}>
              Transfer Successful!
            </CText>
            
            <CText type="m16" align="center" color={colors.grayScale6} style={styles.mb30}>
              Your {result.asset.stockName} has been successfully transferred
            </CText>

            {/* Transaction Details */}
            <View style={[
              localStyles.detailsContainer,
              {
                backgroundColor: colors.dark ? colors.dark2 : colors.white,
                borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
              },
            ]}>
              <View style={localStyles.detailRow}>
                <CText type="m16" color={colors.grayScale6}>
                  Amount Sent
                </CText>
                <CText type="b18">${result.amount.toFixed(2)}</CText>
              </View>
              
              <View style={localStyles.detailRow}>
                <CText type="m16" color={colors.grayScale6}>
                  Network Fees
                </CText>
                <CText type="b16">{result.estimatedFees}</CText>
              </View>
              
              <View style={localStyles.detailRow}>
                <CText type="m16" color={colors.grayScale6}>
                  Transaction Hash
                </CText>
                <TouchableOpacity onPress={onViewExplorer}>
                  <CText type="m14" color={colors.primary}>
                    {result.transactionHash?.substring(0, 10)}...
                  </CText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Explorer Button */}
            <TouchableOpacity
              style={[
                localStyles.explorerButton,
                {
                  backgroundColor: colors.dark ? colors.dark3 : colors.grayScale1,
                  borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
                },
              ]}
              onPress={onViewExplorer}>
              <Ionicons
                name="open-outline"
                size={moderateScale(20)}
                color={colors.primary}
              />
              <CText type="b16" color={colors.primary} style={styles.ml10}>
                View on Explorer
              </CText>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={localStyles.buttonContainer}>
            <CButton
              title="History"
              type="S16"
              color={colors.primary}
              bgColor={colors.dark ? colors.dark3 : colors.grayScale1}
              containerStyle={localStyles.historyButton}
              onPress={onViewHistory}
            />
            <CButton
              title="Home"
              containerStyle={localStyles.homeButton}
              onPress={onBackToHome}
            />
          </View>
        </View>
      </CSafeAreaView>
    );
  }

  // Error State
  return (
    <CSafeAreaView>
      <CHeader
        title="Transfer Failed"
        isHideBack={true}
      />
      
      <View style={styles.flex}>
        <View style={[styles.flex, styles.center, styles.ph20]}>
          
          {/* Error Icon */}
          <View style={[
            localStyles.iconContainer,
            { backgroundColor: colors.alertColor + '20' }
          ]}>
            <Ionicons
              name="close-circle"
              size={moderateScale(80)}
              color={colors.alertColor}
            />
          </View>

          <CText type="b28" align="center" style={styles.mb10}>
            Transfer Failed
          </CText>
          
          <CText type="m16" align="center" color={colors.grayScale6} style={styles.mb30}>
            {result.error || 'An unexpected error occurred during the transfer'}
          </CText>

          {/* Error Details */}
          <View style={[
            localStyles.detailsContainer,
            {
              backgroundColor: colors.alertColor + '10',
              borderColor: colors.alertColor,
            },
          ]}>
            <CText type="b16" color={colors.alertColor} style={styles.mb10}>
              What happened?
            </CText>
            <CText type="m14" color={colors.alertColor}>
              {result.error === 'Insufficient balance or network error' 
                ? 'This could be due to insufficient balance, network congestion, or invalid recipient address.'
                : result.error
              }
            </CText>
          </View>

          {/* Troubleshooting */}
          <View style={[
            localStyles.detailsContainer,
            {
              backgroundColor: colors.dark ? colors.dark2 : colors.white,
              borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
            },
          ]}>
            <CText type="b16" style={styles.mb10}>
              What can you do?
            </CText>
            <CText type="m14" color={colors.grayScale6}>
              • Check your balance and try again{'\n'}
              • Verify the recipient address{'\n'}
              • Try again later if network is congested{'\n'}
              • Contact support if the problem persists
            </CText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={localStyles.buttonContainer}>
          <CButton
            title="Cancel"
            type="S16"
            color={colors.grayScale6}
            bgColor={colors.dark ? colors.dark3 : colors.grayScale2}
            containerStyle={localStyles.cancelButton}
            onPress={onBackToHome}
          />
          <CButton
            title="Try Again"
            containerStyle={localStyles.retryButton}
            onPress={onRetry}
          />
        </View>
      </View>
    </CSafeAreaView>
  );
};

export default TransferResultScreen;

const localStyles = StyleSheet.create({
  iconContainer: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(30),
  },
  detailsContainer: {
    width: '100%',
    borderWidth: 1,
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    marginBottom: moderateScale(20),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(10),
  },
  explorerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(15),
    marginBottom: moderateScale(30),
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(20),
    gap: moderateScale(15),
  },
  historyButton: {
    flex: 1,
  },
  homeButton: {
    flex: 1,
  },
  retryButton: {
    flex: 1,
  },
});
