import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

//Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import SubHeader from '../../components/SubHeader';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import CText from '../../components/common/CText';
import {styles} from '../../themes';
import CButton from '../../components/common/CButton';
import strings from '../../i18n/strings';
import {StackNav} from '../../navigation/NavigationKeys';
import {getHeight, moderateScale} from '../../common/constants';
import CDivider from '../../components/common/CDivider';

export default UploadIDScreen = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const [selectImage, setSelectImage] = useState(null);

  const openCameraTakePhoto = () => {
    {
      !selectImage
        ? launchCamera(
            {
              mediaType: 'photo',
              includeBase64: false,
              maxHeight: 200,
              maxWidth: 300,
            },
            response => {
              console.log('response', response);
              if (response.didCancel) {
                console.log('User cancelled image picker');
              } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
              } else {
                setSelectImage(response);
              }
            },
          )
        : setSelectImage(null);
    }
    // ImagePicker.openCamera({
    //   width: 300,
    //   height: getHeight(200),
    //   cropping: true,
    // }).then(image => {
    //   setSelectImage(image);
    // });
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 300,
      },
      response => {
        console.log('response', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          setSelectImage(response?.assets[0]);
        }
      },
    );
    // ImagePicker.openPicker({
    //   width: 300,
    //   height: getHeight(200),
    //   cropping: true,
    // }).then(image => {
    //   setSelectImage(image);
    // });
  };

  const onPressContinue = () => navigation.navigate(StackNav.IdAddressScreen);

  const ButtonIcon = () => (
    <Ionicons name={'camera'} color={colors.primary} size={moderateScale(22)} />
  );

  return (
    <CSafeAreaView>
      <SubHeader status={11} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <CText type={'B30'}>{strings.question11}</CText>
        <CText style={styles.mt15} type={'r18'}>
          {strings.question11Desc}
        </CText>
        {!selectImage ? (
          <View>
            <TouchableOpacity
              onPress={openGallery}
              style={[
                localStyles.uploadButton,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.primary,
                },
              ]}>
              <View style={styles.center}>
                <Ionicons
                  name={'image'}
                  size={moderateScale(28)}
                  color={colors.grayScale5}
                  style={styles.mb10}
                />
                <CText type={'m16'} color={colors.grayScale5}>
                  {strings.selectFile}
                </CText>
              </View>
            </TouchableOpacity>
            <View style={localStyles.dividerContainer}>
              <CDivider style={localStyles.dividerStyle} />
              <CText type={'r18'} color={colors.grayScale7}>
                {strings.or}
              </CText>
              <CDivider style={localStyles.dividerStyle} />
            </View>
          </View>
        ) : (
          <Image
            source={{uri: selectImage?.uri}}
            style={localStyles.imageStyle}
          />
        )}
        <CButton
          type={'S16'}
          title={!selectImage ? strings.openCameraTakePhoto : strings.change}
          bgColor={colors.dark3}
          color={colors.primary}
          style={styles.ml10}
          frontIcon={!selectImage && <ButtonIcon />}
          onPress={openCameraTakePhoto}
        />
      </KeyBoardAvoidWrapper>
      <CButton
        title={strings.continue}
        containerStyle={styles.bottomButton}
        onPress={onPressContinue}
      />
    </CSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  uploadButton: {
    height: getHeight(200),
    borderRadius: moderateScale(32),
    borderWidth: moderateScale(2),
    ...styles.mt25,
    ...styles.center,
  },
  dividerContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mv30,
  },
  dividerStyle: {
    width: '43%',
  },
  imageStyle: {
    height: getHeight(196),
    width: '100%',
    borderRadius: moderateScale(31),
    resizeMode: 'cover',
    ...styles.selfCenter,
    ...styles.mv25,
  },
});
