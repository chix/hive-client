import API from '../constants/Api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import React from 'react';
import { ActivityIndicator, FlatList, Picker, Platform, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { Notifications } from 'expo';
import { Chart } from '../components/Chart';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { isLoading: true, chartType: 'line', chartMode: 'hourly', dataSource: [] };
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
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Data:</Text>
          <Picker
            selectedValue={this.state.chartMode}
            style={styles.picker}
            mode="dropdown"
            onValueChange={(itemValue) => {
              if (itemValue !== this.state.chartMode) {
                this.setState({chartMode: itemValue}, this.fetchData);
              }
            }}
          >
            <Picker.Item label="Hourly" value="hourly" />
            <Picker.Item label="Daily" value="daily" />
          </Picker>
        </View>
        <FlatList
          data={this.state.dataSource}
          renderItem={(item) => <Chart {...item}/>}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={this.fetchData}
          refreshing={this.state.isLoading}
          style={styles.chartsContainer}
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

    return fetch(API.host+'/api/charts/'+this.state.chartMode+'/'+this.state.chartType)
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
  chartsContainer: {
    marginTop: 30
  },
  pickerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  pickerLabel: {
    height: 30,
    width: 120,
    marginTop: 2,
    textAlign: 'right',
    fontSize: Layout.labelFontSize,
    color: Colors.text
  },
  picker: {
    width: 120,
    height: 30,
    color: Colors.text
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
