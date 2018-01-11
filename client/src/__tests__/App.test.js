import React from 'react'
import ReactDOM from 'react-dom'
import { shallow, mount, render } from 'enzyme'
import App from '../components/App'

it('calls componentDidMount', () => {
  // const spy = jest.spyOn(App.prototype, 'componentDidMount');
  // const wrapper = mount(<App />);
  // expect(spy).toHaveBeenCalled();
});

it('renders without crashing', () => {
  // global.fetch = jest.fn().mockImplementation(() => {
  //   return Promise.resolve({
  //     json: () => { users: [] }
  //   });
  // });

  // const div = document.createElement('div');
  // ReactDOM.render(<App />, div);
});

it('renders without crashing', () => {
  // const component = shallow(<App />);
  // expect(component.find('div.App')).toHaveLength(1);
});
