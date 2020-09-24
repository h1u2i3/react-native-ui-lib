import _pt from "prop-types";
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { asBaseComponent, forwardRef } from '../../commons/new';
import View from '../view';
import RadioGroupContext from './RadioGroupContext';

/**
 * Wrap a group of Radio Buttons to automatically control their selection
 */
class RadioGroup extends PureComponent {
  static propTypes = {
    initialValue: _pt.oneOfType([_pt.string, _pt.number, _pt.bool]),
    onValueChange: _pt.func
  };
  static displayName = 'RadioGroup';

  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.initialValue !== nextProps.initialValue) {
      this.setState({
        value: nextProps.initialValue
      });
    }
  }

  getContextProviderValue() {
    const {
      value
    } = this.state;
    return {
      value,
      onValueChange: this.onValueChange
    };
  }

  onValueChange = value => {
    this.setState({
      value
    });

    _.invoke(this.props, 'onValueChange', value);
  };

  render() {
    return /*#__PURE__*/React.createElement(View, this.props, /*#__PURE__*/React.createElement(RadioGroupContext.Provider, {
      value: this.getContextProviderValue()
    }, this.props.children));
  }

}

export default asBaseComponent(forwardRef(RadioGroup));