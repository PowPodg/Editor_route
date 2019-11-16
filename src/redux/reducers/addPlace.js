import constants from '../../Сonstants/Сonstants'
import { ADD_PLACE } from '../actions/actionsTypes'


const initiaState = {
    placeM: constants.PLACE_LOCAL_DEFAULT,
    symvM: '',
    keyM: ''
}

export default function addPlace ( state = initiaState, action ) {
    switch ( action.type ) {
        case ADD_PLACE:
            if ( action.valBool ) {
                if ( action.event.key === constants.KEY_ENTER ) {
                    return {
                        keyM: action.event.key,
                        placeM: state.symvM,
                        symvM: ''
                    }
                }
                else {
                    return {
                        placeM: ''
                    }
                }
            }
            else {
                return {
                    placeM: '',
                    symvM: action.event.target.value,
                }
            }

        default:
            return state;
    }
}

