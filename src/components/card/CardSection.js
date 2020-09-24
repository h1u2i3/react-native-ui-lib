import _pt from "prop-types";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import _ from 'lodash';
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { asBaseComponent } from '../../commons/new';
import View from '../view';
import Text from '../text';
import Image from '../image';
import asCardChild from './asCardChild';

/**
 * @description: Card.Section for rendering content easily inside a card
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/CardsScreen.js
 */
class CardSection extends PureComponent {
  static propTypes = {
    content: _pt.array,
    backgroundColor: _pt.string
  };
  static displayName = 'Card.Section';
  renderContent = () => {
    const {
      content,
      leadingIcon,
      trailingIcon,
      contentStyle,
      testID
    } = this.props;
    return /*#__PURE__*/React.createElement(React.Fragment, null, leadingIcon && /*#__PURE__*/React.createElement(Image, _extends({
      testID: `${testID}.leadingIcon`
    }, leadingIcon)), /*#__PURE__*/React.createElement(View, {
      testID: `${testID}.contentContainer`,
      style: contentStyle
    }, _.map(content, // @ts-ignore
    ({
      text,
      ...others
    } = {}, index) => {
      return !_.isUndefined(text) && /*#__PURE__*/React.createElement(Text, _extends({
        testID: `${testID}.text.${index}`,
        key: index
      }, others), text);
    })), trailingIcon && /*#__PURE__*/React.createElement(Image, _extends({
      testID: `${testID}.trailingIcon`
    }, trailingIcon)));
  };
  renderImage = () => {
    const {
      imageSource,
      imageStyle,
      imageProps,
      testID
    } = this.props; // not actually needed, instead of adding ts-ignore

    if (imageSource) {
      return /*#__PURE__*/React.createElement(Image, _extends({
        testID: `${testID}.image`,
        source: imageSource,
        style: imageStyle,
        customOverlayContent: this.renderContent()
      }, imageProps));
    }
  };

  render() {
    const {
      imageSource,
      context: {
        borderStyle
      },
      style,
      ...others
    } = this.props;
    return /*#__PURE__*/React.createElement(View, _extends({
      style: [styles.container, borderStyle, style]
    }, others), imageSource && this.renderImage(), !imageSource && this.renderContent());
  }

}

export default asBaseComponent(asCardChild(CardSection));
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  }
});