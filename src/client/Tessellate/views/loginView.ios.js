'use strict';
 
var React = require('react-native');
var Main = require('./mainView.ios.js');

var {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  Component,
  TextInput,
  
} = React;

var styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'black',
	},
	description: {
    fontSize: 30,
    textAlign: 'left',
    color: '#FFFFFF'
  },
  loginButton: {
    width:150,
    height:50,
    backgroundColor:'grey'
  }

});



class LoginView extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn:false,
    }
  }

  login() {
      //GET Request
      
      this.setState({loggedIn:true})
      this.props.navigator.push({
        title: "Tessellate",
        component:Main,
        passProps:{}
      })
      this.props.refs.setState({navBarHidden:true})
  }

  render() {
    //consider - https://github.com/stephy/CalendarPicker
    return (

      <View style={styles.container}>
        <TouchableHighlight style={styles.loginButton} onPress={this.login.bind(this)}>
          <Text style={styles.description}>
            Login View
          </Text>
        </TouchableHighlight>
      </View>
      
    );
  }

  
}

module.exports = LoginView;