import React from "react";
import {
  Button,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Toast, { DURATION } from "react-native-easy-toast";

import API from "./api.js";

var NUM_MOVIES = 5; // number of movies to display on the list screen

class ListScreen extends React.Component {
  constructor() {
    super();
    this.loadMovie = this.loadMovie.bind(this);
    this.state = {
      title: "",
      listData: Array(5).fill(null),
    };
  }

  loadMovie(title) {
    API(title)
      .then((data) => {
        if (!data || !data.results || data.results.length == 0) {
          this.toast.show("Error: No data returned", 2000);
          return;
        }
        let movies = data.results; // array of movies
        movies = movies.slice(0, NUM_MOVIES); // Take only the first NUM_MOVIES movies
        const listData = this.state.listData.slice();
        for (let i = 0; i < NUM_MOVIES; i++) listData[i] = movies[i];
        this.setState({
          listData: listData,
        });
      })
      .catch((error) => {
        this.toast.show("Error: " + error.message, 2000);
      });
  }

  render() {
    let pic = {
      uri: "https://image.tmdb.org/t/p/w200/jIjdFXKUNtdf1bwqMrhearpyjMj.jpg",
    };
    const listData = this.state.listData.slice();
    // show this at when the app first loads
    let dataToShow = [
      { key: "Movie 1", imgSource: require("./image_not_found.png") },
      { key: "Movie 2", imgSource: require("./image_not_found.png") },
      { key: "Movie 3", imgSource: require("./image_not_found.png") },
      { key: "Movie 4", imgSource: require("./image_not_found.png") },
      { key: "Movie 5", imgSource: require("./image_not_found.png") },
    ];
    // api call successful, listData is not null array
    if (listData[0] !== null) {
      dataToShow = [];
      for (let k = 0; k < NUM_MOVIES; k++) {
        let imgURI = "https://image.tmdb.org/t/p/w200/";
        imgURI += listData[k].poster_path;
        new_obj = {
          key: listData[k].title,
          imgSource: { uri: imgURI },
          vote_average: listData[k].vote_average,
          overview: listData[k].overview,
          release_date: listData[k].release_date,
        };
        dataToShow.push(new_obj);
      }
    }

    return (
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              this.setState({ title: text });
            }}
          />
          <Button
            title="Search"
            onPress={() => {
              this.loadMovie(this.state.title);
            }}
          />
        </View>
        <Text style={{ fontSize: 30 }}>List Screen</Text>
        <FlatList
          data={dataToShow}
          renderItem={({ item }) => {
            return (
              <TouchableHighlight
                onPress={() => {
                  this.props.navigation.navigate("Details", {
                    movieName: item.key,
                    poster: item.imgSource,
                    vote_average: item.vote_average,
                    overview: item.overview,
                    release_date: item.release_date,
                  });
                }}
              >
                <View style={styles.row}>
                  <Image style={styles.image} source={item.imgSource} />
                  <Text style={styles.title}>{item.key}</Text>
                </View>
              </TouchableHighlight>
            );
          }}
        />
        <Toast
          ref={(toast) => (this.toast = toast)}
          style={{ backgroundColor: "red" }}
          position="bottom"
          positionValue={300}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "white" }}
        />
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  render() {
    const { movieName, poster, vote_average, overview, release_date } =
      this.props.route.params;

    return (
      <View style={{ padding: 20, flexDirection: "row" }}>
        <View style={{ flex: 2 }}>
          <Image style={styles.image} source={poster} />
          <Text> Rating: {vote_average} </Text>
        </View>
        <View style={{ flex: 3, padding: 10 }}>
          <Text style={{ fontSize: 20 }}> {movieName} </Text>
          <View
            style={{ height: 1, backgroundColor: "lightgray", margin: 5 }}
          />
          <Text> Released on: {release_date} </Text>
          <View
            style={{ height: 1, backgroundColor: "lightgray", margin: 5 }}
          />
          <Text> Plot: {overview} </Text>
        </View>
      </View>
    );
  }
}

const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={ListScreen}
            options={{
              title: "Movie Explorer",
              headerStyle: {
                backgroundColor: "darkred",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{
              title: "Movie Explorer",
              headerStyle: {
                backgroundColor: "darkred",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
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
  row: {
    flexDirection: "row",
    height: 100,
    flex: 1,
  },
  image: {
    height: 100,
    flex: 2,
  },
  title: {
    fontSize: 20,
    flex: 5,
    padding: 20,
    borderWidth: 1,
  },
  input: {
    height: 40,
    width: 250,
    borderWidth: 1,
    padding: 10,
  },
});
