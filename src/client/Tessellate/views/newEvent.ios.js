'use strict';
 
var React = require('react-native');

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

});



class NewEventView extends Component {
  constructor(props){
    super(props);
    this.state = {
     
    }
  }

  render() {
    //consider - https://github.com/stephy/CalendarPicker
    return (

      <View style={styles.container}>

        <Text style={styles.description}>
          New Event View
        </Text>
        
      </View>
      
    );
  }

  
}

module.exports = NewEventView;