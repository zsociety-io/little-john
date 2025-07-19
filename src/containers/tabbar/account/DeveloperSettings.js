// Library import
import {
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import CText from '../../../components/common/CText';
import {styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import {networkData} from '../../../api/constant';

const DeveloperSettings = ({ navigation }) => {
  const colors = useSelector(state => state.theme.theme);
  const [selectedNetwork, setSelectedNetwork] = useState('Mainnet'); // Default to Mainnet

  const RenderHeader = ({title}) => {
    return (
      <CText type="b20" style={styles.mt20}>
        {title}
      </CText>
    );
  };

  const onPressItem = item => {
    setSelectedNetwork(item.networkName);
    // Ici vous pouvez ajouter la logique pour changer de réseau
    console.log('Network changed to:', item.networkName);
  };

  const RenderData = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressItem(item)}
        style={localStyles.settingsContainer}>
        <View>
          <CText type="s18">{item.networkName}</CText>
          <CText type="r14" color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
            {item.description}
          </CText>
        </View>
        <View style={localStyles.rightContainer}>
          <Ionicons
            name={
              selectedNetwork === item.networkName
                ? 'radio-button-on'
                : 'radio-button-off'
            }
            size={moderateScale(24)}
            color={colors.primary}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={strings.developerSettings} />
      <SectionList
        sections={networkData}
        keyExtractor={(item, index) => item.networkName + index}
        renderItem={({item}) => <RenderData item={item} />}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({section: {title}}) => (
          <RenderHeader title={title} />
        )}
        contentContainerStyle={styles.ph20}
        showsVerticalScrollIndicator={false}
      />
    </CSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  settingsContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mt20,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
});

export default DeveloperSettings;