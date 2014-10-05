var map;
function initializeMap() {
  var mapOptions = {
    zoom: 12,
    center: { lat: 55.929240, lng: 37.523120 }
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
};$(function () {
	initializeMap();
	
	var $form = $('.addStud');
	var $stud = $form.find('.stud-input');
	
	$stud.focus( function () {
		$form.find('.list-group-item.no-show').slideDown();
	});
	$form.find('.list-group-item input:not(.btn)').focus( activateInput );
	$form.find('.list-group-item input:not(.btn)').blur( hideInput );
	
	setSender($form.find('.btn'), function () {
		return {
			subject: 	$form.find('.stud-input').text(),
			time: 		$form.find('.time-input').text(),
			place: 		$form.find('.place-input').text(),
		};
	});
	
	function activateInput () {
		if ( $(this).val() == $(this).attr('value') ) $(this).val('');
	}
	function hideInput() {
		if ( ! $(this).val() ) $(this).val( $(this).attr('value') );
	}
	
	var $listItem = $('.list .proto');
	
	var vk_ids = [];
	
	fetchItems(function (elem) {
		var $new = $listItem.clone().removeClass('proto');

		$new.find('.info-name')		.text(elem.userName);
		$new.find('.info-place')	.text(elem.place);
		$new.find('.info-time')		.text(elem.time);
		$new.find('.info-subject')	.text(elem.subject);
		
		$new.find('img').attr('id', 'img_vk:'+elem.vk_id);
		vk_ids.push( elem.vk_id );
		
		$new.appendTo( $listItem.parent() );
	});
	
	$list = $('.list .studIntent');
	
	fetchImgs(vk_ids, function (vk_id, img_url) {
		$list.find('#img_vk:'+vk_id).attr('src', img_url);
	});
});


function fetchItems( withEvery ) {
	
	$.ajax({
		method: 'get',
		url: config.url + config.stud,
		headers: config.headers,
		success: function(data) {
			data.results.forEach(withEvery);
		}
	});

}

function fetchImgs( vk_ids, withEvery ) {

	$.ajax({
		method: 'get',
		url: 'http://api.vk.com/method/users.get',
		data: {
			user_ids: vk_ids,
			fields: 'img_200',
		},
		success: function(data) {
			data.response.forEach(withEvery);
		}
	});
	
}

function setSender( button, collectData ) {
	button.click( function () {
		button.val('Loading...');
		$.ajax({
			method: 'post',
			url: config.url + config.stud,
			headers: config.headers,
			contentType: 'application/json',
			data: JSON.stringify( collectData() ),
			success: function (data) {
				console.log(data);
				button.val('Saved!');
			}
		});
	});
}

var config = {
	url: 'https://api.parse.com/1/functions',
	headers: {
		'X-Parse-Application-Id': 'kJlYHrSf2nlFqetT4E01iZJAs8PfGT9N4VEaO3Zt',
		'X-Parse-REST-API-Key': 'w4wKC9OjZT2YQfO8jUAhC35CNYJqPjRewT943rW9'
	},
	stud: 'getStudIntent',
	gapi_key: 'AIzaSyANS6RTpi6lkVuCRtofRFQNCVasdrvuTU8'
};