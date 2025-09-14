import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import CSafeAreaView from '../../components/common/CSafeAreaView';
import CHeader from '../../components/common/CHeader';
import CText from '../../components/common/CText';
import CButton from '../../components/common/CButton';
import { moderateScale } from '../../common/constants';
import { styles } from '../../themes';

export default function Campaign({ navigation, route }) {
  const colors = useSelector(state => state.theme.theme);
  const { verified } = route?.params || {};

  const onPressInviteFriends = () => {
    // TODO: Implémenter la logique de partage
    console.log('Inviter des amis');
  };

  const onPressViewRewards = () => {
    // TODO: Naviguer vers les récompenses
    console.log('Voir les récompenses');
  };

  return (
    <CSafeAreaView>
      <CHeader
        title="Campagne de Parrainage"
        onPressBack={() => navigation.goBack()}
      />
      
      <ScrollView 
        style={[localStyles.container, { backgroundColor: colors.backgroundColor }]}
        showsVerticalScrollIndicator={false}
      >
        {verified && (
          <View style={[localStyles.successBanner, { backgroundColor: colors.successColor + '20' }]}>
            <CText type="b16" color={colors.successColor}>
              ✅ Seeker Phone vérifié avec succès !
            </CText>
          </View>
        )}
        
        <View style={localStyles.headerSection}>
          <CText type="b24" style={localStyles.title}>
            🎁 Campagne Intract & Referral
          </CText>
          
          <CText type="r16" style={localStyles.subtitle}>
            Bienvenue dans la campagne exclusive pour les détenteurs de Seeker Phone !
          </CText>
        </View>

        <View style={[localStyles.card, { backgroundColor: colors.inputBg }]}>
          <CText type="b18" style={localStyles.cardTitle}>
            📱 Votre Statut
          </CText>
          <View style={localStyles.statusRow}>
            <CText type="r14">Seeker Phone :</CText>
            <CText type="b14" color={colors.successColor}>
              ✅ Vérifié
            </CText>
          </View>
          <View style={localStyles.statusRow}>
            <CText type="r14">Points gagnés :</CText>
            <CText type="b14" color={colors.primary}>
              100 points
            </CText>
          </View>
        </View>

        <View style={[localStyles.card, { backgroundColor: colors.inputBg }]}>
          <CText type="b18" style={localStyles.cardTitle}>
            🎯 Comment ça marche
          </CText>
          
          <View style={localStyles.stepContainer}>
            <CText type="b16">1. Partagez votre lien</CText>
            <CText type="r14" style={localStyles.stepDesc}>
              Invitez vos amis à rejoindre LittleJohn avec votre lien de parrainage unique.
            </CText>
          </View>

          <View style={localStyles.stepContainer}>
            <CText type="b16">2. Ils s'inscrivent</CText>
            <CText type="r14" style={localStyles.stepDesc}>
              Vos amis créent un compte et connectent leur wallet Solana.
            </CText>
          </View>

          <View style={localStyles.stepContainer}>
            <CText type="b16">3. Gagnez des récompenses</CText>
            <CText type="r14" style={localStyles.stepDesc}>
              Recevez des points et des tokens pour chaque ami qui rejoint !
            </CText>
          </View>
        </View>

        <View style={[localStyles.card, { backgroundColor: colors.inputBg }]}>
          <CText type="b18" style={localStyles.cardTitle}>
            🏆 Récompenses
          </CText>
          
          <View style={localStyles.rewardRow}>
            <CText type="r14">• Ami inscrit :</CText>
            <CText type="b14" color={colors.primary}>50 points</CText>
          </View>
          
          <View style={localStyles.rewardRow}>
            <CText type="r14">• Premier trade :</CText>
            <CText type="b14" color={colors.primary}>100 points</CText>
          </View>
          
          <View style={localStyles.rewardRow}>
            <CText type="r14">• 5 amis actifs :</CText>
            <CText type="b14" color={colors.primary}>Bonus 500 points</CText>
          </View>
        </View>

        <View style={localStyles.actionButtons}>
          <CButton
            title="🚀 Inviter des amis"
            onPress={onPressInviteFriends}
            containerStyle={[styles.mb15, { backgroundColor: colors.primary }]}
          />
          
          <CButton
            title="🎁 Voir mes récompenses"
            onPress={onPressViewRewards}
            containerStyle={{ backgroundColor: colors.primary + '20' }}
            textColor={colors.primary}
          />
        </View>
      </ScrollView>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
  },
  successBanner: {
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(20),
    marginTop: moderateScale(10),
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  title: {
    textAlign: 'center',
    marginBottom: moderateScale(10),
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: moderateScale(22),
  },
  card: {
    padding: moderateScale(20),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(15),
  },
  cardTitle: {
    marginBottom: moderateScale(15),
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(8),
  },
  stepContainer: {
    marginBottom: moderateScale(15),
  },
  stepDesc: {
    marginTop: moderateScale(5),
    lineHeight: moderateScale(18),
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(10),
  },
  actionButtons: {
    marginTop: moderateScale(10),
    marginBottom: moderateScale(30),
  },
});
