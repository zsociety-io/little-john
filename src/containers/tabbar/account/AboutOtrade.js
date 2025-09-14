import { FlatList, StyleSheet, TouchableOpacity, View, Linking } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import { styles } from '../../../themes';
import CDivider from '../../../components/common/CDivider';
import { AppLogoLight } from '../../../assets/svgs';
import { moderateScale } from '../../../common/constants';
import CText from '../../../components/common/CText';
import { aboutOtradeData } from '../../../api/constant';

export default function AboutOtrade() {
  const colors = useSelector(state => state.theme.theme);

  const handleItemPress = (item) => {
    switch (item) {
      case 'Contact Us':
        // Ouvrir l'application mail avec l'adresse email
        Linking.openURL('mailto:contact@littlejohn.fi');
        break;
      case 'Visit Our Website':
        // Ouvrir le site web dans le navigateur
        Linking.openURL('https://www.littlejohn.fi/');
        break;
      default:
        // Pour les autres éléments, ne rien faire pour l'instant
        console.log(`Clicked on: ${item}`);
        break;
    }
  };

  const RenderData = ({ item }) => {
    const isClickable = item === 'Contact Us' || item === 'Visit Our Website';
    
    return (
      <TouchableOpacity 
        style={localStyles.settingsContainer}
        onPress={() => handleItemPress(item)}
        disabled={!isClickable}
      >
        <CText type="s18">{item}</CText>
        <Ionicons
          name="chevron-forward-outline"
          size={moderateScale(20)}
          color={colors.textColor}
        />
      </TouchableOpacity>
    );
  };

  const RenderHeader = () => {
    return (
      <View>
        <View style={styles.selfCenter}>
          <AppLogoLight
            height={moderateScale(150)}
            width={moderateScale(150)}
          />
          <CText type="b24" align="center" style={styles.mv15}>
            {'Little John v1.0.1'}
          </CText>
        </View>
        <CDivider />
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={strings.aboutOtrade} />
      <FlatList
        removeClippedSubviews={false} data={aboutOtradeData}
        renderItem={RenderData}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={RenderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ph20}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  settingsContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mt20,
  },
});
