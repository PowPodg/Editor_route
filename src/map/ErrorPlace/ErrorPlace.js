import React, { Component } from 'react'
import cssClasses from './ErrorPlace.css'

class ErrorPlace extends Component {

    constructor ( props ) {
        super( props );
        this.state = {
            render: false
        }
    }

    componentDidMount () {
        setTimeout( function () {
            this.setState( {
                render: true
            } )
        }.bind( this ), 1000 )
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
