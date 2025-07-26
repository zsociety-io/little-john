// // Tab Routes
import HomeTab from '../containers/tabbar/home/HomeTab';
import PortfolioTab from '../containers/tabbar/portfolio/PortfolioTab';
import DiscoverTab from '../containers/tabbar/discover/DiscoverTab';
import MoreTab from '../containers/tabbar/more/MoreTab';
import AccountTab from '../containers/tabbar/account/AccountTab';

// // // Screens Route
import Splash from '../containers/auth/Splash';
import OnBoarding from '../containers/OnBoarding';
import TabBar from './Type/TabBarNavigation';
import NameScreen from '../containers/auth/NameScreen';
import WalletScreen from '../containers/auth/WalletScreen';
import GenderScreen from '../containers/auth/GenderScreen';
import BirthdayScreen from '../containers/auth/BirthdayScreen';
import BirthPlaceScreen from '../containers/auth/BirthPlaceScreen';
import InvestmentScreen from '../containers/auth/InvestmentScreen';
import ExperienceInvestmentScreen from '../containers/auth/ExperienceInvestmentScreen';
import SavingWithInvestingScreen from '../containers/auth/SavingWithInvestingScreen';
import WorkTypeScreen from '../containers/auth/WorkTypeScreen';
import CompanyNameScreen from '../containers/auth/CompanyNameScreen';
import OccupationScreen from '../containers/auth/OccupationScreen';
import UploadIDScreen from '../containers/auth/UploadIDScreen';
import IdAddressScreen from '../containers/auth/IdAddressScreen';
import HouseStatusScreen from '../containers/auth/HouseStatusScreen';
import SelfieScreen from '../containers/auth/SelfieScreen';
import SelfieImageScreen from '../containers/auth/SelfieImageScreen';
import EmergencyContactScreen from '../containers/auth/EmergencyContactScreen';
import ContactDetailScreen from '../containers/auth/ContactDetailScreen';
import TermsAndConditionScreen from '../containers/auth/TermsAndConditionScreen';
import Signature from '../containers/auth/SignatureScreen';
import UnlockScreen from '../containers/auth/UnlockScreen';
import SetPinScreen from '../containers/auth/SetPinScreen';
import EmailScreen from '../containers/auth/EmailScreen';
import EmailVerifyScreen from '../containers/auth/EmailVerifyScreen';
import InviteFriend from '../containers/tabbar/account/InviteFriend';
import MyRewards from '../containers/tabbar/account/MyRewards';
import Security from '../containers/tabbar/account/Security';
import HelpCenter from '../containers/tabbar/account/HelpCenter';
import Language from '../containers/tabbar/account/Language';
import NotificationSetting from '../containers/tabbar/account/NotificationSetting';
import PersonalInfo from '../containers/tabbar/account/PersonalInfo';
import AboutOtrade from '../containers/tabbar/account/AboutOtrade';
import DeveloperSettings from '../containers/tabbar/account/DeveloperSettings';
import ExchangeStock from '../containers/tabbar/more/ExchangeStock';
import PreviewExchange from '../containers/tabbar/more/PreviewExchange';
import OrderSuccessful from '../containers/tabbar/more/OrderSuccessful';
import DepositPaymentRecept from '../containers/tabbar/more/DepositPaymentRecept';
import DepositToOtrade from '../containers/tabbar/more/DepositToOtrade';
import DepositToOtradePayment from '../containers/tabbar/more/DepositToOtradePayment';
import WithdrawalAccount from '../containers/tabbar/more/WithdrawalAccount';
import AddBankAccount from '../containers/tabbar/more/AddBankAccount';
import BankAccountDetail from '../containers/tabbar/more/BankAccountDetail';
import ConfirmBankAccountDetail from '../containers/tabbar/more/ConfirmBankAccountDetail';
import PreviewWithdraw from '../containers/tabbar/more/PreviewWithdraw';
import WithdrawSuccess from '../containers/tabbar/more/WithdrawSuccess';
import FundingActivity from '../containers/tabbar/more/FundingActivity';
import PaymentMethods from '../containers/tabbar/more/PaymentMethods';
import FinancialTransaction from '../containers/tabbar/more/FinancialTransaction';
import AllStocks from '../containers/tabbar/discover/AllStocks';
import MyWishlist from '../containers/tabbar/home/MyWishlist';
import MyStocks from '../containers/tabbar/home/MyStocks';
import Notification from '../containers/tabbar/home/Notification';
import StockDetailScreen from '../containers/tabbar/home/StockDetailScreen';
import BuySell from '../containers/tabbar/home/BuySell';
import BuySellOption from '../containers/tabbar/home/BuySellOption';
import BuySellPreview from '../containers/tabbar/home/BuySellPreview';
import BuySellSuccessful from '../containers/tabbar/home/BuySellSuccessful';
import StakeAction from '../containers/tabbar/home/StakeAction';
import StakePreview from '../containers/tabbar/home/StakePreview';
import StakeSuccessful from '../containers/tabbar/home/StakeSuccessful';
import NewsScreen from '../containers/tabbar/home/NewsScreen';
import SPOTMarketStats from '../containers/tabbar/home/SPOTMarketStats';
// Transfer screens
import TransferEntryScreen from '../containers/tabbar/transfer/TransferEntryScreen';
import TransferConfirmScreen from '../containers/tabbar/transfer/TransferConfirmScreen';
import TransferResultScreen from '../containers/tabbar/transfer/TransferResultScreen';
import TransferHistoryScreen from '../containers/tabbar/transfer/TransferHistoryScreen';
import AssetSelectorScreen from '../containers/tabbar/transfer/AssetSelectorScreen';
// Common screens
import IncommingFeature from '../containers/common/IncommingFeature';

