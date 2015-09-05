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
    backgroundColor:'grey',
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

  /**
   * [_savePictureToDB onSave photo is POST'ed to the DB]
   * @param  {[object]} nav [main navigation component]
   * @param  {[function]} tab [selected tab callback]
   * @return {[null]}     [none]
   */
  _savePictureToDB(nav,tab){
    //start progress HUD

    //make POST request to API
    //pop off nav stack but set selected tab bar item to be mosaic
    /*var postObject = {  
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
        'Host': 'api.producthunt.com'
      },
      body: JSON.stringify({
        //tbd
      })
    /*
    fetch('API_ENDPOINT', OBJECT)  
      .then(function(res) {
        return res.json();
       })
      .then(function(resJson) {
        return resJson;
       })
    */
   
    //END PROGRESS HUD
    tab('mosaic')
    nav.pop();
  }



  render() {
    
    return (

        <Image style={styles.photo}
        source={{uri: this.props.photo}}>
          <TouchableHighlight style={styles.save} onPress={() => 
              this._savePictureToDB(this.props.mainNavigator,this.props.selectedTab)
            } >
           <Image resizeMode='contain' style={styles.save} source={require('image!saveImage')}/>
          </TouchableHighlight>

        <TouchableHighlight style={styles.discard} onPress={() => this.props.mainNavigator.pop()}>
          <Image resizeMode='contain' style={styles.discard} source={require('image!rejectImage')}/>
        </TouchableHighlight>
        


        </Image>
       
      
      
    );
  }

  
}

/*
   <Text style={styles.save} onPress={() => 
              this._savePictureToDB(this.props.mainNavigator,this.props.selectedTab)
            }>
            Save
            </Text>
*/
module.exports = ReviewPhotoView;