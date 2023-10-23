import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
console.log(width, height);
const EventsExample = () => {
  const pressed = useSharedValue(false);
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      pressed.value = true;
      ctx.startX = x.value;
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
      y.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      pressed.value = false;

      const snapThreshold = 0;
      const objectSize = 50;

      if (x.value <= 0 + snapThreshold && y.value <= 0 + snapThreshold) {
        x.value = withSpring(-width / 2 + objectSize);
        y.value = withSpring(-height / 2 + objectSize);
      } else if (x.value >= 0 - snapThreshold && y.value <= 0 + snapThreshold) {
        x.value = withSpring(width / 2 - objectSize);
        y.value = withSpring(-height / 2 + objectSize);
      } else if (x.value <= 0 + snapThreshold && y.value >= 0 - snapThreshold) {
        x.value = withSpring(-width / 2 + objectSize);
        y.value = withSpring(height / 2 - objectSize);
      } else if (x.value >= 0 - snapThreshold && y.value >= 0 - snapThreshold) {
        x.value = withSpring(width / 2 - objectSize);
        y.value = withSpring(height / 2 - objectSize);
      } else {
        x.value = withSpring(0);
        y.value = withSpring(0);
      }
    },
  });

  const uas = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }, { translateY: y.value }],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={eventHandler}>
      <Animated.Image
        source={require("./assets/avatar.jpg")}
        style={[styles.ball, uas]}
      />
    </PanGestureHandler>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <EventsExample />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ball: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#001972",
  },
});
