import React, { Component } from 'react'
import cssClasses from './ErrorPlace.css'
import constants from '../../Сonstants/Сonstants'

class ErrorPlace extends Component {

    constructor ( props ) {
        super( props );
        this.state = {
            render: false
        }
    }

    componentDidMount () {
        setTimeout( () =>{
            this.setState( {
                render: true
            } )
        }, constants.DELAY_PLACE_VISUAL_ERROR)
    }
    render () {
        let renderOut = null
        if ( this.state.render ) {
            renderOut =
                <h1 className={ cssClasses.ErrorPlace }>Place on the map not found!</h1>
        }
        return renderOut
    }
}
export default ErrorPlace
