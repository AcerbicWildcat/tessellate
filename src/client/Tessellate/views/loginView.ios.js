'use strict';
 
var React = require('react-native');
var Main = require('./mainView.ios.js');
var FBLogin = require('react-native-facebook-login');
var FBLoginManager = require('NativeModules').FBLoginManager;

var {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  Component,
  TextInput,
  Image,
  AlertIOS,
  
} = React;

var styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#1B2B32',
	},
  fbLogo: {
    width:300,
    height:45,
    backgroundColor:'#125989',
    marginTop:20,
    borderRadius:10,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  fbLogoText: {
    textAlign:'center',
    color:'#FFFFFF',
    fontSize:20,
  },
  logo: {
    width:400,
    height:400,
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
    
    if (loginState){
      this.props.navigator.push({
        title: "Tessellate",
        component:Main,
        passProps:{currentUser:'Jonathan Schapiro',
        profilePicture:'.img'}
      })
      this.props.refs.setState({navBarHidden:true}) 
    }
  }

  login() {
  //GET Request user/facebook
  console.log('attempting to <login></login>')
  var getObject = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': '',
      'Host': 'localhost:8081/'
    }
  };
  var self = this;
  self.isAuthorized(true);
  /*fetch('http://localhost:8000/user/facebook', getObject)
    .then(function(res) {
      console.log('facebook');
      console.dir(res);
      //example
      /*
      if (!res.token){
        throw new Error('Facebook Login Failed');
      }
      return res.json();
      return {}
    })
    .then(function(resJson) {
      //SETTING THE STATE IS ASYNC!!!!! - write a damn blog post!
      self.setState({
        loggedIn: true
      }, function() {
        self.isAuthorized(this.state.loggedIn);
      })
      return resJson;
    })
    .catch((error) => {
      AlertIOS.alert(
        'Whoa! Something went wrong...',
        error.message, [{
          text: 'Try Again',
          onPress: () =>  null
        }]
      );

    });*/


}

  render() {
    var _this = this;
    return (

      <View style={styles.container}>
        <Image resizeMode='contain' source={require('image!mainLogo')} style={styles.logo}/>
        
         <FBLogin style={{ marginBottom: 10, }}
        permissions={["email","user_friends"]}
        onLogin={function(data){
          console.log("Logged in!");
          console.log(data);
          _this.setState({ user : data.credentials });
        }}
        onLogout={function(){
          console.log("Logged out.");
          _this.setState({ user : null });
        }}
        onLoginFound={function(data){
          console.log("Existing login found.");
          console.log(data);
          _this.setState({ user : data.credentials });
        }}
        onLoginNotFound={function(){
          console.log("No user logged in.");
          _this.setState({ user : null });
        }}
        onError={function(data){
          console.log("ERROR");
          console.log(data);
        }}
        onCancel={function(){
          console.log("User cancelled.");
        }}
        onPermissionsMissing={function(data){
          console.log("Check permissions!");
          console.log(data);
        }}
      />

        




      </View>
      
    );
  }

  
}


/*
  OLD LOGIN BUTTON
  <TouchableHighlight style={styles.fbLogo} onPress={this.login.bind(this)}>
          <Text style={styles.fbLogoText}>Login with Facebook</Text>
        </TouchableHighlight>


 */

module.exports = LoginView;