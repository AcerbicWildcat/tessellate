/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var Main = require('./views/mainView.ios.js')

//Desctructre the React Object
var {
  AppRegistry,
  StyleSheet,
  Component,
  NavigatorIOS,
} = React;

//This is the application's main component and the starting point of our app
var Tessellate = React.createClass({
   getInitialState() {
    return {
      loggedIn: true
    }
  },
  renderLoggedIn: function(){
    return (
     <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Tessellate', //replace with our icon
          component: Main
        }}/>
    );
  },

  render: function() {
    //initialize an instance of NavigatorIOS component and set Main as its initial route
    console.log('Login State: ' + this.state.loggedIn)
    if (this.state.loggedIn){
      return this.renderLoggedIn();
    } else {
      //return log in page
    }
    
  }
});

//styles object
var styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

AppRegistry.registerComponent('Tessellate', () => Tessellate);
