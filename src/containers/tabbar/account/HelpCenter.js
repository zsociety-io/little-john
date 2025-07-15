// Library import
import {ScrollView, StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import {moderateScale} from '../../../common/constants';
import {styles} from '../../../themes';
import CText from '../../../components/common/CText';
import {
  contactUsData,
  helperCategoryData,
  helperData,
} from '../../../api/constant';
import FaqComponent from '../../../components/FaqComponent';
import SearchComponent from '../../../components/SearchComponent';
import MostPopularCategory from '../../../components/MostPopularCategory';

export default HelpCenter = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const [isSelect, setIsSelect] = useState(0);

  const categoryData = [
    {
      id: 0,
      title: strings.faq,
      onPress: () => setIsSelect(0),
    },
    {
      id: 1,
      title: strings.contactUs,
      onPress: () => setIsSelect(1),
    },
  ];

  const [faqData, setFaqData] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setFaqData(helperData);
  }, []);

  useEffect(() => {
    filterData();
  }, [search]);

  const filterData = () => {
    if (!!search) {
      const filteredData = helperData.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()),
      );
      setFaqData(filteredData);
    } else {
      setFaqData(helperData);
    }
  };

  const onSearchInput = text => setSearch(text);

  const HeaderCategory = () => {
    return categoryData.map((item, index) => {
      return (
        <TouchableOpacity
          onPress={item.onPress}
          style={[
            localStyles.root,
            {
              borderBottomColor:
                isSelect === item.id ? colors.primary : colors.dark3,
            },
          ]}>
          <CText
            type={'s18'}
            align={'center'}
            style={styles.pb20}
            color={isSelect === item.id ? colors.primary : colors.grayScale7}>
            {item.title}
          </CText>
        </TouchableOpacity>
      );
    });
  };

  const RenderHelper = memo(({helperData}) => {
    return helperData.map((item, index) => {
      return <FaqComponent description={item.description} title={item.title} />;
    });
  });

  const ContactUsRender = memo(() => {
    return contactUsData.map((item, index) => {
      return (
        <TouchableOpacity
          style={[
            localStyles.contactUsContainer,
            {
              backgroundColor: colors.dark ? colors.inputBg : colors.grayScale1,
            },
          ]}>
          <MaterialCommunityIcons
            name={item.icon}
            size={moderateScale(26)}
            color={colors.primary}
            style={styles.ph20}
          />
          <CText type={'b18'}>{item.title}</CText>
        </TouchableOpacity>
      );
    });
  });

  return (
    <CSafeAreaView
      style={{
        backgroundColor: colors.dark ? colors.backgroundColor : colors.white,
      }}>
      <CHeader title={strings.helpCenter} />
      <ScrollView
        bounces={false}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ph20}>
        <View style={localStyles.mainContainer}>
          <HeaderCategory />
        </View>
        {isSelect === 0 ? (
          <View>
            <View style={styles.mt15} />
            <MostPopularCategory chipsData={helperCategoryData} />
            <SearchComponent search={search} onSearchInput={onSearchInput} />
            {!!faqData.length ? (
              <RenderHelper helperData={faqData} />
            ) : (
              <View>
                <CText
                  style={styles.mt15}
                  color={colors.primary}
                  align={'center'}
                  type={'b22'}>
                  {strings.noResultFound}
                </CText>
                <CText
                  style={styles.mt15}
                  color={colors.textColor}
                  align={'center'}
                  type={'r18'}>
                  {strings.noResultFoundDesc}
                </CText>
              </View>
            )}
          </View>
        ) : (
          <ContactUsRender />
        )}
      </ScrollView>
    </CSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  mainContainer: {
    ...styles.flexRow,
    width: '100%',
  },
  root: {
    borderBottomWidth: moderateScale(2),
    width: '50%',
  },
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  controlContainer: {
    ...styles.p15,
    ...styles.rowCenter,
    ...styles.ml10,
    ...styles.mt5,
    borderRadius: moderateScale(15),
  },
  contactUsContainer: {
    ...styles.mt20,
    ...styles.pv20,
    borderRadius: moderateScale(15),
    ...styles.flexRow,
    ...styles.contentCenter,
  },
});
