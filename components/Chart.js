import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { VictoryArea, VictoryAxis, VictoryBar, VictoryChart, VictoryLine, VictoryTheme } from "victory-native";

export class Chart extends React.Component {
  render() {
    const { item } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>{item.name}</Text>
        { this.renderChart(item.type, item.data) }
      </View>
    );
  }

  renderChart = (type, data) => {
    if (data.length === 0) {
      return (<Text style={styles.subheaderText}>No data</Text>);
    }
    switch (type) {
      case 'line':
        return (
          <VictoryChart width={Layout.width} theme={VictoryTheme.material} padding={Layout.chartPadding}>
            <VictoryAxis
              tickCount={12}
              tickFormat={(t) => `${this.formatTimeAxis(t)}`}
              style={{
                axis: {stroke: Colors.chartAxis},
                grid: {stroke: Colors.chartGrid},
                ticks: {stroke: Colors.chartAxis},
                tickLabels: {fontSize: Layout.timeAxisFontSize, color: Colors.text}
              }}
            />
            <VictoryAxis
              dependentAxis
              tickCount={12}
              tickFormat={(t) => `${this.formatWeightAxis(t)}`}
              style={{
                axis: {stroke: Colors.chartAxis},
                grid: {stroke: Colors.chartGrid},
                ticks: {stroke: Colors.chartAxis},
                tickLabels: {fontSize: Layout.weightAxisFontSize, color: Colors.text}
              }}
            />
            <VictoryLine
              data={data}
              style={{data: {stroke: Colors.chartLine }}}
              interpolation="cardinal"
            />
          </VictoryChart>
        );
      case 'bar':
        return (
          <VictoryChart width={Layout.width} theme={VictoryTheme.material} domainPadding={5} padding={Layout.chartPadding}>
            <VictoryAxis
              tickCount={12}
              tickFormat={(t) => `${this.formatTimeAxis(t)}`}
              style={{
                axis: {stroke: Colors.chartAxis},
                ticks: {stroke: Colors.chartAxis},
                tickLabels: {fontSize: Layout.timeAxisFontSize, color: Colors.text}
              }}
            />
            <VictoryAxis
              dependentAxis
              tickCount={12}
              tickFormat={(t) => `${this.formatWeightAxis(t)}`}
              style={{
                axis: {stroke: Colors.chartAxis},
                ticks: {stroke: Colors.chartAxis},
                tickLabels: {fontSize: Layout.weightAxisFontSize, color: Colors.text}
              }}
            />
            <VictoryBar
              data={data}
              style={{data: {fill: Colors.chartFill }}}
            />
          </VictoryChart>
        );
      case 'area':
        return (
          <VictoryChart width={Layout.width} theme={VictoryTheme.material} padding={Layout.chartPadding}>
            <VictoryAxis
              tickCount={12}
              tickFormat={(t) => `${this.formatTimeAxis(t)}`}
              style={{
                axis: {stroke: Colors.chartAxis},
                ticks: {stroke: Colors.chartAxis},
                tickLabels: {fontSize: Layout.timeAxisFontSize, color: Colors.text}
              }}
            />
            <VictoryAxis
              dependentAxis
              tickCount={12}
              tickFormat={(t) => `${this.formatWeightAxis(t)}`}
              style={{
                axis: {stroke: Colors.chartAxis},
                ticks: {stroke: Colors.chartAxis},
                tickLabels: {fontSize: Layout.weightAxisFontSize, color: Colors.text}
              }}
            />
            <VictoryArea
              data={data}
              style={{data: {fill: Colors.chartFill }}}
              interpolation="cardinal"
            />
          </VictoryChart>
        );
    }
  }

  formatTimeAxis = (timestamp) => {
    const date = new Date(timestamp * 1000);
    if (date) {
      return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    }
    return timestamp;
  }

  formatWeightAxis = (weightInGrams) => {
    return (weightInGrams / 1000).toFixed(1) + ' kg';
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: Math.round(Layout.sideMargin / 2),
    marginBottom: Math.round(Layout.sideMargin / 2),
  },
  headerText: {
    fontSize: Layout.headerFontSize,
    color: Colors.text,
    textAlign: 'center',
  },
  subheaderText: {
    fontSize: Layout.subheaderFontSize,
    color: Colors.text,
    textAlign: 'center',
  },
});
