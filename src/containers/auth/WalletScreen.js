import React, { useState } from 'react';

//Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import SubHeader from '../../components/SubHeader';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import CText from '../../components/common/CText';
import { styles } from '../../themes';
import CInput from '../../components/common/CInput';
import CButton from '../../components/common/CButton';
import strings from '../../i18n/strings';
import { StackNav } from '../../navigation/NavigationKeys';

import {
  transact,
  Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";

const WalletScreen = ({ navigation }) => {
  const [name, setName] = useState('');

  const onChangeText = val => setName(val);
  const onPressContinue = () => navigation.navigate(StackNav.GenderScreen);

  return (
    <CSafeAreaView>
      <SubHeader status={1} nothing />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <CText type={'B30'}>{strings.question1}</CText>
        <CInput
          label={strings.fullName}
          placeholder={strings.enterYourName}
          onChangeText={onChangeText}
          _value={name}
          containerStyle={styles.mt20}
          inputContainerStyle={styles.textInputContainerStyle}
          inputBoxStyle={styles.textInputStyle}
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

export default WalletScreen;
