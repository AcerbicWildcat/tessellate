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
    textAlign: 'center',
    color: '#FFFFFF'
  },

});


//Display Current Version of Event's Mosaic
class MosaicView extends Component {
  constructor(props){
    super(props);
    this.state = {
     
    }
  }

  render() {
    //good option - https://github.com/Flipboard/react-canvas
    return (

      <View style={styles.container}>

        <Text style={styles.description}>
          Mosaic View
        </Text>
        
      </View>
      
    );
  }

  
}

module.exports = MosaicView;