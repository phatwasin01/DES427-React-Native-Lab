import React, { Component } from "react";

import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Switch,
} from "react-native";

import { LineChart } from "react-native-chart-kit";

import StockButton from "./StockButton.js";

import API from "./api.js";

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientTo: "#08130D",
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`, // color of background
  strokeWidth: 2, // optional, default 3
};

export default class Stocks extends Component {
  constructor(props) {
    super(props);
    this.changeIndex = this.changeIndex.bind(this);
    this.state = {
      dates: ["01/01", "02/01", "03/01", "04/01", "05/01", "06/01", "07/01"],
      prices: [1, 2, 3, 4, 5, 6, 7],
      stockname: "Choose a stock",
      switch: false,
    };

    // this.data = {
    //   labels: this.state.dates,
    //   datasets: [{
    //     data: this.state.prices,
    //     color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // colar of the line
    //     strokeWidth: 2 // optional
    //   }]
    // }
  }

  changeIndex(stockCode, stockName) {
    console.log(stockCode, stockName);
    API(stockCode, this.state.switch).then((stock) => {
      let keyTimeSeries = this.state.switch
        ? "Weekly Time Series"
        : "Time Series (Daily)";
      // console.log(stock);
      let datesArray = Object.keys(stock[keyTimeSeries]).slice(0, 6);
      let closingPrice = [];
      datesArray.forEach((day) => {
        closingPrice.push(stock[keyTimeSeries][day]["4. close"]);
      });
      let datesArrayRev = datesArray.reverse();
      let datesNotincludeYear = datesArrayRev.map((date) => {
        let [year, month, day] = date.split("-");
        return `${day}/${month}`;
      });
      console.log(datesArray);
      console.log(closingPrice);
      console.log(datesArrayRev);
      this.setState({
        dates: datesNotincludeYear,
        prices: closingPrice,
        stockname: stockName,
      });
    });
  }

  render() {
    let message;
    if (this.state.switch) {
      message = "Weekly";
    } else {
      message = "Daily";
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>{this.state.stockname}</Text>
          <LineChart
            data={{
              labels: this.state.dates,
              datasets: [
                {
                  data: this.state.prices,
                  color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // colar of the line
                  strokeWidth: 2, // optional
                },
              ],
            }}
            width={Dimensions.get("window").width}
            height={220}
            chartConfig={chartConfig}
            style={{ paddingVertical: 10 }}
          />
        </View>
        <View style={styles.footer}>
          <StockButton code="AAPL" name="Apple" onPress={this.changeIndex} />
          <StockButton code="GOOGL" name="Google" onPress={this.changeIndex} />
          <StockButton code="UBER" name="Uber" onPress={this.changeIndex} />
        </View>
        <View style={styles.switchContainer}>
          <Text style={{ fontSize: 30 }}>{message}</Text>
          <Switch
            onValueChange={() => {
              this.setState({
                switch: !this.state.switch,
              });
            }}
            value={this.state.switch}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  switchContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  container: {
    flex: 1,
  },
  header: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "pink",
  },
  button: {
    margin: 10,
    borderWidth: 1,
    width: 100,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
  },
});
