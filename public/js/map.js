var map;
function initializeMap() {
	var mapOptions = {
		zoom: 12,
		center: { lat: 55.929240, lng: 37.523120 }
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	var mark= new google.maps.Marker({
		position: mapOptions.center,
		map: map
	});
	mark.getVisible(0);
	google.maps.event.addListener(map, 'click', function(event) {
    	var geoPoint = event.latLng;
    	placeMarker(event.latLng, mark);
    })
};

function placeMarker(location, marker) {
	marker.setPosition(location);

	//map.setCenter(location);
}