
/**
 * Factory that intercepts server response to see if user was authenticated when making request.
 * @param  {dependency} $q
 * @param  {dependency} $location
 */
tess.factory('ResInterceptor', ['$q', '$location', function ($q, $location){
  // console.log('ResInterceptor has been injected');
  return {
    /**
     * If response is good, user is authenticated so the response is returned.
     * @param  {response} response
     * @return response from server
     */
    response: function (response){
      // do something with response on success?
      return response;
    },
    /**
     * If response status is 401, user is not authenticated and is redirected to login page.
     * @param  {response} response
     * @return rejects response
     */
    responseError: function (response){
      if (response.status === 401){
        $location.url('/');
      }
      return $q.reject(response);
    }
  };
}]);
/**
 * Factory that uses promise to check if user is authenticated or not.
 * @param  {dependency} $q
 * @param  {dependency} $http
 * @param  {dependency} $location
 * @param  {dependency} $rootScope
 */
tess.factory('AuthCheck', ['$q', '$http', '$location', '$rootScope', function ($q, $http, $location, $rootScope){
  // console.log('AuthCheck has been injected');
  return {
    /**
     * Returns a promise that resolves if user is authenticated, rejects and redirects to login if not.
     * @return {promise}
     */
    checkLoggedIn: function (){
      // initalize a new promise
      var deferred = q.defer();

      // make get request to check if user is logged in
      $http.get('/loggedin').success(function (user){
        // is authenticated
        if (user !== 0){
          deferred.resolve();
        }
        // is not authenticated
        else {
          $rootScope.message = 'Unauthorized: You need to log in.';
          deferred.reject();
          $location.url('/');
        }
      });
      return deferred.promise;
    }
  };
}]);

