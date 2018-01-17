import React from 'react'
import ReactDOM from 'react-dom'
import { shallow, mount, render } from 'enzyme'
import Portfolio from '../portfolio/portfolio'

it('calls componentDidMount', () => {
  // const spy = jest.spyOn(App.prototype, 'componentDidMount');
  // const wrapper = mount(<Portfolio />);
  // expect(spy).toHaveBeenCalled();
});

it('renders without crashing', () => {
  // global.fetch = jest.fn().mockImplementation(() => {
  //   return Promise.resolve({
  //     json: () => { users: [] }
  //   });
  // });

  // const div = document.createElement('div');
  // ReactDOM.render(<Portfolio />, div);
});

it('renders without crashing', () => {
  // const component = shallow(<Portfolio />);
  // expect(component.find('div.App')).toHaveLength(1);
});
