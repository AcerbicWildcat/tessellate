"use strict";

module.exports = {

  getUserDetails: function (req, res) {
    res.json({
      _id: "2as2agskadlawoin",
      firstName: "Bob",
      lastName: "Jenkins" 
    });
  },
  logout: function (req, res) {
    res.json({
      loggedIn: false
    });
  }

}