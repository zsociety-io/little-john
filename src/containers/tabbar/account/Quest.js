import { FlatList, Image, StyleSheet, View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import { styles } from '../../../themes';
import images from '../../../assets/images';
import { getHeight, moderateScale } from '../../../common/constants';
import CDivider from '../../../components/common/CDivider';
import CText from '../../../components/common/CText';
import strings from '../../../i18n/strings';
import { Star_Icon } from '../../../assets/svgs';
import { questData } from '../../../api/constant';
import CButton from '../../../components/common/CButton';
import { StackNav } from '../../../navigation/NavigationKeys';
import { Linking } from 'react-native';

export default function Quest({ navigation }) {
  const colors = useSelector(state => state.theme.theme);

  const onPressQuest = () => {
    Linking.openURL('https://www.google.com'); // mettre le lien de la campagne svp
  };
  const onPressMyLeaderboard = () => navigation.navigate(StackNav.MyRewards);

  const renderItem = ({ item, index }) => {
    return (
      <View style={localStyles.mainContainer}>
        <Star_Icon />
        <View style={styles.flex}>
          <CText type={'b20'}>{item.title}</CText>
          <CText
            type={'m16'}
            color={colors.dark ? colors.grayScale1 : colors.grayScale7}
            style={styles.mt5}>
            {item.desc}
            {item.termAndCond && (
              <CText 
              type={'m16'} 
              color={colors.primary}
              style={[styles.mt5, { textDecorationLine: 'underline' }]}
              onPress={() => Linking.openURL('https://www.discord.com')} // Lien discord community la team
              >
                {' '}
                {strings.joinUs}
              </CText>
            )}
          </CText>
        </View>
      </View>
    );
  };

  const RenderHeader = () => {
    return (
      <View>
        <Image
          source={images.quest}
          style={localStyles.questImage}
        />
        <CText type={'b32'} align={'center'} style={styles.mt20}>
          {strings.questsGetStock}
        </CText>
        <CDivider style={styles.mt30} />
      </View>
    );
  };

  const ButtonIcon = ({ icon, color }) => {
    return <Ionicons name={icon} size={moderateScale(24)} color={color} />;
  };

  const RenderFooter = () => {
    return (
      <View style={styles.mt30}>
        <CButton
          title={strings.completeQuests}
          containerStyle={styles.mb15}
          style={styles.ml10}
          onPress={onPressQuest}
          frontIcon={<ButtonIcon icon={'flag'} color={colors.white} />}
        />
        <CButton
          type={'S16'}
          title={strings.myLeaderboard}
          bgColor={colors.dark3}
          color={colors.primary}
          style={styles.ml10}
          containerStyle={styles.mb15}
          onPress={onPressMyLeaderboard}
          frontIcon={<ButtonIcon icon={'trophy'} color={colors.primary} />}
        />
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader />
      <FlatList
        removeClippedSubviews={false} data={questData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={RenderHeader}
        ListFooterComponent={RenderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ph20}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  questImage: {
    width: '100%',
    height: getHeight(250),
    resizeMode: 'contain',
  },
  mainContainer: {
    ...styles.flexRow,
    ...styles.itemsStart,
    ...styles.mt20,
    gap: moderateScale(10),
  },
});
