import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import Constants from "expo-constants";
import * as Location from "expo-location";

// https://www.npmjs.com/package/react-native-open-maps
import openMap from "react-native-open-maps";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["Setting a timer"]);

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get } from "firebase/database";

const firebaseConfig = {};
initializeApp(firebaseConfig);

import MapView from "react-native-maps";
var { width, height } = Dimensions.get("window");

const RADIUS = 20;

function _onRestaurantPress(latlong) {
  if (typeof latlong !== "string") throw "latlong must be a string";
  let data = latlong.split(",");
  let lat = parseFloat(data[0]);
  let long = parseFloat(data[1]);
  openMap({ latitude: lat, longitude: long, end: latlong });
}

function Restaurant(props) {
  return (
    <TouchableHighlight
      onPress={() => _onRestaurantPress(props.gps)}
      underlayColor="white"
    >
      <View style={styles.restaurant}>
        <Text style={{ fontSize: 20 }}>{props.name}</Text>
        <Text style={{ fontSize: 12 }}>
          วันทำการ {props.open_day} เวลาทำการ {props.open_time}
        </Text>
        <Text style={{ fontSize: 12 }}>โทรศัพท์ {props.phone}</Text>
        <View style={{ flexDirection: "row" }}>
          <Image source={{ uri: props.food_img[0] }} style={styles.food_img} />
          <Image source={{ uri: props.food_img[1] }} style={styles.food_img} />
          <Image source={{ uri: props.food_img[2] }} style={styles.food_img} />
        </View>
      </View>
    </TouchableHighlight>
  );
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.restaurantRef = ref(getDatabase(), "restaurant/");
    this.state = {
      searchText: "",
      isShowNearby: true,
      restaurantData: null,
      location: null,
      errorMessage: null,
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);

    this._readDB();
  }

  _onPressButton() {
    if (this.state.restaurantData) {
      // data is loaded from firebase
      const restaurantData = this.state.restaurantData;
      var restaurantFound = []; // restaurant found put here

      // regex stuffs
      let patt = new RegExp(this.state.searchText, "i"); // build regex pattern

      // search for restaurant by name or type
      for (let i = 0; i < restaurantData.length; i++) {
        const res_name = restaurantData[i].name;
        const res_type = restaurantData[i].type; // get the restaurant type

        var result_name = res_name.match(patt);
        var result_type = res_type.match(patt); // match with restaurant type

        if (result_name || result_type) {
          // if either name or type matches, a result is found
          restaurantFound.push(restaurantData[i]);
        }
      }

      this.setState({
        isShowNearby: false,
        searchResult: restaurantFound,
      });
    }
  }

  onRegionChangeComplete(region) {
    this.setState({ region });
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
    console.log(region);
    this.setState({
      region: region,
      location: location,
    });
  };

  _readDB() {
    get(this.restaurantRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.setState({ restaurantData: snapshot.val() });
          console.log(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  _computeDistance(lat1, lon1, lat2, lon2) {
    lat1 = parseFloat(lat1);
    lon1 = parseFloat(lon1);
    lat2 = parseFloat(lat2);
    lon2 = parseFloat(lon2);

    var toRadians = (deg) => {
      return (deg * Math.PI) / 180;
    };
    // https://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371e3; // metres
    var phi1 = toRadians(lat1);
    var phi2 = toRadians(lat2);
    var delta_phi = toRadians(lat2 - lat1);
    var delta_lambda = toRadians(lon2 - lon1);

    var a =
      Math.sin(delta_phi / 2) * Math.sin(delta_phi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(delta_lambda / 2) *
        Math.sin(delta_lambda / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;

    return d; // in metres
  }

  _isWithinRadius(latlong) {
    /*
    latlong is string of latlong, e.g. "13.6565217,100.6212236"
    this function computes the distance from current location
    (this.state.location.coords.latitude, this.state.location.coords.longitude)
    to latlong and determine if it's within RADIUS km 
    */

    var distance, lat, long;

    if (typeof latlong !== "string") throw "latlong must be a string";
    data = latlong.split(",");
    lat = parseFloat(data[0]);
    long = parseFloat(data[1]);

    // compute the distance from current location to latlong
    if (this.state.location) {
      currentLat = this.state.location.coords.latitude;
      currentLong = this.state.location.coords.longitude;
      distance = this._computeDistance(lat, long, currentLat, currentLong);
    } else {
      throw "location is not available yet";
    }

    if (distance <= RADIUS * 1000) return true;
    else return false;
  }

  showNearby() {
    if (this.state.restaurantData) {
      const restaurantData = this.state.restaurantData;
      var nearbyRestaurantData = [];
      if (this.state.location != null) {
        for (let i = 0; i < restaurantData.length; i++) {
          if (this._isWithinRadius(restaurantData[i].gps)) {
            nearbyRestaurantData.push(restaurantData[i]);
          }
        }
      }
      return (
        <View style={styles.restaurantContainer}>
          <ScrollView style={{ flex: 1 }}>
            {nearbyRestaurantData.map((res_data, i) => {
              return (
                <Restaurant
                  key={i}
                  name={res_data.name}
                  open_day={res_data.open_day}
                  open_time={res_data.open_time}
                  phone={res_data.phone}
                  food_img={res_data.images}
                  gps={res_data.gps}
                />
              );
            })}
            {/* workaround for scrollview cutoff at the bottom */}
            <Image source={require("./images/bottom_filler.png")} />
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.restaurantContainer}>
          <Text>Please Wait</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  }

  showSearchResult() {
    if (this.state.searchResult[0]) {
      return (
        <View style={styles.restaurantContainer}>
          <ScrollView style={{ flex: 1 }}>
            {this.state.searchResult.map((res_data, i) => {
              return (
                <Restaurant
                  key={i}
                  name={res_data.name}
                  open_day={res_data.open_day}
                  open_time={res_data.open_time}
                  phone={res_data.phone}
                  food_img={res_data.images}
                  gps={res_data.gps}
                />
              );
            })}
            {/* workaround for scrollview cutoff at the bottom */}
            <Image source={require("./images/bottom_filler.png")} />
          </ScrollView>
        </View>
      );
    } else {
      return <Text>No restaurant found</Text>;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Restaurant Search</Text>
        <View style={styles.searchArea}>
          <TextInput
            style={{ height: 20, width: 300, fontSize: 20 }}
            placeholder="Search"
            onChangeText={(text) => this.setState({ searchText: text })}
          />
          <TouchableHighlight
            onPress={() => this._onPressButton()}
            underlayColor="white"
          >
            <View style={styles.searchButton}>
              <Image
                style={{ height: 30, width: 30 }}
                source={require("./images/search_icon.png")}
              />
            </View>
          </TouchableHighlight>
        </View>
        <View>
          {this.state.isShowNearby
            ? this.showNearby()
            : this.showSearchResult()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  title: {
    fontSize: 20,
    padding: 10,
  },
  searchArea: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#E5E4E3",
    borderRadius: 10,
    alignItems: "center",
  },
  restaurantContainer: {
    padding: 5,
    margin: 10,
    backgroundColor: "#E5E4E3",
    width: 350,
    flex: 1,
  },
  restaurant: {
    padding: 5,
    margin: 5,
    backgroundColor: "#FFFFFF",
  },
  food_img: {
    width: 100,
    height: 100,
    margin: 3,
  },
});
