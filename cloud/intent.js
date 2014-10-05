var Intent = Parse.Object.extend("StudIntent");

exports.index = function(req, res) {
  var query = new Parse.Query(Intent);
  query.descending('createdAt');
  query.find().then(function(results) {
    res.render('intents', { 
      posts: results
    });
  },
  function() {
    res.send(500, 'Failed loading posts');
  });
};