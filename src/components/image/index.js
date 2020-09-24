import _pt from "prop-types";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import _ from 'lodash';
import React, { PureComponent } from 'react'; //@ts-ignore

import hoistNonReactStatic from 'hoist-non-react-statics';
import { Image as RNImage, StyleSheet, ImageBackground } from 'react-native';
import Constants from '../../helpers/Constants';
import { asBaseComponent } from '../../commons/new'; // @ts-ignore

import Assets from '../../assets';
import Overlay from '../overlay';

/**
 * @description: Image wrapper with extra functionality like source transform and assets support
 * @extends: Image
 * @extendslink: https://facebook.github.io/react-native/docs/image.html
 */
class Image extends PureComponent {
  static propTypes = {
    sourceTransformer: _pt.func,
    assetName: _pt.string,
    assetGroup: _pt.string,
    tintColor: _pt.string,
    supportRTL: _pt.bool,
    cover: _pt.bool,
    aspectRatio: _pt.number,
    overlayColor: _pt.string,
    customOverlayContent: _pt.element
  };
  static displayName = 'Image';
  static defaultProps = {
    assetGroup: 'icons'
  };
  static overlayTypes = Overlay.overlayTypes;

  constructor(props) {
    super(props);
    this.sourceTransformer = this.props.sourceTransformer;
  }

  isGif() {
    if (Constants.isAndroid) {
      const {
        source
      } = this.props;

      const url = _.get(source, 'uri');

      const isGif = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/.test(url);
      return isGif;
    }
  }

  shouldUseImageBackground() {
    const {
      overlayType,
      customOverlayContent
    } = this.props;
    return !!overlayType || this.isGif() || !_.isUndefined(customOverlayContent);
  }

  getImageSource() {
    const {
      assetName,
      assetGroup
    } = this.props;

    if (!_.isUndefined(assetName)) {
      return _.get(Assets, `${assetGroup}.${assetName}`);
    }

    if (this.sourceTransformer) {
      return this.sourceTransformer(this.props);
    }

    const {
      source
    } = this.props;

    if (_.get(source, 'uri') === null || _.get(source, 'uri') === '') {
      // @ts-ignore
      return { ...source,
        uri: undefined
      };
    }

    return source;
  }

  render() {
    const source = this.getImageSource();
    const {
      tintColor,
      style,
      supportRTL,
      cover,
      aspectRatio,
      overlayType,
      overlayColor,
      customOverlayContent,
      ...others
    } = this.props;
    const shouldFlipRTL = supportRTL && Constants.isRTL;
    const ImageView = this.shouldUseImageBackground() ? ImageBackground : RNImage;
    return (
      /*#__PURE__*/
      // @ts-ignore
      React.createElement(ImageView, _extends({
        style: [{
          tintColor
        }, shouldFlipRTL && styles.rtlFlipped, cover && styles.coverImage, this.isGif() && styles.gifImage, aspectRatio && {
          aspectRatio
        }, style],
        accessible: false,
        accessibilityRole: 'image'
      }, others, {
        source: source
      }), (overlayType || customOverlayContent) && /*#__PURE__*/React.createElement(Overlay, {
        type: overlayType,
        color: overlayColor,
        customContent: customOverlayContent
      }))
    );
  }

}

const styles = StyleSheet.create({
  rtlFlipped: {
    transform: [{
      scaleX: -1
    }]
  },
  coverImage: {
    width: '100%',
    aspectRatio: 16 / 8
  },
  gifImage: {
    overflow: 'hidden'
  }
});
hoistNonReactStatic(Image, RNImage);
export { Image };
export default asBaseComponent(Image);