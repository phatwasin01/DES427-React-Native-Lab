import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  Image,
} from "react-native";

import MapView from "react-native-maps";
import { Marker } from "react-native-maps"; // https://github.com/react-native-maps/react-native-maps/issues/4544#issuecomment-1336477217
import { Callout } from "react-native-maps";

var { width, height } = Dimensions.get("window");

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 13.764884,
        longitude: 100.538265,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      markerRefs: [],
      markers: [
        {
          latlng: { latitude: 13.764884, longitude: 100.538265 },
          title: "Victory Monument",
          image: require("./images/attention.png"),
          description: "A large military monument in Bangkok, Thailand.",
          photo: require("./images/Victory_Monument.jpg"),
        },
        {
          latlng: { latitude: 13.763681, longitude: 100.538125 },
          title: "Saxophone Club",
          image: require("./images/music.png"),
          description: "A music pub for saxophone lover",
          photo: require("./images/Saxophone.jpg"),
        },
        {
          latlng: { latitude: 13.764595, longitude: 100.537438 },
          title: "COCO Department Store",
          image: require("./images/shopping.png"),
          description: "A fashion department store",
          photo: require("./images/coco.jpg"),
        },
      ],
    };
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    this.moveMaptoLocation = this.moveMaptoLocation.bind(this);
  }

  onRegionChangeComplete(region) {
    this.setState({ region });
  }

  moveMaptoLocation(region) {
    console.log(region);
    this.setState({ region });
    //sleep for 0.1 sec

    setTimeout(() => {
      const indexRegion = this.state.markers.findIndex(
        (marker) =>
          marker.latlng.latitude === region.latitude &&
          marker.latlng.longitude === region.longitude
      );
      this.state.markerRefs[indexRegion].showCallout();
    }, 100);
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
          {/* https://github.com/react-native-maps/react-native-maps/issues/4544#issuecomment-1336477217 */}
          {this.state.markers.map((marker, i) => {
            return (
              <Marker
                key={i}
                coordinate={marker.latlng}
                title={marker.title}
                description={marker.description}
                image={marker.image}
                ref={(ref) => (this.state.markerRefs[i] = ref)}
              >
                <Callout>
                  <View style={styles.callout}>
                    <Image style={styles.calloutPhoto} source={marker.photo} />
                    <Text style={styles.calloutTitle}>{marker.title}</Text>
                    <Text>{marker.description}</Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
        <View style={styles.container}>
          <View style={{ padding: 5 }}>
            <Button
              title="Victory Monument"
              onPress={() =>
                this.moveMaptoLocation({
                  latitude: 13.764884,
                  longitude: 100.538265,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                })
              }
            />
          </View>
          <View style={{ padding: 5 }}>
            <Button
              title="Saxophone Club"
              onPress={() =>
                this.moveMaptoLocation({
                  latitude: 13.763681,
                  longitude: 100.538125,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                })
              }
            />
          </View>
          <View style={{ padding: 5 }}>
            <Button
              title="Coco Department Store"
              onPress={() =>
                this.moveMaptoLocation({
                  latitude: 13.764595,
                  longitude: 100.537438,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                })
              }
            />
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
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  map: {
    width: width,
    height: Math.floor((height * 2) / 3),
  },
  callout: {
    flex: 1,
    paddingRight: 10,
    paddingBottom: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  calloutPhoto: {
    flex: 1,
    width: 166,
    height: 83,
  },
  calloutTitle: {
    fontSize: 16,
  },
});
