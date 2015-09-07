'use strict';
 
var React = require('react-native');
var TabView = require('./tabView.ios.js');
var NewEventView = require('./newEvent.ios')
var ProgressHUD = require('react-native-progress-hud');

//Destructure React Object
var {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  Component,
  TextInput,
  AlertIOS,
  Image,
  
} = React;
 
 
 //Create Main Class (First View of App)
var Main =  React.createClass({
  /*constructor(props){
    super(props);
    this.state = {
      eventCode: '',
      loggedIn: false,
      isLoading: false
    }
  },*/
  getInitialState: function() {
    return {
      eventCode: '',
      loggedIn: false,
      isLoading: false
    };
  },

  mixins: [ProgressHUD.Mixin],

  render() {
    return (
     <View style={styles.container}>

       
         <Image resizeMode='contain' style={styles.header} source={require('image!tHeaderDark')}/>

         <TextInput style={styles.textInput} onChangeText={(text)=> this.setState({eventCode:text})} placeholder="#"/>

             <Text style={styles.subHeader}>
                 Enter an Event Code to Join Your Event
             </Text>


             <TouchableHighlight style={styles.button} underlayColor='#f1c40f' onPress={ this.showEventDetails}>
                 <Text style={styles.buttonText}>Search</Text>
             </TouchableHighlight>

             <ProgressHUD
                      isVisible={this.state.is_hud_visible}
                      isDismissible={true}
                      overlayColor="rgba(0, 0, 0, 0.11)"
                    />
     </View>
      
    );
  },

  showEventDetails(){
    //fetch event data
    var self = this;

    var validEvent = false;
    var postObject = {
      method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': '',
          'Host': 'localhost:8081/'
        },
        body: JSON.stringify({
          'eventCode':self.state.eventCode
        })
    };
    
    //Begin Request
    
    self.showProgressHUD();
    fetch('http://localhost:8000/event/join',postObject)  
      .then(function(res) {
       
        console.log('res: ' + res)
        return res.json();
       })
      .then(function(resJson) {
        if (resJson && resJson.event){
          validEvent = true;
        }
        self.dismissProgressHUD();
        // if event exists - pass event code on to next page
        if (self.state.eventCode && validEvent){
          
          self.props.navigator.push({
                    title: self.state.eventCode, //refactor to contain event title
                    component: TabView,
                    passProps: {eventCode: self.state.eventCode,
                    mainNavigator: self.props.navigator} //refactor to contain eventcode
                    
           }); 
         
        }
         else {
          //An Event Code DNE so prompt the user to create an event or try again

          self.dismissProgressHUD();

          AlertIOS.alert(
            'This Event Does Not Exist!',
            'Create One?',
            [
              {text: 'Try Again', onPress: () => console.log('No Pressed!')}
            ]
          );

        }
        return resJson;
      })
      .catch((error) => {

         self.dismissProgressHUD();
         AlertIOS.alert(
            'Whoa! Something went wrong with the network.',
            'One more time!',
            [
              {text: 'Try Again', onPress: () => console.log('No Pressed!')}
            ]
          );
        
      });
    //persist eventcode to use in subsequent api calls
  
  },
});

var styles = StyleSheet.create({
  description: {
    fontSize: 30,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  textInput: {

    height: 40,
    borderColor: 'gray',
    backgroundColor: 'white',
    padding:10,
    textAlign: 'left',
    margin:20
  },
  subHeader: {
    fontSize:14,
    color: '#FFFFFF',

  },
  button: {
        height: 36,
        width:160,
        backgroundColor: 'grey',
        borderRadius: 8,
        justifyContent: 'center',
        marginTop: 15
    },
   buttonText: {
        fontSize: 12,
        color: 'white',
        alignSelf: 'center'
    },
    header: {
      width:350,
      height:60,
    }
  
});

module.exports = Main;