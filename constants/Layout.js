import { Dimensions, StatusBar } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  width: width,
  height: height,
  sideMargin: 16,
  mainStatusBarHeight: StatusBar.currentHeight,
  labelFontSize: 18,
  headerFontSize: 24,
  subheaderFontSize: 18,
  normalFontSize: 16,
  timeAxisFontSize: 7,
  weightAxisFontSize: 8,
  chartPadding: {top: 20, bottom: 40, left: 45, right: 15},
};