export const TabRoute = {
  HomeTab,
  DiscoverTab,
  PortfolioTab,
  MoreTab,
  AccountTab,
};

export const StackRoute = {
  Splash,
  OnBoarding,
  TabBar,
  WalletScreen,
  NameScreen,
  GenderScreen,
  BirthdayScreen,
  BirthPlaceScreen,
  InvestmentScreen,
  ExperienceInvestmentScreen,
  SavingWithInvestingScreen,
  WorkTypeScreen,
  CompanyNameScreen,
  OccupationScreen,
  UploadIDScreen,
  IdAddressScreen,
  HouseStatusScreen,
  SelfieScreen,
  SelfieImageScreen,
  EmergencyContactScreen,
  ContactDetailScreen,
  TermsAndConditionScreen,
  Signature,
  UnlockScreen,
  SetPinScreen,
  EmailScreen,
  EmailVerifyScreen,
  InviteFriend,
  MyRewards,
  Security,
  HelpCenter,
  Language,
  NotificationSetting,
  PersonalInfo,
  AboutOtrade,
  DeveloperSettings, 
  ExchangeStock,
  PreviewExchange,
  OrderSuccessful,
  DepositPaymentRecept,
  DepositToOtrade,
  DepositToOtradePayment,
  WithdrawalAccount,
  AddBankAccount,
  BankAccountDetail,
  ConfirmBankAccountDetail,
  PreviewWithdraw,
  WithdrawSuccess,
  FundingActivity,
  PaymentMethods,
  FinancialTransaction,
  AllStocks,
  MyWishlist,
  MyStocks,
  Notification,
  StockDetailScreen,
  BuySell,
  BuySellOption,
  BuySellPreview,
  BuySellSuccessful,
  StakeAction,
  StakePreview,
  StakeSuccessful,
  NewsScreen,
  SPOTMarketStats,
  // Transfer screens
  TransferEntryScreen,
  TransferConfirmScreen,
  TransferResultScreen,
  TransferHistoryScreen,
  AssetSelectorScreen,
  // Common screens
  IncommingFeature,
};
