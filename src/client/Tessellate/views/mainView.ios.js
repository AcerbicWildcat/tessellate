'use strict';
 
var React = require('react-native');
var TabView = require('./tabView.ios.js');
var NewEventView = require('./newEvent.ios')

//Destructure React Object
var {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  Component,
  TextInput,
  AlertIOS,
  
} = React;
 
 
 //Create Main Class (First View of App)
class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      eventCode: '',
      loggedIn: false,
      isLoading: false
    }
  }

  render() {
    return (
      
      <View style={styles.container}>
        
        <Text style={styles.description}>
          Tessalate
        </Text>
        
        <TextInput style={styles.textInput} 
        onChangeText={(text) => this.setState({eventCode:text})}
        placeholder="#"/>
        
        <Text style={styles.subHeader}>
          Create or Join Event
        </Text>

        
        <TouchableHighlight style={styles.button}
                                    underlayColor='#f1c40f'
                                    onPress = {this.showEventDetails.bind(this)}
                                    >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableHighlight>
        
      </View>
      
    );
  }

  showEventDetails(){
    // if event exists - pass event code on to next page
    //eventCode = 5; // temp event code
    console.log(this.state.eventCode)
    if (this.state.eventCode){
      this.props.navigator.push({
                title: 'Event Title', //refactor to contain event title
                component: TabView,
                passProps: {eventCode: this.state.eventCode} //refactor to contain eventcode
                
       }); 
    }
     else {
      //An Event Code DNE so prompt the user to create an event or try again
      AlertIOS.alert(
        'This Event Does Not Exist!',
        'Create One?',
        [
          {text: 'Yes', onPress: () => this.props.navigator.push({
                title: 'New Event View',
                component: NewEventView,     
          })       
       },
          {text: 'Try Again', onPress: () => console.log('No Pressed!')}
        ]
      );
    }
  
  }
}

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
    fontSize:12,
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
  
});

module.exports = Main;