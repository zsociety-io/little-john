import React from 'react';
import {FlashList} from '@shopify/flash-list';

// Local Imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import SpotMarketComponent from '../../../components/SpotMarketComponent';
import CDivider from '../../../components/common/CDivider';
import {styles} from '../../../themes';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import {spotMarketStats} from '../../../api/constant';

const renderSpotMarketStats = ({item, index}) => {
  return <SpotMarketComponent item={item} />;
};

const renderSeparator = () => <CDivider style={styles.mh20} />;

export default function SPOTMarketStats() {
  return (
    <CSafeAreaView>
      <CHeader title={strings.spotMarketStats} style={styles.mh20} />
      <FlashList
        data={spotMarketStats}
        renderItem={renderSpotMarketStats}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={6}
        ItemSeparatorComponent={renderSeparator}
      />
    </CSafeAreaView>
  );
}
