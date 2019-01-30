import React from "react";
import { Text, View } from "react-native";

class Greeting extends React.Component {
  render() {
    return (
      <View>
        <Text>Hi, {this.props.name}!</Text>
      </View>
    );
  }
}

class Event extends React.Component {
  render() {
    return (
      <View>
        <Greeting name="Marie" />
      </View>
    );
  }
}

export default Event;
