import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo, useRef} from 'react';
import {useSelector} from 'react-redux';
import Ionicnos from 'react-native-vector-icons/Ionicons';

// Custom Imports
import CInput from './common/CInput';
import {moderateScale} from '../common/constants';
import strings from '../i18n/strings';
import {styles} from '../themes';

const SearchComponent = props => {
  const {onSearchInput, search} = props;
  const colors = useSelector(state => state.theme.theme);
  const sortAndFilterRef = useRef();

  const onPressFilter = () => sortAndFilterRef?.current?.show();

  const SearchRightIcon = () => {
    return (
      <TouchableOpacity onPress={onPressFilter}>
        <Ionicnos
          name={'filter-outline'}
          size={moderateScale(20)}
          color={colors.primary}
        />
      </TouchableOpacity>
    );
  };

  const Search_Icon = () => (
    <Ionicnos
      name={'search-outline'}
      size={moderateScale(20)}
      color={colors.dark ? colors.grayScale7 : colors.grayScale4}
    />
  );

  return (
    <View>
      <CInput
        placeHolder={strings.search}
        _value={search}
        keyBoardType={'default'}
        autoCapitalize={'none'}
        insideLeftIcon={Search_Icon}
        toGetTextFieldValue={onSearchInput}
        inputContainerStyle={[
          {backgroundColor: colors.inputBg},
          localStyles.inputContainerStyle,
        ]}
        inputBoxStyle={localStyles.inputBoxStyle}
        rightAccessory={SearchRightIcon}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
});

export default memo(SearchComponent);
