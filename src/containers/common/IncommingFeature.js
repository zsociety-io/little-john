import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Custom imports
import CText from '../../components/common/CText';
import { styles } from '../../themes';
import { moderateScale } from '../../common/constants';

export default function IncommingFeature() {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[localStyles.container, { backgroundColor: colors.backgroundColor }]}>
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle={colors.dark ? "light-content" : "dark-content"} 
      />
      
      {/* Background overlay */}
      <View
        style={[
          localStyles.backgroundOverlay,
          { backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1 }
        ]}
      />

      {/* Header avec safe area */}
      <View style={localStyles.safeHeader}>
        <View style={localStyles.header}>
          <TouchableOpacity 
            style={localStyles.backButton}
            onPress={onPressBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons
              name="arrow-back"
              size={moderateScale(24)}
              color={colors.textColor}
            />
          </TouchableOpacity>
          
          <View style={localStyles.placeholder} />
          <View style={localStyles.placeholder} />
        </View>
      </View>

      {/* Main content */}
      <View style={localStyles.content}>
        {/* Animated icon */}
        <View style={localStyles.iconContainer}>
          <Animated.View 
            style={[
              localStyles.iconWrapper,
              { 
                transform: [{ scale: pulseAnim }],
                opacity: 0.8
              }
            ]}>
            <Ionicons
              name="construct"
              size={moderateScale(120)}
              color={colors.primary}
            />
          </Animated.View>
          
          {/* Loading indicator */}
          <View style={localStyles.loaderContainer}>
            <ActivityIndicator 
              size="large" 
              color={colors.primary}
            />
          </View>
        </View>

        {/* Text content */}
        <View style={localStyles.textContainer}>
          <CText 
            type="b32" 
            align="center" 
            style={styles.mb10}
            color={colors.textColor}>
            Coming Soon
          </CText>
          
          <CText 
            type="m18" 
            align="center" 
            style={[styles.mb20, localStyles.descriptionText]}
            color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
            This feature is currently under development and will be available soon.
          </CText>
          
          <CText 
            type="r16" 
            align="center" 
            color={colors.dark ? colors.grayScale4 : colors.grayScale5}>
            Stay tuned for updates!
          </CText>
        </View>
      </View>

      {/* Footer */}
      <View style={localStyles.footer}>
        <TouchableOpacity
          style={[
            localStyles.actionButton,
            { 
              backgroundColor: colors.primary,
              borderColor: colors.primary 
            }
          ]}
          onPress={onPressBack}
          activeOpacity={0.8}>
          <CText 
            type="b16" 
            color={colors.white}
            align="center">
            Go Back
          </CText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            localStyles.secondaryButton,
            { 
              backgroundColor: 'transparent',
              borderColor: colors.dark ? colors.dark3 : colors.grayScale3,
              borderWidth: 1
            }
          ]}
          onPress={() => {
            // Navigation vers les notifications ou une autre page
            console.log('Notify when ready pressed');
          }}
          activeOpacity={0.8}>
          <Ionicons
            name="notifications-outline"
            size={moderateScale(20)}
            color={colors.textColor}
            style={styles.mr10}
          />
          <CText 
            type="m16" 
            color={colors.textColor}
            align="center">
            Notify Me
          </CText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  safeHeader: {
    paddingTop: moderateScale(50), // Ajusté pour compenser l'absence de SafeAreaView
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
  },
  backButton: {
    padding: moderateScale(8),
  },
  placeholder: {
    width: moderateScale(40),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(40),
    zIndex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(40),
    position: 'relative',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(20),
  },
  loaderContainer: {
    position: 'absolute',
    bottom: moderateScale(-10),
    alignSelf: 'center',
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: '100%',
  },
  descriptionText: {
    lineHeight: moderateScale(24),
    paddingHorizontal: moderateScale(10),
  },
  footer: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(20),
    paddingTop: moderateScale(10),
    zIndex: 1,
  },
  actionButton: {
    paddingVertical: moderateScale(16),
    paddingHorizontal: moderateScale(32),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(12),
    minHeight: moderateScale(52),
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(32),
    borderRadius: moderateScale(12),
    minHeight: moderateScale(48),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
