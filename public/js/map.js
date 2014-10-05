var map;
function initializeMap() {
	var mapOptions = {
		zoom: 12,
		center: { lat: 55.929240, lng: 37.523120 }
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	

}