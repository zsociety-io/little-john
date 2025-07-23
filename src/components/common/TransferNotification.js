import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import CText from '../common/CText';
import { moderateScale } from '../../common/constants';
import { styles } from '../../themes';

const { width: screenWidth } = Dimensions.get('window');

const TransferNotification = ({ 
  visible, 
  type = 'success', // 'success', 'error', 'info', 'warning'
  title, 
  message, 
  onPress,
  onDismiss,
  autoHide = true,
  duration = 4000 
}) => {
  const colors = useSelector(state => state.theme.theme);
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animation d'entrée
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide après le délai spécifié
      if (autoHide && onDismiss) {
        const timer = setTimeout(() => {
          hideNotification();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      hideNotification();
    }
  }, [visible]);

  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) {
        onDismiss();
      }
    });
  };

  const getNotificationStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: colors.primary + 'E6',
          borderColor: colors.primary,
          iconName: 'checkmark-circle',
          iconColor: colors.white,
        };
      case 'error':
        return {
          backgroundColor: colors.alertColor + 'E6',
          borderColor: colors.alertColor,
          iconName: 'close-circle',
          iconColor: colors.white,
        };
      case 'warning':
        return {
          backgroundColor: (colors.yellow || '#FFA500') + 'E6',
          borderColor: colors.yellow || '#FFA500',
          iconName: 'warning',
          iconColor: colors.white,
        };
      case 'info':
      default:
        return {
          backgroundColor: (colors.blue || '#007AFF') + 'E6',
          borderColor: colors.blue || '#007AFF',
          iconName: 'information-circle',
          iconColor: colors.white,
        };
    }
  };

  const notificationStyle = getNotificationStyle();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        localStyles.container,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: notificationStyle.backgroundColor,
          borderColor: notificationStyle.borderColor,
        },
      ]}>
      <TouchableOpacity
        style={localStyles.content}
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}>
        
        {/* Icon */}
        <View style={localStyles.iconContainer}>
          <Ionicons
            name={notificationStyle.iconName}
            size={moderateScale(24)}
            color={notificationStyle.iconColor}
          />
        </View>

        {/* Content */}
        <View style={localStyles.textContainer}>
          {title && (
            <CText 
              type="b16" 
              color={colors.white} 
              numberOfLines={1}
              style={localStyles.title}>
              {title}
            </CText>
          )}
          {message && (
            <CText 
              type="m14" 
              color={colors.white} 
              numberOfLines={2}
              style={localStyles.message}>
              {message}
            </CText>
          )}
        </View>

        {/* Close button */}
        <TouchableOpacity
          style={localStyles.closeButton}
          onPress={hideNotification}>
          <Ionicons
            name="close"
            size={moderateScale(18)}
            color={colors.white}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransferNotification;

const localStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: moderateScale(50),
    left: moderateScale(20),
    right: moderateScale(20),
    zIndex: 9999,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
  },
  iconContainer: {
    marginRight: moderateScale(12),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: moderateScale(2),
  },
  message: {
    lineHeight: moderateScale(18),
  },
  closeButton: {
    padding: moderateScale(4),
    marginLeft: moderateScale(8),
  },
});

// Hook pour utiliser les notifications
export const useTransferNotification = () => {
  const [notification, setNotification] = React.useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showNotification = ({ type = 'info', title, message, onPress, duration }) => {
    setNotification({
      visible: true,
      type,
      title,
      message,
      onPress,
      duration,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  const NotificationComponent = () => (
    <TransferNotification
      {...notification}
      onDismiss={hideNotification}
    />
  );

  return {
    showNotification,
    hideNotification,
    NotificationComponent,
  };
};
