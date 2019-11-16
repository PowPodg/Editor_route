import { ADD_PLACE } from './actionsTypes'

export function AddPlace ( event, valBool ) {
    return {
        type: ADD_PLACE,
        event: event,
        valBool: valBool
    }
}