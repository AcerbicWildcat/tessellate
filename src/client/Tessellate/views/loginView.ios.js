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

  isAuthorized(loginState){
    console.log('LOGIN STATE:  ' + loginState)
    if (loginState){
      this.props.navigator.push({
        title: "Tessellate",
        component:Main,
        passProps:{currentUser:'Jonathan Schapiro',

        }
      })
      this.props.refs.setState({navBarHidden:true}) 
    }
  }

  login() {
      //GET Request
      var self = this;

      //SETTING THE STATE IS ASYNC!!!!! - write a damn blog post!
      this.setState({loggedIn:true},function(){
        self.isAuthorized(this.state.loggedIn);
      })
      
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