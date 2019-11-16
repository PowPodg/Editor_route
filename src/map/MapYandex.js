import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cssClasses from './MapYandex.css';
import WaitingInit from '../WaitingInit/WaitingInit'
import ErrorPlace from './ErrorPlace/ErrorPlace'
import constants from '../Сonstants/Сonstants'

class MapYandex extends Component {

	stateCur = 0
	markers = []
	mapCur = {}
	pathCur

	static propTypes = {
		markers: PropTypes.arrayOf( PropTypes.shape( {
			id: PropTypes.number.isRequired,
			title: PropTypes.string.isRequired,
			position: PropTypes.array.isRequired
		} ) ).isRequired
	};

	constructor ( props ) {
		super( props );
		this.OutRefMapRoutes = React.createRef();// for change findDOMNode
		this.state = {
			markers: [],
			loading: true,
			placeLocal: this.props.placeLocal,
			isExistPlace: 0,
		};

		this.initMapYand(props.destroyMap);
	}

	render () {
		const indexedMarkers = {}
		const indexedPoints = {}
		const points = [].slice.call( this.props.markers );

		this.markers.forEach( ( item, i ) => indexedMarkers[item.id] = this.markers[i] );
		points.forEach( ( item, i ) => indexedPoints[item.id] = points[i] );

		this.markers = this.markers.filter( item => {
			if ( !!indexedPoints[item.id] )
				return true;

			this.mapCur.geoObjects.remove( item.marker );

			return false;
		} ).map( item => {
			item.index = indexedPoints[item.id].index;

			return item;
		} );


		points.filter( item => !indexedMarkers[item.id] ).forEach( item => {
			item.marker = new window.ymaps.Placemark(
				item.position,
				{
					balloonContent: item.title
				},
				{
					iconLayout: 'default#imageWithContent',
					iconImageHref: constants.ICON_IMAGE_HREF,
					iconImageSize: [20, 30],
					iconImageOffset: [-10, -30],
					preset: "islands#redStretchyIcon",
					draggable: true
				}
			);

			item.marker.events.add( 'dragend', ( e ) => {
				item.position = e.get( 'target' ).geometry.getCoordinates()
				this.renderPath();
			} );

			this.mapCur.geoObjects.add( item.marker );
			this.markers.push( item );
		} );

		this.renderPath();

		return (
			<>
				{ this.state.loading
					? <WaitingInit />
					:
					<>
						{
							!this.state.isExistPlace
								? <ErrorPlace />
								: null
						}
						<div
							className={ cssClasses.MapYandex }
							ref={ this.OutRefMapRoutes }
						>
						</div>
					</>
				}
			</>
		)
	}

	renderPath () {
		if ( this.stateCur !== 2 )
			return;

		const Polyline = new window.ymaps.Polyline(
			this.markers
				.sort( ( a, b ) => a.index - b.index )
				.map( item => item.position ),
			{},
			{
				strokeColor: "#000000",
				strokeWidth: 4,
				strokeOpacity: 0.5
			}
		);

		if ( this.pathCur ) this.mapCur.geoObjects.remove( this.pathCur );
		this.mapCur.geoObjects.add( this.pathCur = Polyline );
	}

	async componentDidMount () {
		clearTimeout();
		this.setState( {
			placeLocal: this.props.placeLocal
		} )
		//await this.initMapYand();
		await window.addEventListener( 'resize', this.handleWinResize );
	}

	componentWillUnmount () {
		window.removeEventListener( 'resize', this.handleWinResize );
	}

	getCenter () {
		return this.stateCur === 2 ? this.mapCur.getCenter() : [0, 0];
	}

	async initMapYand () {

		if ( this.stateCur ) return void ( 0 )
		

		this.stateCur = 1;
		try {
			await window.ymaps.ready( () => {
				window.mapCur = this.mapCur = new window.ymaps.Map( this.OutRefMapRoutes.current, {
					center: this.getCenter(),
					zoom: 10,
					controls: []
				} );

				this.stateCur = 2;

				window.ymaps.geocode( this.state.placeLocal )
					.then( ( res ) => {
						this.mapCur.setCenter(
							res.geoObjects.get( 0 ).geometry.getCoordinates()
						)
						this.setState( {
							isExistPlace: res.metaData.geocoder.found
						} )
					} )
			} )
				.then( ( res ) => {
					this.setState( {
						loading: false
					} )
				} )
		} catch ( error ) {
			return void ( 0 )
		}
	}

	async handleWinResize () {
		if ( this.stateCur === 2 )
			await this.mapCur.container.fitToViewport();
	}
}

export default MapYandex