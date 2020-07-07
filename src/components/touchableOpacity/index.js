import React, { PureComponent } from 'react';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';
import _ from 'lodash';
import { asBaseComponent, forwardRef } from '../../commons/new';
// @ts-ignore
import Incubator from '../../incubator';
/**
 * @description: A wrapper for TouchableOpacity component. Support onPress, throttling and activeBackgroundColor
 * @extends: TouchableOpacity
 * @modifiers: margins, paddings, alignments, background, borderRadius
 * @extendslink: https://facebook.github.io/react-native/docs/touchableopacity.html
 * @gif: https://media.giphy.com/media/xULW8AMIgw7l31zjm8/giphy.gif
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/src/components/touchableOpacity/index.tsx
 */
class TouchableOpacity extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            active: false
        };
        const { throttleTime, throttleOptions } = this.props;
        this.onPress = _.throttle(this.onPress.bind(this), throttleTime, throttleOptions);
        this.onPressIn = this.onPressIn.bind(this);
        this.onPressOut = this.onPressOut.bind(this);
    }
    getAccessibilityInfo() {
        const { disabled } = this.props;
        return {
            accessibilityRole: 'button',
            accessibilityStates: disabled ? ['disabled'] : []
        };
    }
    onPressIn(...args) {
        this.setState({
            active: true
        });
        _.invoke(this.props, 'onPressIn', ...args);
    }
    onPressOut(...args) {
        this.setState({
            active: false
        });
        _.invoke(this.props, 'onPressOut', ...args);
    }
    get backgroundColorStyle() {
        const { backgroundColor: propsBackgroundColor, modifiers } = this.props;
        const backgroundColor = propsBackgroundColor || modifiers.backgroundColor;
        if (backgroundColor) {
            return { backgroundColor };
        }
    }
    get activeBackgroundStyle() {
        const { active } = this.state;
        const { activeBackgroundColor } = this.props;
        if (active && activeBackgroundColor) {
            return { backgroundColor: activeBackgroundColor };
        }
    }
    render() {
        const { useNative, style, modifiers, forwardedRef, ...others } = this.props;
        const { borderRadius, paddings, margins, alignments, flexStyle } = modifiers;
        if (useNative) {
            return <Incubator.TouchableOpacity {...this.props}/>;
        }
        return (
        // @ts-ignore
        <RNTouchableOpacity {...this.getAccessibilityInfo()} {...others} onPress={this.onPress} onPressIn={this.onPressIn} onPressOut={this.onPressOut} style={[
            this.backgroundColorStyle,
            borderRadius && { borderRadius },
            flexStyle,
            paddings,
            margins,
            alignments,
            style,
            this.activeBackgroundStyle
        ]} ref={forwardedRef}/>);
    }
    onPress() {
        _.invoke(this.props, 'onPress', this.props);
    }
}
TouchableOpacity.displayName = 'TouchableOpacity';
export default asBaseComponent(forwardRef(TouchableOpacity));
