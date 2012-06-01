$("document").ready(function() {

	// Resize Map Center Div
	$(".wrapper").height($(".wrapper").outerHeight() - (($(".controls").outerHeight()) + $("header").outerHeight()) + "px");
	$(window).resize(function() {
		$(".wrapper").height("100%")
		$(".wrapper").height($(".wrapper").outerHeight() - (($(".controls").outerHeight()) + $(".header").outerHeight()) + "px");
	});

	// Cloudmade tiles
	var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/903a54a369114f6580f12400d931ece6/997/256/{z}/{x}/{y}.png';
	var cloudmadeAttrib = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
	var cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 19, attribution: cloudmadeAttrib});
	// Mapbox Light tiles
	var mapboxUrl = 'http://a.tiles.mapbox.com/v1/mapbox.mapbox-light/{z}/{x}/{y}.png';
	var mapboxAttrib = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
	var	mapbox = new L.TileLayer(mapboxUrl, {maxZoom: 19, attribution: mapboxAttrib, scheme: 'tms'});
	// Mapbox Streets tiles
	var mapboxStUrl = 'http://a.tiles.mapbox.com/v1/mapbox.mapbox-streets/{z}/{x}/{y}.png';
	var mapboxAttrib = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
	var	mapboxSt = new L.TileLayer(mapboxStUrl, {maxZoom: 19, attribution: mapboxAttrib, scheme: 'tms'});

	// 2006 aerial photo tiles
	var metro06URL = 'http://gis.wicomicocounty.org/metro2006/{z}/{x}/{y}.png';
	var metro06 = new L.TileLayer(metro06URL, {maxZoom: 19, scheme: 'tms', opacity: .5});
	// 2008 aerial photo tiles
	var metro08URL = 'http://gis.wicomicocounty.org/metro2008/{z}/{x}/{y}.png';
	var metro08 = new L.TileLayer(metro08URL, {maxZoom: 19, attribution: mapboxAttrib, scheme: 'tms', opacity: .5});
	// 2010 aerial photo tiles
	var metro10URL = 'http://gis.wicomicocounty.org/metro2010/{z}/{x}/{y}.png';
	var metro10 = new L.TileLayer(metro10URL, {maxZoom: 19, attribution: mapboxAttrib, scheme: 'tms'});

	// CartoDB building footprint tiles
	var	bldgTileURL = 'http://nickchamberlain.cartodb.com/tiles/buildings/{z}/{x}/{y}.png';
	var bldgTiles = new L.TileLayer(bldgTileURL);
	// CartoDB building footprint tiles
	var	quadTileURL = 'http://nickchamberlain.cartodb.com/tiles/cityquads/{z}/{x}/{y}.png';
	var quadTiles = new L.TileLayer(quadTileURL);

	// Marker/Overlay tile groups used later
	var markerGroup = new L.LayerGroup();
	var aerialGroup = new L.LayerGroup();

	// Create map
	var	salisbury = new L.LatLng(38.3660, -75.6035);
	var map = new L.Map('map');
	map.addLayer(mapboxSt);
	aerialGroup.addLayer(metro06);
	map.addLayer(aerialGroup);

	map.setView(salisbury, 14);
	
	// Refresh map
	function refreshMap () {
		map.setView(salisbury, 13)
		markerGroup.clearLayers();
	}//resets map zoom and center, clears all markers
	refreshMap();

	$("#slider").slider({
		min: 0, 
		max: 100, 
		// value: 50,
		start: function( event, ui) {
			// aerialGroup.clearLayers();
		},
		slide: function( event, ui ) {
				$( "#buffAmt" ).val(ui.value);
				metro06.setOpacity(ui.value / 100);
				// metro08.setOpacity((10 - ui.value) / 10);
				console.log(metro06.options.opacity, metro08.options.opacity);
				// aerialGroup.addLayer(metro06);
				// map.addLayer(aerialGroup);
			}
		});
		$( "#buffAmt" ).val($( "#slider" ).slider( "value" ));

//Geocoder
$("form").submit(function(event) {
	event.preventDefault();
	if ($("#street").val() != "") {
		//refreshMap();
		markerGroup.clearLayers();
		var street = $("#street").val();
		var zip = $("#zip").val();
		var geocode_url = 'http://mdimap.towson.edu/ArcGIS/rest/services/GeocodeServices/MD.State.MDStatewideLocator_LatLong/GeocodeServer/findAddressCandidates?Street=' + street + '&Zone=' + zip + '&outFields=&f=json&callback=?';
		var xhr = $.getJSON(geocode_url, function (data) {
			if (data.candidates[0]) {
				var x = data.candidates[0].location.x;
				var y = data.candidates[0].location.y;
				var loc = new L.LatLng(y,x);
				var locMarker = new L.Marker(loc, {draggable: true});
					markerGroup.addLayer(locMarker);
					map.addLayer(markerGroup);
					map.setView(loc,16);;
				// listeners for .distance range input and dragging the marker 

				//REMOVED FOR THIS PROJECT

			} else {
				refreshMap();
				$('#street').val('Address Invalid');
			};//test address and geocode it if a location is returned by the iMap service
		}).error(function() {refreshMap();}); //get geocoding JSON
	} else {
		refreshMap();
	};//if something is in #street field, do geocoding else reset the map
});//geocode address on submit

});