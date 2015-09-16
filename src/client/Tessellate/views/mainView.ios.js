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
 
 
//User's Created and Joined Events
var Main =  React.createClass({
 
  getInitialState: function() {
    this.props.navRef.setState({navBarHidden:true});
    return {
      eventCode: '',
      facebookId: this.props.facebookId,
      navRef: this.props.navRef
    };
  },

  mixins: [ProgressHUD.Mixin],

  componentDidMount() {
    this.stopSpinner()
    this.refs.events.fetchUserEvents();
    this.state.navRef.setState({navBarHidden:true});
  },

  render() {

    //TODO - Use Event Emitter to update events in listview on main page load
    return (
       <View style={styles.container}>
        
    
         <Image resizeMode='contain' style={styles.header} source={require( 'image!tHeader')}/>
        
         <EventsView ref={'events'} passEventCode={this.showEventDetails} spin={this.startSpinner} stopSpin={this.stopSpinner} facebookId={this.state.facebookId}/>  

       
         <View style={styles.footer}>  
           <TextInput style={styles.textInput} onChangeText={(text)=> this.setState({eventCode:text})} placeholder="# Join an Event"/>
             <TouchableHighlight style={styles.button} underlayColor='#f1c40f' onPress={ this.showEventDetails.bind(this,this.state.eventCode)}>
               <Text style={styles.buttonText}>Join</Text>
             </TouchableHighlight>
         </View>

         <ProgressHUD isVisible={this.state.is_hud_visible} isDismissible={true} overlayColor="rgba(0, 0, 0, 0.11)" />  
       </View>
      
    );
  },

  reloadEvents(callback){
    callback();
  },

  startSpinner(){
    this.showProgressHUD();
  },

  stopSpinner(){
    this.dismissProgressHUD();
  },



  showEventDetails(eventCode){
    var joinEventURL = 'http://10.6.1.173:8000/events/' + eventCode
    //Join the event
    var joinEventObj = {  
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
        'Host': 'http://10.6.1.173:8081',
        'FacebookID':this.props.facebookId,
      }
    }

    fetch(joinEventURL, joinEventObj)  
      .then(function(res) {
        return res.json();
       })
      .then(function(resJson) {
        return resJson;
       })

    var self = this;
    if (eventCode){
      eventCode = eventCode.trim();
      self.props.navigator.push({
                      title: '#' + eventCode, //refactor to contain event title
                      component: TabView,
                      passProps: {eventCode: eventCode,
                      facebookId:this.state.facebookId,
                      mainNavigator: self.props.navigator,
                      navRef:self.state.navRef,
                      loadEvents:self.refs.events.fetchUserEvents.bind(self.refs.events)
                      } //refactor to contain eventcode
                      
             }); 
    } else {
      AlertIOS.alert(
         'You are unable to join this event',
         ':(',
         [
           {text: 'Try Again', onPress: () => {self.fetchUserEvents}}
         ]
       );
    }
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
        position:'absolute',
        height: 40,
        width:80,
        backgroundColor: 'grey',
        borderRadius: 8,
        justifyContent: 'center',
        margin:10,
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