import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

// Inspired from https://github.com/dslounge/rn-animated-gradient-example
export default class GradientHelper extends React.PureComponent {
	render() {
		const {
			style,
			color1,
			color2,
			start = { x: 0, y: 0 },
			end = { x: 0, y: 1 }
		} = this.props;
		return (
			<LinearGradient
				colors={[color1, color2]}
				start={start}
				end={end}
				style={style} />
		);
	}
}