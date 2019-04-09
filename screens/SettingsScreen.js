import API from '../constants/Api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import React from 'react';
import { AsyncStorage, Platform, ScrollView, StyleSheet, Switch, Text, ToastAndroid, View } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      settingsDisabled: true,
      settings: {
        notificationsEnabled: false,
      },
    };

    AsyncStorage.getItem('@Notifications:'+this.props.screenProps.expoToken)
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
        <View style={styles.notificationSwitchContainer}>
          <Text style={settingsEnabled ? styles.textLabel : styles.textLabelDisabled}>
            Enable notifications
          </Text>
          <Text style={styles.textLabel}></Text>
          <Switch
            disabled={!settingsEnabled}
            value={settings.notificationsEnabled}
            onValueChange={this.onNotificationsEnabledChange}
          />
        </View>
      </ScrollView>
    );
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
        '@Notifications:'+this.props.screenProps.expoToken,
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
  separator: {
    borderWidth: 0.3,
    borderColor: Colors.text,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    marginTop: Math.round(Layout.sideMargin / 2),
    marginBottom: Math.round(Layout.sideMargin / 2),
  },
});
