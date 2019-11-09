import React from 'react'
import { configure, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Routes from './Routes';

configure( {
  adapter: new Adapter()
} )

describe( '<Routes />', () => {
   it( 'Should render Routes after initialization', () => {
    const wrapper = mount (<Routes/>) 
    expect(wrapper.html()).toContain('<input type="text" placeholder="Add a new point" value="">');
  } )
} )