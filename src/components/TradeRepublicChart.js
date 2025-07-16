import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Text,
  Vibration,
  Platform,
} from 'react-native';
import {
  Area,
  Chart,
  Line,
  HorizontalAxis,
  VerticalAxis,
} from 'react-native-responsive-linechart';
import {useSelector} from 'react-redux';
import {deviceWidth, getHeight, moderateScale} from '../common/constants';
import CText from './common/CText';

const TradeRepublicChart = ({
  data,
  height = 290,
  onPriceChange,
  isPositive = true,
  currentPrice,
  xDomain,
  yDomain,
  showAxis = false,
  animate = true,
}) => {
  const colors = useSelector(state => state.theme.theme);
  const [touchX, setTouchX] = useState(null);
  const [touchY, setTouchY] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const lineOpacity = useRef(new Animated.Value(0)).current;
  const priceOpacity = useRef(new Animated.Value(0)).current;
  const chartRef = useRef(null);

  // Calculate price based on touch position
  const calculatePriceFromTouch = useCallback((x, y) => {
    if (!data || data.length === 0) return null;
    
    // Map x position to data index
    const chartWidth = deviceWidth - moderateScale(40); // Account for padding
    const dataIndex = Math.round((x / chartWidth) * (data.length - 1));
    const clampedIndex = Math.max(0, Math.min(dataIndex, data.length - 1));
    
    return {
      price: data[clampedIndex].y,
      time: data[clampedIndex].x,
      index: clampedIndex,
    };
  }, [data]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (evt) => {
        const {locationX, locationY} = evt.nativeEvent;
        handleTouch(locationX, locationY);
        showTouchIndicators();
        
        // Haptic feedback
        if (Platform.OS === 'ios') {
          Vibration.vibrate(1);
        }
      },
      
      onPanResponderMove: (evt) => {
        const {locationX, locationY} = evt.nativeEvent;
        handleTouch(locationX, locationY);
      },
      
      onPanResponderRelease: () => {
        hideTouchIndicators();
      },
    })
  ).current;

  const handleTouch = (x, y) => {
    setTouchX(x);
    setTouchY(y);
    
    const priceData = calculatePriceFromTouch(x, y);
    if (priceData) {
      setSelectedPrice(priceData.price);
      setSelectedTime(priceData.time);
      
      if (onPriceChange) {
        onPriceChange({
          price: priceData.price,
          time: priceData.time,
          index: priceData.index,
        });
      }
    }
  };

  const showTouchIndicators = () => {
    Animated.parallel([
      Animated.timing(lineOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(priceOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideTouchIndicators = () => {
    Animated.parallel([
      Animated.timing(lineOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(priceOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTouchX(null);
      setTouchY(null);
      setSelectedPrice(null);
      setSelectedTime(null);
      
      if (onPriceChange) {
        onPriceChange(null);
      }
    });
  };

  const chartColor = isPositive ? colors.upColor1 : colors.downColor1;
  const gradientColor = isPositive ? colors.upColor2 : colors.downColor2;

  return (
    <View style={[styles.container, {height: getHeight(height)}]}>
      <View {...panResponder.panHandlers} style={styles.chartWrapper}>
        <Chart
          ref={chartRef}
          style={styles.chart}
          data={data}
          padding={{left: 0, top: 20, right: 0, bottom: 20}}
          xDomain={xDomain || {min: 0, max: data.length - 1}}
          yDomain={yDomain || {min: Math.min(...data.map(d => d.y)) * 0.95, max: Math.max(...data.map(d => d.y)) * 1.05}}
        >
          <Area
            smoothing="cubic-spline"
            theme={{
              gradient: {
                from: {color: chartColor, opacity: 0.6},
                to: {color: gradientColor, opacity: 0.01},
              },
            }}
          />
          <Line
            smoothing="cubic-spline"
            theme={{
              stroke: {
                color: chartColor,
                width: moderateScale(3),
              },
            }}
          />
          {showAxis && (
            <>
              <VerticalAxis
                theme={{
                  labels: {
                    label: {color: colors.grayScale3},
                  },
                  grid: {
                    stroke: {color: colors.grayScale2, opacity: 0.3},
                  },
                }}
              />
              <HorizontalAxis
                theme={{
                  labels: {
                    label: {color: colors.grayScale3},
                  },
                  grid: {
                    stroke: {color: colors.grayScale2, opacity: 0.3},
                  },
                }}
              />
            </>
          )}
        </Chart>
        
        {/* Touch indicator - Vertical line */}
        {touchX !== null && (
          <Animated.View
            style={[
              styles.verticalLine,
              {
                left: touchX,
                opacity: lineOpacity,
                backgroundColor: colors.grayScale3,
              },
            ]}
          />
        )}
        
        {/* Touch indicator - Horizontal line */}
        {touchY !== null && (
          <Animated.View
            style={[
              styles.horizontalLine,
              {
                top: touchY,
                opacity: lineOpacity,
                backgroundColor: colors.grayScale3,
              },
            ]}
          />
        )}
        
        {/* Price indicator dot */}
        {touchX !== null && touchY !== null && (
          <Animated.View
            style={[
              styles.priceDot,
              {
                left: touchX - moderateScale(6),
                top: touchY - moderateScale(6),
                opacity: lineOpacity,
                backgroundColor: chartColor,
                borderColor: colors.white,
              },
            ]}
          />
        )}
        
        {/* Price label */}
        {selectedPrice !== null && touchX !== null && (
          <Animated.View
            style={[
              styles.priceLabel,
              {
                left: Math.min(
                  Math.max(touchX - moderateScale(40), 10),
                  deviceWidth - moderateScale(100)
                ),
                top: touchY - moderateScale(50),
                opacity: priceOpacity,
                backgroundColor: colors.dark ? colors.dark2 : colors.white,
                borderColor: colors.bColor,
              },
            ]}
          >
            <CText type="b14" color={chartColor}>
              ${selectedPrice.toFixed(2)}
            </CText>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chartWrapper: {
    flex: 1,
    position: 'relative',
  },
  chart: {
    flex: 1,
  },
  verticalLine: {
    position: 'absolute',
    width: 1,
    top: 0,
    bottom: 0,
  },
  horizontalLine: {
    position: 'absolute',
    height: 1,
    left: 0,
    right: 0,
  },
  priceDot: {
    position: 'absolute',
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    borderWidth: moderateScale(2),
  },
  priceLabel: {
    position: 'absolute',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default TradeRepublicChart;