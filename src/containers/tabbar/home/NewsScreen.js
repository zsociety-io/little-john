import { TouchableOpacity } from 'react-native';
import React from 'react';
import { FlashList } from '@shopify/flash-list';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import { newsData } from '../../../api/constant';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CDivider from '../../../components/common/CDivider';
import NewsComponent from '../../../components/NewsComponent';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import { moderateScale } from '../../../common/constants';
import { styles } from '../../../themes';

const renderNewsComponent = ({ item, index }) => {
  return <NewsComponent item={item} />;
};

const renderSeparator = () => <CDivider style={styles.mh20} />;

export default function NewsScreen() {
  const colors = useSelector(state => state.theme.theme);

  const RightIcon = () => {
    return (
      <TouchableOpacity style={styles.pr10}>
        <Ionicons
          name="search-outline"
          size={moderateScale(26)}
          color={colors.textColor}
        />
      </TouchableOpacity>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader
        title={strings.news}
        style={styles.mh20}
        rightIcon={<RightIcon />}
      />
      <FlashList
        removeClippedSubviews={false}
        data={newsData}
        renderItem={renderNewsComponent}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={renderSeparator}
        estimatedItemSize={2}
      />
    </CSafeAreaView>
  );
}
