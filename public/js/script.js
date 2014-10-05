$(function () {
	initializeMap();
	
	var $form = $('.addStud');
	var $stud = $form.find('.stud-input');
	
	$stud.focus( function () {
		$form.find('.list-group-item.no-show').slideDown();
	});
	$form.find('.list-group-item input:not(.btn)').focus( activateInput );
	$form.find('.list-group-item input:not(.btn)').blur( hideInput );
	
	setSender($form, $form.find('.label'), function () {
		return {
			subject: 	$form.find('.stud-input').text(),
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
	
	var vk_ids = ['caffeinum'];
	
	fetchItems(function (elem) {
		var $new = $listItem.clone().removeClass('proto');

		$new.find('.info-place')	.text(elem.place);
		$new.find('.info-time')		.text( new Date(elem.createdAt).toUTCString() );
		$new.find('.info-name')		.attr('data-key', elem.User.objectId)
									.text(elem.User.username);
		$new.find('.info-subject')	.attr('data-key', elem.Subject.objectId)
									.text(elem.Subject.name);
		$new.find('.sub')			.click( sendSubscribe );
		
		$new.find('img').attr('id', 'img_vk:'+elem.User.vk_id);
		vk_ids.push( elem.User.vk_id );
		
		$new.appendTo( $listItem.parent() );
	});
	
	$list = $('.list .studIntent');
	
	fetchImgs(vk_ids, function (data) {
		console.log( data );
		//$list.find('#img_vk:'+vk_id).attr('src', img_url);
	});
	
	if( document.location.hash ) {
		var auth_token_str = document.location.hash.split('&')[0];
		var auth_token = auth_token_str.split('=')[1];
		
		var user_id = document.location.hash.split('&')[2].split('=')[1];
		
		if ( auth_token ) {
			$("#auth").hide();
			createUser( auth_token, user_id );
		}
	}
	
	var auth_url = "https://oauth.vk.com/authorize?client_id=4576520&redirect_uri=https://studeeme.parseapp.com/&scope=12&response_type=token";
	$("#auth").attr('href', auth_url);
});
function sendSubscribe(){
	var $p = $(this).parent();
	var user_id = $p.find('.info-name')		.attr('data-key');
	var subj_id = $p.find('.info-subject')	.attr('data-key');
	
	
	$.ajax({
		method: 'post',
		url: config.url + 'functions/subscribeToAStud',
		data: JSON.stringify({
			user_id: user_id,
			subj_id: subj_id
		}),
		contentType: 'application/json',
		headers: config.headers,
		success: function(data) {
			console.log( data );
		}
	});
	
}

function fetchItems( withEvery ) {
	
	$.ajax({
		method: 'post',
		url: config.url + 'functions/get' + config.stud,
		data: JSON.stringify({}),
		contentType: 'application/json',
		headers: config.headers,
		success: function(data) {
			console.log(data.result);
			data.result.forEach(withEvery);
		},
		error: function(error){
			console.log(error);
		}
	});
}

function fetchImgs( vk_ids, withEvery ) {

	$.ajax({
		method: 'get',
		url: 'https://api.vk.com/method/users.get',
		data: {
			user_ids: vk_ids,
			fields: 'photo_100'
		},
		success: function(data) {
			data.response.forEach(withEvery);
		}
	});
	
}

function setSender( form, button, collectData ) {
	form.submit( function (e) {
		e.preventDefault();
		button.click();
	});
	
	button.click( function () {
		var data;
		if ( ! (data = collectData()).subject ) return button.text('Fill the input');
		
		button.html('Loading... Stud<u>ee</u>Me');
		$.ajax({
			method: 'post',
			url: config.url + 'functions/createStud',
			headers: config.headers,
			contentType: 'application/json',
			data: JSON.stringify( data ),
			success: function (data) {
				console.log(data);
				button.text('Studed! Me');
			}
		});
	});
}

function createUser( auth_token, user_id ) {
	var vk = {vk_id: user_id};
	
	$.get('https://api.vk.com/method/users.get?callback=?fields=screen_name&user_ids='+user_id, function(data){
		vk.username = data.response[0].screen_name;
	}).then(
	
	$.ajax({
		method: 'post',
		url: config.url + 'classes/_User',
		headers: config.headers,
		contentType: 'application/json',
		data: JSON.stringify( {
			username: vk.vk_id,
			vk_id: vk.vk_id,
			auth_token: auth_token,
			password: auth_token
		} ),
		success: function (data) {
			console.log(data);
		}
	})

	);
}

var config = {
	url: 'https://api.parse.com/1/',
	headers: {
		'X-Parse-Application-Id': 'kJlYHrSf2nlFqetT4E01iZJAs8PfGT9N4VEaO3Zt',
		'X-Parse-REST-API-Key': 'w4wKC9OjZT2YQfO8jUAhC35CNYJqPjRewT943rW9'
	},
	stud: 'StudIntent',
	gapi_key: 'AIzaSyANS6RTpi6lkVuCRtofRFQNCVasdrvuTU8'
};