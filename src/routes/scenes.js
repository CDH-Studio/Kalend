import React from "react";
import { Actions, Scene } from "react-native-router-flux";
import Home from "../components/Home";

const scenes = Actions.create(
	<Scene key="root" hideNavBar>
		<Scene key="home" component={Home} title="home" initial />	
	</Scene>
);

export default scenes;