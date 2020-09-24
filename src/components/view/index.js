import _pt from "prop-types";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { PureComponent } from 'react';
import { View as RNView, SafeAreaView, Animated } from 'react-native';
import { asBaseComponent, forwardRef } from '../../commons/new';
import Constants from '../../helpers/Constants';

/**
 * @description: An enhanced View component
 * @extends: View
 * @extendslink: https://facebook.github.io/react-native/docs/view.html
 * @modifiers: margins, paddings, alignments, background, borderRadius
 */
class View extends PureComponent {
  static propTypes = {
    useSafeArea: _pt.bool,
    animated: _pt.bool,
    inaccessible: _pt.bool,
    width: _pt.oneOfType([_pt.string, _pt.number]),
    height: _pt.oneOfType([_pt.string, _pt.number]),
    renderDelay: _pt.number,
    backgroundColor: _pt.string
  };
  static displayName = 'View';

  constructor(props) {
    super(props);
    this.Container = props.useSafeArea && Constants.isIOS ? SafeAreaView : RNView;

    if (props.animated) {
      this.Container = Animated.createAnimatedComponent(this.Container);
    }

    this.state = {
      ready: !props.renderDelay
    };
  }

  componentDidMount() {
    const {
      renderDelay
    } = this.props;

    if (renderDelay) {
      setTimeout(() => {
        this.setState({
          ready: true
        });
      }, renderDelay);
    }
  } // TODO: do we need this?


  setNativeProps(nativeProps) {
    //@ts-ignore
    this._root.setNativeProps(nativeProps); // eslint-disable-line

  }

  render() {
    if (!this.state.ready) {
      return null;
    } // (!) extract left, top, bottom... props to avoid passing them on Android
    // eslint-disable-next-line


    const {
      modifiers,
      style,
      left,
      top,
      right,
      bottom,
      flex: propsFlex,
      forwardedRef,
      inaccessible,
      ...others
    } = this.props;
    const {
      backgroundColor,
      borderRadius,
      paddings,
      margins,
      alignments,
      flexStyle,
      positionStyle
    } = modifiers;
    const Element = this.Container;
    return /*#__PURE__*/React.createElement(Element, _extends({
      accessibilityElementsHidden: inaccessible,
      importantForAccessibility: inaccessible ? 'no-hide-descendants' : undefined
    }, others, {
      style: [backgroundColor && {
        backgroundColor
      }, borderRadius && {
        borderRadius
      }, flexStyle, positionStyle, paddings, margins, alignments, style],
      ref: forwardedRef
    }), this.props.children);
  }

}

export default asBaseComponent(forwardRef(View));