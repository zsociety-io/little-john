import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { moderateScale } from '../../common/constants';
import { useSelector } from 'react-redux';

const EtfSkeleton = ({ count = 4, style }) => {
  const colors = useSelector(state => state.theme.theme);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const interpolatedOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonEtfItem = () => (
    <View style={styles.etfItemContainer}>
      {/* Conteneur gauche (logo + texte) */}
      <View style={styles.leftContainer}>
        {/* Logo carré ETF */}
        <Animated.View
          style={[
            styles.squareLogo,
            {
              backgroundColor: colors.dark ? colors.dark3 : colors.grayScale2,
              opacity: interpolatedOpacity,
            },
          ]}
        />
        {/* Texte ETF */}
        <View style={styles.etfTextContainer}>
          <Animated.View
            style={[
              styles.etfNameLine,
              {
                backgroundColor: colors.dark ? colors.dark3 : colors.grayScale2,
                opacity: interpolatedOpacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.etfDescLine,
              {
                backgroundColor: colors.dark ? colors.dark3 : colors.grayScale2,
                opacity: interpolatedOpacity,
              },
            ]}
          />
        </View>
      </View>

      {/* Conteneur droit (prix) */}
      <View style={styles.priceContainer}>
        <Animated.View
          style={[
            styles.priceText,
            {
              backgroundColor: colors.dark ? colors.dark3 : colors.grayScale2,
              opacity: interpolatedOpacity,
            },
          ]}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.horizontalContainer, style]}>
      {[...Array(count)].map((_, index) => (
        <SkeletonEtfItem key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
  },
  etfItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Aligne les éléments aux extrémités
    height: moderateScale(70),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    marginBottom: moderateScale(8),
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  squareLogo: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(8),
    marginRight: moderateScale(15),
  },
  etfTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  etfNameLine: {
    height: moderateScale(12),
    width: '80%',
    borderRadius: moderateScale(6),
    marginBottom: moderateScale(6),
  },
  etfDescLine: {
    height: moderateScale(10),
    width: '60%',
    borderRadius: moderateScale(5),
  },
  });

export default EtfSkeleton;