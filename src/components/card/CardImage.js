import _pt from "prop-types";
import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native'; // import {BaseComponent} from '../../commons';

import Image from '../image';
import * as CardPresenter from './CardPresenter';
import asCardChild from './asCardChild'; // @ts-ignore

import { LogService } from '../../services'; // TODO: Remove omitting source after imageSource deprecation

/**
 * @description: Card.Image, part of the Card component belongs inside a Card (better be a direct child)
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/CardsScreen.js
 */
class CardImage extends PureComponent {
  static propTypes = {
    width: _pt.oneOfType([_pt.number, _pt.string]),
    height: _pt.oneOfType([_pt.number, _pt.string]),
    position: _pt.arrayOf(_pt.string),
    borderRadius: _pt.number
  };
  static displayName = 'Card.Image';

  constructor(props) {
    super(props);

    if (props.borderRadius) {
      LogService.warn('uilib: Please stop passing borderRadius to Card.Image, it will get the borderRadius from the Card');
    }

    this.styles = createStyles(props);
  }

  render() {
    const {
      imageSource,
      source,
      style,
      testID,
      overlayType,
      context: {
        borderStyle
      }
    } = this.props;
    const finalSource = source || imageSource;

    if (finalSource) {
      return /*#__PURE__*/React.createElement(View, {
        style: [this.styles.container, borderStyle, style]
      }, /*#__PURE__*/React.createElement(Image, {
        testID: testID,
        source: finalSource,
        style: [this.styles.image],
        overlayType: overlayType
      }));
    }

    return null;
  }

}

function createStyles({
  width,
  height,
  context: {
    position
  }
}) {
  const {
    top,
    left,
    right,
    bottom
  } = CardPresenter.extractPositionValues(position);
  return StyleSheet.create({
    container: {
      height: left || right ? undefined : height,
      width: top || bottom ? undefined : width,
      overflow: 'hidden'
    },
    image: {
      width: undefined,
      height: undefined,
      flex: 1,
      resizeMode: 'cover'
    }
  });
}

export default asCardChild(CardImage);