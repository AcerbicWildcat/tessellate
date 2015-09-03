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
  photo: {
    flex:1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap:'wrap',
    backgroundColor: 'grey',
  },
  save: {
    alignSelf:'flex-end',
    backgroundColor:'grey',
    width:150,
    height:50,
    marginRight:20,
    
  },
  discard: {
    alignSelf:'flex-end',
    backgroundColor:'white',
    width:150,
    height:50,
  }
	

});


//Display Current Version of Event's Mosaic
class ReviewPhotoView extends Component {
  constructor(props){
    super(props);
    this.state = {
     photo:'.img'
    }
  }

  _savePictureToDB(nav,tab){
    //make POST request to API
    //pop off nav stack but set selected tab bar item to be mosaic
    console.log('tab on save' + tab);
    tab('mosaic')
    nav.pop();
  }

  _discardPhoto(nav){
    //pop to previous view
  }

  render() {
    console.log('selectedTab at reviewPhoto level ' + this.props.selectedTab)
    return (

        <Image style={styles.photo}
        source={{uri: this.props.photo}}>
        <Text style={styles.save} onPress={() => 
          this._savePictureToDB(this.props.mainNavigator,this.props.selectedTab)
        }>
          Save
        </Text>
        <Text style={styles.discard} onPress={() => this.props.mainNavigator.pop()}>
          Re-Take
        </Text>
        </Image>
       
      
      
    );
  }

  
}

module.exports = ReviewPhotoView;