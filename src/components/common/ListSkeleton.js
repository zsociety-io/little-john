import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { moderateScale } from '../../common/constants';
import { useSelector } from 'react-redux';

const ListSkeleton = ({ count = 6, height = moderateScale(70), style }) => {
  const colors = useSelector(state => state.theme.theme);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
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
    };

    startAnimation();
  }, [animatedValue]);

  const interpolatedOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonItem = ({ delay = 0 }) => (
    <View style={styles.itemContainer}>
      {/* Cercle pour le logo */}
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: colors.dark ? colors.dark3 : colors.grayScale2,
            opacity: interpolatedOpacity,
          },
        ]}
      />
      
      {/* Container pour les 2 bandes de texte */}
      <View style={styles.textContainer}>
        {/* Bande du haut (plus courte) - Nom de l'action */}
        <Animated.View
          style={[
            styles.textLineShort,
            {
              backgroundColor: colors.dark ? colors.dark3 : colors.grayScale2,
              opacity: interpolatedOpacity,
            },
          ]}
        />
        
        {/* Bande du bas (plus longue) - Symbole + prix */}
        <Animated.View
          style={[
            styles.textLineLong,
            {
              backgroundColor: colors.dark ? colors.dark3 : colors.grayScale2,
              opacity: interpolatedOpacity,
            },
          ]}
        />
      </View>
      
      {/* Container pour le prix à droite */}
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
    <View style={[styles.container, style]}>
      {[...Array(count)].map((_, index) => (
        <SkeletonItem key={index} delay={index * 100} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: moderateScale(75),
    paddingVertical: moderateScale(10),
    marginBottom: moderateScale(8),
  },
  circle: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    marginRight: moderateScale(15),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textLineShort: {
    height: moderateScale(16),
    width: '60%',
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(8),
  },
  textLineLong: {
    height: moderateScale(14),
    width: '80%',
    borderRadius: moderateScale(7),
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  priceText: {
    height: moderateScale(18),
    width: moderateScale(60),
    borderRadius: moderateScale(9),
  },
});

export default ListSkeleton;
