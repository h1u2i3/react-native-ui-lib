function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useState, useCallback, useRef } from 'react'; // eslint-disable-next-line no-unused-vars

import forwardRef from './forwardRef';

function withScrollEnabler(WrappedComponent) {
  const ScrollEnabler = props => {
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const contentSize = useRef(0);
    const layoutSize = useRef(0);
    const checkScroll = useCallback(() => {
      const isScrollEnabled = contentSize.current > layoutSize.current;

      if (isScrollEnabled !== scrollEnabled) {
        setScrollEnabled(isScrollEnabled);
      }
    }, [scrollEnabled]);
    const onContentSizeChange = useCallback((contentWidth, contentHeight) => {
      const size = props.horizontal ? contentWidth : contentHeight;

      if (size !== contentSize.current) {
        contentSize.current = size;

        if (layoutSize.current > 0) {
          checkScroll();
        }
      }
    }, [props.horizontal, checkScroll]);
    const onLayout = useCallback(event => {
      const {
        nativeEvent: {
          layout: {
            width,
            height
          }
        }
      } = event;
      const size = props.horizontal ? width : height;

      if (size !== layoutSize.current) {
        layoutSize.current = size;

        if (contentSize.current > 0) {
          checkScroll();
        }
      }
    }, [props.horizontal, checkScroll]);
    return /*#__PURE__*/React.createElement(WrappedComponent, _extends({}, props, {
      scrollEnablerProps: {
        onLayout,
        scrollEnabled,
        onContentSizeChange
      },
      ref: props.forwardedRef
    }));
  };

  return forwardRef(ScrollEnabler);
}

export default withScrollEnabler;