import API from '../constants/Api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import React from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, ToastAndroid, View } from 'react-native';
import { Notifications } from 'expo';
import { Chart } from '../components/Chart';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { isLoading: true, dataSource: [] };
  }

  componentDidMount() {
    Notifications.addListener(this.handleNotification);
    return this.fetchData();
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

    return fetch(API.host+'/api/charts')
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
    flex: 1,
    marginTop: Layout.mainStatusBarHeight,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
