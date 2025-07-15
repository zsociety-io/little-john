// Library import
import {StyleSheet, Switch, View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import CText from '../../../components/common/CText';
import {styles} from '../../../themes';

export default NotificationSetting = () => {
  const colors = useSelector(state => state.theme.theme);
  const [isEnabled, setIsEnabled] = useState({
    switch1: true,
    switch2: false,
    switch3: true,
    switch4: true,
    switch5: true,
    switch6: false,
    switch7: true,
    switch8: false,
    switch9: true,
    switch10: false,
  });

  const onPressSwitch = key => {
    setIsEnabled({
      ...isEnabled,
      [key]: !isEnabled[key],
    });
  };

  const NotificationData = [
    {
      title: 'My Stock Goes up',
      value: isEnabled.switch1,
      onPress: () => onPressSwitch('switch1'),
    },
    {
      title: 'My Stock is Down',
      value: isEnabled.switch2,
      onPress: () => onPressSwitch('switch2'),
    },
    {
      title: 'Top Movers Updates',
      value: isEnabled.switch3,
      onPress: () => onPressSwitch('switch3'),
    },
    {
      title: 'I Bought Stock',
      value: isEnabled.switch4,
      onPress: () => onPressSwitch('switch4'),
    },
    {
      title: 'I Exchange Stock',
      value: isEnabled.switch5,
      onPress: () => onPressSwitch('switch5'),
    },
    {
      title: 'I Make Funding',
      value: isEnabled.switch6,
      onPress: () => onPressSwitch('switch6'),
    },
    {
      title: 'Otrade Announcements',
      value: isEnabled.switch7,
      onPress: () => onPressSwitch('switch7'),
    },
    {
      title: 'App Updates',
      value: isEnabled.switch8,
      onPress: () => onPressSwitch('switch8'),
    },
    {
      title: 'New Services Available',
      value: isEnabled.switch9,
      onPress: () => onPressSwitch('switch9'),
    },
    {
      title: 'New Tips Available',
      value: isEnabled.switch10,
      onPress: () => onPressSwitch('switch10'),
    },
  ];

  return (
    <CSafeAreaView>
      <CHeader title={strings.notification} />
      <View style={localStyles.root}>
        {NotificationData.map((item, index) => {
          return (
            <View style={localStyles.mainContainer} key={index}>
              <CText type={'s18'}>{item.title}</CText>
              <Switch
                trackColor={{
                  false: colors.grayScale3,
                  true: colors.dark ? colors.grayScale5 : colors.primary,
                }}
                thumbColor={colors.white}
                onValueChange={item.onPress}
                value={item.value}
              />
            </View>
          );
        })}
      </View>
    </CSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph25,
    ...styles.mt20,
  },
  mainContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mb20,
  },
});
