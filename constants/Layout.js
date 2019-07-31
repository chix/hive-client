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
  timeAxisFontSize: 12,
  weightAxisFontSize: 12,
  chartPadding: {top: 20, bottom: 40, left: 50, right: 15},
};
