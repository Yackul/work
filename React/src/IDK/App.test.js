import React, { createElement } from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme';
import Project from './Projects';
import LandingPage from './LandingPage';

describe('App root', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Project />, div);
    ReactTestUtils.renderIntoDocument(<Project />);
  });

  it('has LandingPage ', () => {
    const wrapper = shallow(<Project />);
    expect(wrapper.contains(createElement(LandingPage))).toBe(true);
    // jest-enzyme shortcut matcher fails in CI (TODO: Investigate)
    // expect(wrapper).toContainReact(createElement(LandingPage));
  });

  it('has only one LandingPage', () => {
    const wrapper = shallow(<Project />);
    expect(wrapper.find(LandingPage)).toHaveLength(1);
  });
});
