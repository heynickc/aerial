$("document").ready(function () {

	// Resize Map Center Div
	$(".wrapper").height($(".wrapper").outerHeight() - (($(".controls").outerHeight()) + $("header").outerHeight()) + "px");
	$(window).resize(function () {
		$(".wrapper").height("100%");
		$(".wrapper").height($(".wrapper").outerHeight() - (($(".controls").outerHeight()) + $(".header").outerHeight()) + "px");
	});

	// 2006 aerial photo tiles
	var metro06URL = 'http://gis.wicomicocounty.org/metro2006/{z}/{x}/{y}.png';
	var metro06 = new L.TileLayer(metro06URL, {
		maxZoom: 19,
		tms: true,
		opacity: 1
	});
	// 2008 aerial photo tiles
	var metro08URL = 'http://gis.wicomicocounty.org/metro2008/{z}/{x}/{y}.png';
	var metro08 = new L.TileLayer(metro08URL, {
		maxZoom: 19,
		tms: true,
		opacity: 0
	});
	// 2010 aerial photo tiles
	var metro10URL = 'http://gis.wicomicocounty.org/metro2010/{z}/{x}/{y}.png';
	var metro10 = new L.TileLayer(metro10URL, {
		maxZoom: 19,
		tms: true,
		opacity: 0
	});

	// Marker/Overlay tile groups used later
	var markerGroup = new L.LayerGroup();
	var aerialGroup = new L.LayerGroup();

	// Create map
	var salisbury = new L.LatLng(38.365, -75.591);
	var map = new L.Map('map', {
		unloadInvisibleTiles: true
	});
	// map.addLayer(mapboxSt);
	aerialGroup.addLayer(metro06).addLayer(metro08).addLayer(metro10);
	map.addLayer(aerialGroup);
	map.setView(salisbury, 14);

	// Refresh map
	function refreshMap() {
		map.setView(salisbury, 14);
		markerGroup.clearLayers();
	} //resets map zoom and center, clears all markers
	refreshMap();

	$("#slider").slider({
		min: 0,
		max: 20,
		step: 1,
		slide: function (event, ui) {
			$("#buffAmt").val(ui.value);
			if (ui.value < 10) {
				metro06.setOpacity((10 - ui.value) / 10);
				metro08.setOpacity(ui.value / 10);
			}

			if (ui.value > 10) {
				metro08.setOpacity((10 - Math.abs(10 - ui.value)) / 10);
				metro10.setOpacity(((ui.value / 10) - 1));
			}
			// aerialGroup.addLayer(metro06).addLayer(metro08).addLayer(metro10);
			// map.addLayer(aerialGroup);
			console.log(metro06.options.opacity, " ", metro08.options.opacity, " ", metro10.options.opacity.toFixed(2));
		}
	});
	$("#buffAmt").val($("#slider").slider("value"));

	//Geocoder
	$("form").submit(function (event) {
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
					var loc = new L.LatLng(y, x);
					var locMarker = new L.Marker(loc, {
						draggable: true
					});
					markerGroup.addLayer(locMarker);
					map.addLayer(markerGroup);
					map.setView(loc, 18);;
					// listeners for .distance range input and dragging the marker

					//REMOVED FOR THIS PROJECT

				} else {
					refreshMap();
					$('#street').val('Address Invalid');
				}; //test address and geocode it if a location is returned by the iMap service
			}).error(function () {
				refreshMap();
			}); //get geocoding JSON
		} else {
			refreshMap();
		}; //if something is in #street field, do geocoding else reset the map
	}); //geocode address on submit

});