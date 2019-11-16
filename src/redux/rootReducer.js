import {combineReducers} from 'redux'  

import addPlace from './reducers/addPlace'

export default combineReducers ({
    addPlace: addPlace,
    //Here can connect other reducers
})