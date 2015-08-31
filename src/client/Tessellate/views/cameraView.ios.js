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


//Present Camera
class CameraView extends Component {
  constructor(props){
    super(props);
    this.state = {
     
    }
  }

  render() {
    return (

      <View style={styles.container}>

        <Text style={styles.description}>
          Camera View
        </Text>
        
      </View>
      
    );
  }

  
}

module.exports = CameraView;