'use strict';
 
var React = require('react-native');
var Main = require('./mainView.ios.js');
var FBLogin = require('react-native-facebook-login');
var FBLoginManager = require('NativeModules').FBLoginManager;
var ProgressHUD = require('react-native-progress-hud');


var {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  Component,
  TextInput,
  Image,
  AlertIOS,
  NativeModules,
  NetInfo,
  
} = React;


var LoginView = React.createClass({

  getInitialState: function() {
    
    return {
      loggedIn:false,
      userId: '',
      facebookId:'',
    };
  },

  mixins: [ProgressHUD.Mixin],


  /**
   * [isAuthorized allow user to proceed to mainView]
   * @param  {[String]}  loginState [status of login]
   * 
   */
  isAuthorized(loginState){
    var self = this;
    //go to mainView
    if (loginState){
      this.props.navigator.push({
        title: "Tessellate",
        component:Main,
        passProps:{facebookId:this.state.facebookId,
        profilePicture:'.img', //-feature opportunity
        navRef: this.props.refs
        }
      })
      this.props.refs.setState({navBarHidden:true}) 
    }
  },

  /**
   * [login POST request to /user]
   * @param  {[String]} facebookId [login user or create new one based on fbID]
   * 
   */
  login(facebookId) {

    var self = this;
    self.showProgressHUD();
    //object to specify POST params and headers
    var loginObject = {  
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
      },
      body: JSON.stringify({
         facebookId:facebookId,
       })
    }


    fetch('http://tessellate-penguin.herokuapp.com/user', loginObject)  
      .then(function(res) {
        return res.json();
       })
      .then(function(resJson) {
        self.setState({facebookId:facebookId},function(){
          self.isAuthorized(self.state.user);
        })
        self.dismissProgressHUD();
        return resJson;
       })
      .catch((error) => {
        self.dismissProgressHUD();
        AlertIOS.alert(
           'Whoa! Something Went Wrong.',
           error.message,
           [
             {text: 'Try Again', onPress: () => {}}
           ]
         );

      });
  },

  render() {
    var _this = this;
    return (
      <View style={styles.container}>
          <Image resizeMode='contain' source={require('image!mainLogo')} style={styles.logo}/>
             <FBLogin style={{ marginBottom: 10, }}
            permissions={["email","user_friends","public_profile"]}
            onLogin={function(data){
               _this.setState({ user : data.credentials },function(){
                _this.login(data.credentials.userId);
              });
            }}
            onLogout={function(){
              _this.setState({ user : null });
            }}
            onLoginFound={function(data){
               _this.setState({ user : data.credentials },function(){
                _this.login(data.credentials.userId);
              });
            }}
            onLoginNotFound={function(){
              _this.setState({ user : null });
            }}
            onError={function(data){
            }}
            onCancel={function(){
            }}
            onPermissionsMissing={function(data){
            }}
          />
          <ProgressHUD isVisible={this.state.is_hud_visible} isDismissible={true} overlayColor="rgba(0, 0, 0, 0.11)" />
      </View>
    );
  },
});

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


module.exports = LoginView;