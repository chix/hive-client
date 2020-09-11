import API from '../constants/Api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import React from 'react';
import { AsyncStorage, Picker, Platform, ScrollView, StyleSheet, Switch, Text, ToastAndroid, View } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      settingsDisabled: true,
      settings: {
        dataGranularity: 'hourly',
        chartType: 'line',
        notificationsEnabled: false,
      },
    };

    AsyncStorage.getItem('@Settings:main')
    .then((settings) => {
      if (settings !== null) {
        const parsedSettings = this.getSettings(JSON.parse(settings));
        this.setState({
          settingsDisabled: false,
          settings: parsedSettings,
        });
      } else {
        this.setState({settingsDisabled: false});
      }
    });
  }

  render() {
    const settings = this.state.settings;
    const settingsEnabled = !this.state.settingsDisabled;
    const notificationsEnabled = settingsEnabled && settings.notificationsEnabled;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.chartTypePickerContainer}>
          <Text style={settingsEnabled ? styles.textLabel : styles.textLabelDisabled}>
            Chart type
          </Text>
          <Text style={styles.textLabel}></Text>
          <Picker
            disabled={!settingsEnabled}
            selectedValue={settings.chartType}
            onValueChange={this.onChartTypeChange}
            style={styles.picker}
          >
            <Picker.Item label="Line" value="line" />
            <Picker.Item label="Bar" value="bar" />
            <Picker.Item label="Area" value="area" />
          </Picker>
        </View>

        <View style={styles.separator}/>

        <View style={styles.dataGranularityPickerContainer}>
          <Text style={settingsEnabled ? styles.textLabel : styles.textLabelDisabled}>
            Data granularity
          </Text>
          <Text style={styles.textLabel}></Text>
          <Picker
            disabled={!settingsEnabled}
            selectedValue={settings.dataGranularity}
            onValueChange={this.onDataGranularityChange}
            style={styles.picker}
          >
            <Picker.Item label="Hourly" value="hourly" />
            <Picker.Item label="Daily" value="daily" />
          </Picker>
        </View>

        <View style={styles.separator}/>

        <View style={styles.notificationSwitchContainer}>
          <Text style={settingsEnabled ? styles.textLabel : styles.textLabelDisabled}>
            Enable notifications
          </Text>
          <Text style={styles.textLabel}></Text>
          <Switch
            disabled={!settingsEnabled}
            value={settings.notificationsEnabled}
            onValueChange={this.onNotificationsEnabledChange}
            trackColor={{false: Colors.buttonOff, true: Colors.buttonLight}}
            thumbColor={settings.notificationsEnabled ? Colors.button : Colors.buttonOffLight}
          />
        </View>
      </ScrollView>
    );
  }

  onChartTypeChange = (value) => {
    this.persistSettings({chartType: value});
  }

  onDataGranularityChange = (value) => {
    this.persistSettings({dataGranularity: value});
  }

  onNotificationsEnabledChange = (value) => {
    this.persistSettings({notificationsEnabled: value});
  }

  getSettings = (newSettings) => {
    let settings = this.state.settings;
    if (newSettings !== undefined) {
      settings = {...this.state.settings, ...newSettings};
    }
    return settings;
  }

  persistSettings = async (newSettings) => {
    const settings = this.getSettings(newSettings);
    let filters = {};

    return fetch(API.host+'/api/push-notification-token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: this.props.screenProps.expoToken,
        enabled: settings.notificationsEnabled,
        filters: filters,
      }),
    })
    .then((response) => {
      if (response.ok === false) {
        throw new Error(response.statusText);
      }
      return AsyncStorage.setItem(
        '@Settings:main',
        JSON.stringify(settings)
      ).
      then(() => {
        this.setState({settings: settings});
      });
    })
    .catch(() => {
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity('Could not save settings, no connection.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Layout.mainStatusBarHeight,
    paddingTop: Math.round(Layout.sideMargin / 2),
    backgroundColor: Colors.background,
  },
  chartTypePickerContainer: {
    flex: 1,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataGranularityPickerContainer: {
    flex: 1,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationSwitchContainer: {
    flex: 1,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textLabel: {
    fontSize: Layout.labelFontSize,
    color: Colors.text,
  },
  textLabelDisabled: {
    fontSize: Layout.labelFontSize,
    color: Colors.disabledText,
  },
  text: {
    color: Colors.text,
  },
  picker: {
    height: 24,
    width: 120,
    color: Colors.text
  },
  separator: {
    borderWidth: 0.2,
    borderColor: Colors.text,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    marginTop: Math.round(Layout.sideMargin / 2),
    marginBottom: Math.round(Layout.sideMargin / 2),
  },
});
