'use strict';
 
var React = require('react-native');
var TabView = require('./tabView.ios.js');
var NewEventView = require('./newEvent.ios')
var ProgressHUD = require('react-native-progress-hud');
var EventsView = require('./listView.ios')

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
 
  getInitialState: function() {
    return {
      eventCode: '',
      loggedIn: false,
      isLoading: false,
      facebookId: this.props.facebookId,
    };
  },

  mixins: [ProgressHUD.Mixin],

  render() {
    console.log('Facebook ID in Main: ' + this.state.facebookId)
    return (
       <View style={styles.container}>
        
    
         <Image resizeMode='contain' style={styles.header} source={require( 'image!tHeader')}/>
        
         <EventsView passEventCode={this.showEventDetails} spin={this.startSpinner} stopSpin={this.stopSpinner} facebookId={this.state.facebookId}/>  

       
         <View style={styles.footer}>  
           <TextInput style={styles.textInput} onChangeText={(text)=> this.setState({eventCode:text})} placeholder="#"/>
             <TouchableHighlight style={styles.button} underlayColor='#f1c40f' onPress={ this.showEventDetails}>
               <Text style={styles.buttonText}>Join</Text>
             </TouchableHighlight>
         </View>

         <ProgressHUD isVisible={this.state.is_hud_visible} isDismissible={true} overlayColor="rgba(0, 0, 0, 0.11)" />  
       </View>
      
    );
  },

  startSpinner(){
    this.showProgressHUD();
  },

  stopSpinner(){
    this.dismissProgressHUD();
  },

  showEventDetails(eventCode){
    //console.log('Passed Back Event Code: ' + eventCode)
    //console.log('State Event Code: ' + this.state.eventCode)
    var self = this;
    eventCode = eventCode;
    self.props.navigator.push({
                    title: eventCode, //refactor to contain event title
                    component: TabView,
                    passProps: {eventCode: eventCode,
                      facebookId:this.state.facebookId,
                    mainNavigator: self.props.navigator} //refactor to contain eventcode
                    
           }); 

    self.showProgressHUD();
  
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
    position:'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap:'nowrap',
    flexDirection:'column',
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    backgroundColor: 'white',
    padding:10,
    textAlign: 'left',
    margin:10,
    width:200,
    borderRadius:10,
  },
  subHeader: {
    fontSize:14,
    color: '#FFFFFF',

  },
  button: {
        height: 40,
        width:100,
        backgroundColor: 'grey',
        borderRadius: 8,
        justifyContent: 'center',
        margin: 10,
        marginLeft:10,
    },
   buttonText: {
        fontSize: 12,
        color: 'white',
        alignSelf: 'center'
    },
    header: {
      flex:1,
      position:'absolute',
      alignSelf:'stretch',
      backgroundColor:'#1B2B32',
      top:0,
      left:0,
      width:400,
      height:60,
    }, 
    footer: {
      flex:1,
      flexDirection:'row',
      position:'absolute',
      backgroundColor:'#1B2B32',
      bottom:0,
      left:0,
      width:400,
      height:60,
    }, 
    eventView: {
      position:'absolute',
      marginTop:10,
    }
  
});

module.exports = Main;