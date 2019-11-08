import React, { Component } from 'react';
import MapRoutes from './MapRoutes';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';

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

	render () {
		const DragHandle = SortableHandle( ( { title } ) => <span className={ cssClasses.title }>{ title }</span> );
		const SortableItem = SortableElement( ( { item } ) => (
			<div className={ cssClasses.item }>
				<DragHandle title={ item.title } />
				<span className={ cssClasses.remove } onClick={ ( e ) => this.removeMarker( item.id, e ) } />
			</div>
		) );
		const SortableList = SortableContainer( ( { points } ) => (
			<div className={ cssClasses.PointList }>
				{ points.map( ( item ) => <SortableItem key={ item.id } index={ item.index } item={ item } /> ) }
			</div>
		) );

		return (
			<div className={ cssClasses.CreateRoutes } ref={ this.OutRefRoutes }>
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
						<input type="hidden" />
					</form>
				</div>
				<div className={ cssClasses.leftSide }>
					<MapRoutes markers={ this.state.points } />
				</div>
			</div>
		);
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
		await window.addEventListener( 'click', this.handleWinClick.bind() )
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
}

export default Routes;
