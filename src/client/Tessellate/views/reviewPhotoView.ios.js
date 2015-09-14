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
  NativeModules,
  
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
    left:20,
    borderRadius:25,
    
  },
  discard: {
    alignSelf:'flex-end',
    backgroundColor:'grey',
    width:150,
    height:50,
    marginLeft:20,
    borderRadius:25,
  }
	

});


//Display Current Version of Event's Mosaic
class ReviewPhotoView extends Component {
  constructor(props){
    super(props);
    this.state = {
     photo:'.img',
     eventCode:this.props.eventCode,
    }
  }

  /**
   * [_savePictureToDB onSave photo is POST'ed to the DB]
   * @param  {[object]} nav [main navigation component]
   * @param  {[function]} tab [selected tab callback]
   * @return {[null]}     [none]
   */
  _savePictureToDB(nav,tab){
     var _this = this;
    //create form
    var imageObj = {
        uri:_this.props.photo.toString() // either an 'assets-library' url (for files from photo library) or an image dataURL 
        /*uploadUrl,
        fileName,
        mimeType,
        data: {
            // whatever properties you wish to send in the request 
            // along with the uploaded file 
        }*/
    };

   NativeModules.FileTransfer.upload(imageObj, (err, res) => {
       // handle response 
       // it is an object with 'status' and 'data' properties 
       // if the file path protocol is not supported the status will be 0 
       // and the request won't be made at all 
       console.log('HOPE THIS WORKS: ' + res.data)
       console.log('HOOPE THDIS WORKS STAT: ' + res.status)

       var savePhotoURL = 'http://10.6.1.173:8000/events/'+this.state.eventCode + '/' + 'images';
       var savePictureObject = {  
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': "application/json",
           'Origin': '',
           'Host': 'http://10.6.1.173:8081',
           'FacebookID':_this.props.facebookId,
         },
         body:res.data
       }
       
       fetch(savePhotoURL,savePictureObject)  
         .then(function(res) {
           console.log(res);
           console.log('Attempting to save: ' + _this.props.photo.toString())
           return res.json();
          })
         .then(function(resJson) {
           return resJson;
          })

         tab('mosaic')
         nav.pop();
   
   });
   
    
    
   
    //END PROGRESS HUD
   
  }



  render() {
    console.log('EVENT CODE: ' + this.state.eventCode)
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