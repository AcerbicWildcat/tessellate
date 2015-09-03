'use strict';
 
var React = require('react-native');

var {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  Component,
  TextInput,
  Image,
  
} = React;

var styles = StyleSheet.create({
	container: {
	   flex:1,
     position:'absolute',
    
	},
  photo: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
  },
	

});


//Display Current Version of Event's Mosaic
class ReviewPhotoView extends Component {
  constructor(props){
    super(props);
    this.state = {
     photo:'.img'
    }
  }

  render() {
    
    console.log('PHOTO TO Display: ' + this.props.photo)
    return (

      
        
        
        <Image style={styles.photo}
        source={{uri: this.props.photo}}>
        </Image>
       
      
      
    );
  }

  
}

module.exports = ReviewPhotoView;