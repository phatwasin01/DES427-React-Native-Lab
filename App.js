import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default class BMI extends Component {
  constructor(props) {
    super(props);
    this.state = { weight: "0", height: "0", bmi: 0, color: "black" };
    // this.compute = this.compute.bind(this);
    // if we use arrow function for compute() below
    // we don't need the above line
    // we can alternatively use arrow function in render
  }

  compute = () => {
    console.log("On pressed!");
    let weight = parseFloat(this.state.weight);
    let height = parseFloat(this.state.height);
    let bmiValue = weight / Math.pow(height / 100, 2);
    if (bmiValue < 18.5) {
      this.setState({ color: "orange" });
    } else if (bmiValue < 24.9) {
      this.setState({ color: "green" });
    } else if (bmiValue < 29.9) {
      this.setState({ color: "yellow" });
    } else {
      this.setState({ color: "red" });
    }
    this.setState({ bmi: bmiValue });
  };
  // if use arrow function in render, we don't have to
  // bind in constructor
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.group}>
          <Text style={styles.title}>Weight (KG)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={this.state.weight}
            onChangeText={(weight) => this.setState({ weight })}
          />
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>Height (CM)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={this.state.height}
            onChangeText={(height) => this.setState({ height })}
          />
        </View>
        <View style={styles.center}>
          <View style={styles.group}>
            <Text style={{ ...styles.title, color: this.state.color }}>
              BMI: {this.state.bmi.toFixed(2)}
            </Text>
          </View>
          <View style={styles.group}>
            <TouchableOpacity style={styles.button} onPress={this.compute}>
              <Text style={styles.buttonText}>Compute</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    padding: 20,
  },
  group: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "lightblue",
    padding: 20,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 30,
  },
  input: {
    padding: 10,
    height: 40,
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
  },
  center: {
    alignItems: "center",
  },
});
