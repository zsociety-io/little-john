import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useAccount } from '../../providers/AccountProvider';
import CSafeAreaView from '../../components/common/CSafeAreaView';
import CHeader from '../../components/common/CHeader';
import CText from '../../components/common/CText';
import CButton from '../../components/common/CButton';
import { StackNav } from '../../navigation/NavigationKeys';
import { verifySeekerGenesisToken } from '../../api/campaign';
import { moderateScale } from '../../common/constants';
import strings from '../../i18n/strings';
import { styles } from '../../themes';

export default function SeekerPhoneVerification({ navigation }) {
  const colors = useSelector(state => state.theme.theme);
  const { currentAccount } = useAccount();
  const pubkey = currentAccount?.pubkey;
  
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyPhone = async () => {
    if (!pubkey) {
      Alert.alert('Erreur', 'Wallet non connecté');
      return;
    }

    setIsVerifying(true);
    
    try {
      const result = await verifySeekerGenesisToken(pubkey);
      
      if (result.success) {
        if (result.isAlreadyVerified) {
          // Déjà vérifié
          Alert.alert(
            'Déjà vérifié ✅',
            'Vous avez déjà été vérifié pour le Seeker Genesis Token !',
            [
              {
                text: 'Continuer',
                onPress: () => navigation.navigate(StackNav.Quest, { verified: true })
              }
            ]
          );
        } else {
          // Nouvelle vérification réussie
          Alert.alert(
            'Félicitations ! 🎉',
            `Seeker Genesis Token vérifié avec succès !\nVous avez gagné ${result.points} points.`,
            [
              {
                text: 'Continuer',
                onPress: () => navigation.navigate(StackNav.Quest, { verified: true })
              }
            ]
          );
        }
      } else {
        // Échec - pas de Seeker Genesis Token
        Alert.alert(
          'Accès refusé 😞',
          'Cette campagne est réservée aux détenteurs de Seeker Genesis Token NFT.',
          [
            {
              text: 'Retour',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error) {
      console.error('Erreur vérification:', error);
      Alert.alert('Erreur', 'Impossible de vérifier le Seeker Genesis Token. Réessayez plus tard.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <CSafeAreaView style={[{ backgroundColor: colors.backgroundColor }, localStyles.safeArea]}>
      <CHeader
        title="Seeker Genesis Token Verification"
        onPressBack={() => navigation.goBack()}
      />
      
      <View style={[localStyles.container, { backgroundColor: colors.backgroundColor }]}>
        <View style={localStyles.content}>
          <CText type="b24" style={localStyles.title}>
            🏆 Seeker Genesis Token Required
          </CText>
          
          <CText type="r16" style={localStyles.description}>
            This rewards campaign is exclusive to Seeker Genesis Token NFT holders.
          </CText>
          
          <CText type="r14" style={localStyles.rewards}>
            🎁 Rewards: 500 points + Access to exclusive rewards
          </CText>
          
          <View style={localStyles.buttonContainer}>
            <CButton
              title={isVerifying ? "Checking NFT..." : "Verify my Seeker Genesis Token"}
              onPress={handleVerifyPhone}
              disabled={isVerifying}
              loading={isVerifying}
            />
          </View>
        </View>
      </View>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: moderateScale(20),
  },
  description: {
    textAlign: 'center',
    marginBottom: moderateScale(15),
    lineHeight: moderateScale(22),
  },
  rewards: {
    textAlign: 'center',
    marginBottom: moderateScale(30),
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: moderateScale(20),
  },
});
