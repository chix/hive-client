import API from '../constants/Api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import React from 'react';
import { ActivityIndicator, AsyncStorage, FlatList, Platform, StyleSheet, ToastAndroid, View } from 'react-native';
import { Notifications } from 'expo';
import { Chart } from '../components/Chart';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = { isLoading: true, chartType: 'line', dataGranularity: 'hourly', dataSource: [] };
  }

  componentDidMount() {
    const { navigation } = this.props;

    Notifications.addListener(this.handleNotification);

    this.focusListener = navigation.addListener("didFocus", () => {
      AsyncStorage.getItem('@Settings:main')
      .then((settings) => {
        this.applySettings(settings);
      });
    });

    AsyncStorage.getItem('@Settings:main')
    .then((settings) => {
      if (!this.applySettings(settings)) {
        this.fetchData();
      }
    });
  }

  applySettings(settings) {
    if (settings !== null) {
      const parsedSettings = JSON.parse(settings);
      let newState = {};
      if (parsedSettings.dataGranularity && this.state.dataGranularity !== parsedSettings.dataGranularity) {
        newState.dataGranularity = parsedSettings.dataGranularity;
      }
      if (parsedSettings.chartType && this.state.chartType !== parsedSettings.chartType) {
        newState.chartType = parsedSettings.chartType;
      }
      if (Object.keys(newState).length > 0) {
        this.setState(newState, this.fetchData);
        return true;
      }
    }
    return false;
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large"/>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.dataSource}
          renderItem={(item) => <Chart {...item}/>}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={this.fetchData}
          refreshing={this.state.isLoading}
        >
        </FlatList>
      </View>
    );
  }

  onRefresh = async () => {
    return this.fetchData();
  }

  fetchData = async () => {
    this.setState({isLoading: true});

    return fetch(API.host+'/api/charts/'+this.state.dataGranularity+'/'+this.state.chartType)
      .then((response) => {
        if (response.ok === false) {
          throw new Error(response.statusText);
        }
        return response.json()
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson,
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          dataSource: [],
        }, () => {
          if (Platform.OS === 'android') {
            ToastAndroid.showWithGravity('Could not fetch data, no connection.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
          }
        });
      });
  }

  handleNotification = (notification) => {
    const { navigate } = this.props.navigation;

    if (notification.origin === 'selected') {
      navigate('Home');
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Layout.mainStatusBarHeight,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
