import React, { Component } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Button,
} from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";

import MapView, { Marker } from "react-native-maps";
var { width, height } = Dimensions.get("window");

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      errorMessage: null,
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      pin: false,
    };
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    this.handleDropPin = this.handleDropPin.bind(this);
  }

  onRegionChangeComplete(region) {
    this.setState({ region });
  }

  handleDropPin() {
    console.log("pin drop");
    this.setState({ pin: true });
  }

  componentDidMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!",
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied",
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    // console.log(location);
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    // console.log(region);
    this.setState({
      region: region,
      location: location,
    });
  };

  getJSXshow(error) {
    if (error)
      return <Text style={styles.paragraph}>{this.state.errorMessage}</Text>;
    else {
      return (
        <View>
          <MapView
            style={styles.map}
            region={this.state.region}
            onRegionChangeComplete={this.onRegionChangeComplete}
          >
            {this.state.pin ? (
              <Marker
                key={"key"}
                coordinate={{
                  latitude: this.state.region.latitude,
                  longitude: this.state.region.longitude,
                }}
                title={"my location"}
                description={
                  String(this.state.region.latitude) +
                  ", " +
                  String(this.state.region.longitude)
                }
                fixed
              />
            ) : null}
          </MapView>
          <View>
            <Button title="Drop Pin" onPress={this.handleDropPin} />
          </View>
        </View>
      );
    }
  }

  render() {
    // let text = 'Waiting..';
    let error;
    if (this.state.errorMessage) {
      error = true;
    } else if (this.state.location) {
      error = false;
    }

    return <View style={styles.container}>{this.getJSXshow(error)}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#ecf0f1",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center",
  },
  map: {
    width: width,
    height: Math.floor((height * 80) / 100),
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
});
