import React from 'react'
import ReactDOM from 'react-dom'
import { shallow, mount, render } from 'enzyme'
import axios from 'axios'
import Portfolio from './portfolio'

jest.mock('axios')

it('renders without crashing', () => {
  axios.get.mockImplementation(() => Promise.resolve({data: {}}))
  const div = document.createElement('div')
  ReactDOM.render(<Portfolio />, div)
})

it('calls componentDidMount', () => {
  axios.get.mockImplementation(() => Promise.resolve({data: {}}))
  const cdmSpy = jest.spyOn(Portfolio.prototype, 'componentDidMount')

  const wrapper = shallow(<Portfolio />)

  expect(cdmSpy).toHaveBeenCalled()
});
