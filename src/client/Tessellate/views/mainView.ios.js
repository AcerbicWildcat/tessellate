'use strict';
 
var React = require('react-native');
var TabView = require('./tabView.ios.js');
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
 
 
var Main =  React.createClass({
  getInitialState: function() {
    this.props.navRef.setState({navBarHidden:true});
    return {
      eventCode: '',
      facebookId: this.props.facebookId,
      navRef: this.props.navRef,
      isText:false,
    };
  },

  mixins: [ProgressHUD.Mixin],

  componentDidMount() {
    this.stopSpinner()
    this.refs.events.fetchUserEvents();
    this.state.navRef.setState({navBarHidden:true});
  },

  render() {

    return (
       <View style={styles.container}>
        
         <Image resizeMode='contain' style={styles.header} source={require( 'image!tHeader')}/>
        
         <EventsView ref={'events'} passEventCode={this.showEventDetails} spin={this.startSpinner} stopSpin={this.stopSpinner} facebookId={this.state.facebookId}/>  

         <View style={styles.footer}>  
           <TextInput style={styles.textInput} onChangeText={(text)=> this.setState({eventCode:text,isText:true})} placeholder="# Join an Event"/>
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

  /**
   * [startSpinner start progressHUD in MainView]
   * 
   */
  startSpinner(){
    this.showProgressHUD();
  },

  /**
   * [stopSpinner stop progressHUD in MainView]
   * 
   */
  stopSpinner(){
    this.dismissProgressHUD();
  },


  /**
   * [showEventDetails display eventdetails in MosaicView]
   * @param  {[type]} eventCode [event code of event to join]
   * 
   */
  showEventDetails(eventCode) {
   var joinEventURL = 'http://tessellate-penguin.herokuapp.com/events/' + eventCode
   var self = this;

   if (eventCode) {
     var joinEventObj = {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'Origin': '',
         //'Host': 'http://10.6.1.173:8081',
         'FacebookID': this.props.facebookId,
       }
     }

     fetch(joinEventURL, joinEventObj)
       .then(function(res) {
         return res.json();
       })
       .then(function(resJson) {
        console.log('Event JOINED: ', resJson);
         if (resJson.error && self.state.isText) {
           console.log('its alive')
           throw new Error(resJson.error);
         }
         return resJson;
       })
       .catch((error) => {

         AlertIOS.alert(
           'Whoa! Something Went Wrong.',
           error.message, [{
             text: 'Try Again',
             onPress: () => {
               //redirect back to main page
               //_this.props.nav.pop()

             }
           }]
         );

       });

     //go to its mosaic view
     if (eventCode) {
       console.log('pushing to next screen')
       eventCode = eventCode.trim();
       self.setState({
         isText: false
       });
       self.props.navigator.push({
         title: '#' + eventCode, //refactor to contain event title
         component: TabView,
         passProps: {
           eventCode: eventCode,
           facebookId: this.state.facebookId,
           mainNavigator: self.props.navigator,
           navRef: self.state.navRef,
           loadEvents: self.refs.events.fetchUserEvents.bind(self.refs.events)
         } //refactor to contain eventcode

       });
     } else {
       AlertIOS.alert(
         'You are unable to join this event',
         ':(', [{
           text: 'Try Again',
           onPress: () => {
             self.fetchUserEvents
           }
         }]
       );
     }
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