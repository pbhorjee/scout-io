/*Location Search Factory
routes to Flickr API through server
all GET requests will include @params has_geo=1 and extras=[geo, tags, date_taken, path_alias, url_m, url_s]
*/
angular.module('SearchFactory', [])
  .factory('Search', function($http){


/*This is for a search done from the splash page or results page with tag input only
Gets photos that match all tags supplied
@param {string} tags  [user supplied comma deliniated tags] +tag_mode = all
@return {array}       [array of photo objects]
*/
    var getByTagOnly = function(tags){ // alter string var tagArray = tags.split(" ")? how should it get passed to server?
      return $http({
        method: 'GET', 
        url: '/api/search/' + tags,
      })
      .then(function(data){
        return data;
      })
    };


/*This is for a search done from the photo-page by lat/lon only 
Gets photos regardless of tag that were taken within a given or default 2mile radius)
@param {array}  geo   [lat, lon, radius] + radius_units=mi
@return {array}       [array of matching photo objects]
*/
  var getNearby = function(geo){
    radius = radius || 2;
    return $http({
      method: 'GET',
      url: '/api/search/' + geo,
    })
    .then(function(data){
      return data;
    })
  };

/*This is a search done from the results page advanced search
@param {array of arrays} 
  [
  [tags]  {string}                      [user supplied comma deliniated tags or null] + tag_mode=all
  [lat, lon, radius]   {number}         [user supplied or generated by googlemapsAPI or null, radius default to 5] 
  [min_taken_date] {mySQL datetime}     [user supplied or null]
  [max_taken_date]  {mySQL datetime}    [user supplied or null]
  ]
@return {array} [array of matching photo objects]
*/
  var getAdvanced = function(searchCriteria){
    console.log(searchCriteria);
    return $http({
      method: 'GET',
      url: '/api/search/' + searchCriteria
    })
    .then(function(data){
      return data;
    })
  };

  return {
    getByTagOnly: getByTagOnly,
    getNearby: getNearby,
    getAdvanced: getAdvanced
  };

});
