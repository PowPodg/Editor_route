import React, { Component } from 'react';
import { connect } from 'react-redux'
import { AddPlace } from '../redux/actions/actions'
import MapYandex from '../map/MapYandex';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import cssClasses from './Routes.css';

class Routes extends Component {

	constructor ( props ) {
		super( props );

		this.OutRefRoutes = React.createRef();
		this.OutmarkerName = React.createRef();

		this.state = {
			points: [],
			coords: null,
		};
	}

	onSortEnd = ( { oldIndex, newIndex } ) => {
		this.setState( {
			points: arrayMove( this.state.points, oldIndex, newIndex ).map( ( item, i ) => {
				item.index = i;
				return item;
			} ),
		} );
	};

	async componentDidMount () {
		await window.addEventListener( 'click', this.handleWinClick.bind() );
	}

	handleWinClick = () => {
		if ( window.mapCur ) {
			window.mapCur.events.add( 'click', ( e ) => {
				const coords = e.get( 'coords' );
				this.setState( {
					coords: coords,
				} );
				window.mapCur.cursors.push( 'crosshair' );
			} );
		}
	};

	createMarker = ( e ) => {
		e.preventDefault();

		const node = this.OutmarkerName.current;
		let point = {
			id: new Date().getTime() + Math.random(),
			title: node.value.trim(),
			index: this.state.points.length,
		};

		if ( !node.value.trim().length ) return;

		if ( this.state.coords === null ) {
			point.position = window.mapCur.getCenter();
		} else {
			point.position = this.state.coords;
		}

		this.setState( {
			points: this.state.points.concat( point ),
		} );
		node.value = '';
	};

	removeMarker ( id, e ) {
		e.stopPropagation();
		this.setState( {
			points: this.state.points.filter( ( item ) => item.id !== id ),
		} );
	}

	render () {

		const DragHandle = SortableHandle( ( { title } ) => <span className={ cssClasses.title }>{ title }</span> );

		const SortableItem = SortableElement( ( { item } ) => (
			<div className={ cssClasses.item }>
				<DragHandle title={ item.title } />
				<span className={ cssClasses.remove } onClick={ ( e ) => this.removeMarker( item.id, e ) } />
			</div>
		) );

		const SortableList = SortableContainer( ( { points } ) => (
			<div className={ cssClasses.SortableList }>
				{ points.map( ( item ) => <SortableItem key={ item.id } index={ item.index } item={ item } /> ) }
			</div>
		) );

		return (
			<div className={ cssClasses.Routes } ref={ this.OutRefRoutes }>
				<div className={ cssClasses.rightSide }>
					<form onSubmit={ this.createMarker } method="post">
						<div>
							<div className={ cssClasses.SubmitInput }>
								<input
									type="text"
									ref={ this.OutmarkerName }
									defaultValue=""
									placeholder="Add a new point"
								/>
							</div>
							<SortableList points={ this.state.points } onSortEnd={ this.onSortEnd } useDragHandle={ true } />
						</div>
					</form>
				</div>
				<div className={ cssClasses.leftSide }>
					<b className={ cssClasses.InputPlace }>
						Place on the map:
						<input
							type="text"
							className={ cssClasses.Place }
							defaultValue={ this.props.placeM }
							onKeyPress={ async ( event ) => this.props.onAddPlace( event, true ) }
							onChange={ async ( event ) => this.props.onAddPlace( event, false ) }
						/>
					</b>
					{
						this.props.placeM
							?
							<MapYandex
								markers={ this.state.points }
								placeLocal={ this.props.placeM }
							/>
							: null
					}
				</div>
			</div>
		);
	}

}

function mapStateToProps ( state ) {
	return {
		placeM: state.addPlace.placeM
	}
}

function mapDispatchToProps ( dispatch ) {
	return {
		onAddPlace: async ( event, valBool ) => dispatch( AddPlace( event, valBool ) )
	}
}

export default connect( mapStateToProps, mapDispatchToProps )( Routes )
