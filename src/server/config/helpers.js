module.exports = {

  /**
   * Helper function for attaching headers and status code to server response.
   * @param  {object} res        Response from server
   * @param  {object} data       Data to be sent along with response
   * @param  {number} statusCode Http status code (optional: defaults to 200)
   */
  sendResponse: function(res, data, statusCode) {
    var headers = {
      'access-control-allow-orgin': '*',
      'access-control-allow-methods' : 'GET, POST, PUT, DELETE, OPTIONS',
      'access-control-allow-headers': 'content-type, accept',
      'Content-Type': 'text/html'
    };
    statusCode = statusCode || 200;


    // res.writeHead(statusCode, headers);


    res.status(statusCode).json(data);
  },

  /**
   * Logs the error then sends it to the next middleware in middleware.js
   * @param  error 
   * @param  req   
   * @param  res   
   * @param  next  
   */
  errorLogger: function (error, req, res, next) {
    console.error(error.stack);
    next(error);
  },

  /**
   * Sends error message to client for error handling in app
   * @param  error
   * @param  req   
   * @param  res   
   * @param  next  
   */
  errorHandler: function (error, req, res, next) {
    res.status(500).send({error: error.message});
  }

};