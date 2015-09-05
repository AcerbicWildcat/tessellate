/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var Main = require('./views/mainView.ios.js')
var Login = require('./views/loginView.ios')

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
      loggedIn: false,
      navBarHidden:true,
    }
  },
  renderLoggedIn: function(){
    return (
     <NavigatorIOS
        style={styles.container}
        ref="nav"
        navigationBarHidden={this.state.navBarHidden}
        initialRoute={{
          title: 'Tessellate', //replace with our icon
          component: Login,
          passProps:{refs:this}
        }}/>
    );
  },
 
  render: function() {
    //initialize an instance of NavigatorIOS component and set Main as its initial route
      return this.renderLoggedIn();
  }

});

//styles object
var styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
});

AppRegistry.registerComponent('Tessellate', () => Tessellate);
