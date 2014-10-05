Parse.Cloud.define("registeringEvent", function(request, response){
    var StudIntent = Parse.Object.extend('StudIntent');
/*  var Timespot = Parse.Object.extend("Timespot");
 
    var timespoty = new Timespot();
*/
    var studIntenty = new StudIntent();
 
    var start   = new Date( request.params.startTime );
    var end     = new Date( request.params.endTime );
     
    studIntenty.set("start_time", start);
    studIntenty.set("end_time", end);
 
    studIntenty.set("subject", request.params.subject);
    //studIntenty.set("place", request.params.place);
    studIntenty.set("userId", request.params.userId);
     
 
    studIntenty.save(null, {
                        success: function () {
                            response.success("You've registered new event successfully!");
                        },
                        error: function (saved, e){
                            response.error(e);
                        }
                    });
});
 
/*null, {
        success: function (timespoty) {
 
            studIntenty.save(null, {
                success: function(){
                    response.success("You've registered new event successfully!");
                },
                error: function(){
                    response.error("Error occured!");
                }   
            });
        },
        error: function () {
            alert("This is error!");
        }
    }*/
/*
Parse.Cloud.define("settingPersonalInfo", function(request, response){
 
    var PersonalInfo = Parse.Object.extend('PersonalInfo');
    var personalInfo = new PersonalInfo();
    personalInfo.set("vk_id", request.params.vk_id);
    personalInfo.set("name", request.params.name);
    personalInfo.set("last_name", request.params.last_name);
    personalInfo.set("university", request.params.university);
    personalInfo.set("phone_number", request.params.phone_number);
    personalInfo.set("address", request.params.address);
    personalInfo.save();
    response.success();
});
 
Parse.Cloud.define("authorization", function(request, response){
 
    var User = Parse.Object.extend('User');
    var user = new User();
    user.set("vk_id", request.params.vk_id);
    user.set("username", request.params.username);
    user.set("email", request.params.email);
    user.set("password", request.params.password);
    user.set("online", 1);
    user.save(null, {
        success: function (user){
            response.success(user);
        },
        error: function(){
            response.error();
        }
    }
    );
});
 
 
var url = "https://oauth.vk.com/authorize?client_id=4576520&redirect_uri=https://studeeme.parseapp.com/auth&scope=12&display=mobile&response_type=token";
 
 
Parse.Cloud.beforeSave("Timespot", function(request, response) {
  var timespot = request.object;
   
  if (timespot.get("start_time")>timespot.get("end_time")) {
    response.error("Неправильно указаны временные рамки");
  } else {
    response.success();
  }
});
*/
Parse.Cloud.define("getName", function (req, res){
    var query = new Parse.Query("User");
 
    query.equalTo("objectId", req.params.user_id);
    query.find({
        success: function (results) {
            if ( results.length ){
                var vk_id = results[0].get('vk_id');
                if ( vk_id )
                    Parse.Cloud.httpRequest({
                        url: 'http://api.vk.com/method/users.get?user_ids='+vk_id,
                        success: function(httpResponse) {
                            res.success( JSON.parse(httpResponse.text).response[0] );
                        },
                        error: function(httpResponse) {
                            res.error('Request failed with response code ' + httpResponse.status);
                        }
                    });
                else
                    res.success( results[0].get('username') );
            }
            else {
                res.error( 'Not found' );
            }
        },
        error: function (error) {
            res.error(error);
        }
    });
});

Parse.Cloud.define("getStudIntent", function (req, res) {
	var query = new Parse.Query("StudIntent");
 
	query.descending("createdAt"); // replace with start_time
    query.limit(10);
	
	query.include("User");
    query.find({
        success: function (results) {
			res.success( results );
        },
        error: function (error) {
            res.error(error);
        }
    });
});

Parse.Cloud.define("getSubjectName", function (req, res){
	var query = new Parse.Query("Subject");
 
    query.equalTo("objectId", req.params.subj_id);
    query.find({
        success: function (results) {
            if ( results.length )
                res.success( results[0].get('name') );
            else
                res.error( 'Not found' );
        },
        error: function (error) {
            res.error(error);
        }
    });
});
 
Parse.Cloud.define("subscribeToAStud", function(request, response){
    var User = Parse.Object.extend("User");
    var StudIntent = Parse.Object.extend("StudIntent");
     
    var user = new User();
    var stud = new StudIntent();
 
    user.id = request.params.user_id;
    stud.id = request.params.stud_id;
 
    var EventSubscription = Parse.Object.extend("EventSubscription");
    var subscription = new EventSubscription();
     
    subscription.set("appeared", false);
 
    var relationuser = subscription.relation("User");
    var relationstud = subscription.relation("StudIntent");
     
    relationuser.add(user);
    relationstud.add(stud);
     
    subscription.save(null, {
        success: function(subscription){
            response.success(subscription);
        },
        error: function(){
            response.error();
        }
    });
});
 
Parse.Cloud.define("getUser", function(request, response){
    var uquery = new Parse.Query("User");

	uquery.equalTo("objectId", request.params.user_id);
    uquery.first({
        success: function(object){
            response.success(object);
        }
    });
});
 
Parse.Cloud.define("queryStudIntentId", function(request, response){
    var StudIntent = Parse.Object.extend("StudIntent");
    var siquery = new Parse.Query(StudIntent);
    siquery.equalTo("objectId", request.params.studintent_id);
    siquery.first({
        success: function(object){
            response.success(object);
        }
    });
});