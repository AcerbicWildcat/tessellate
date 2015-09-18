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
  AlertIOS
  
} = React;

var styles = StyleSheet.create({
  photo: {
    flex:1,
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap:'wrap',
    backgroundColor: '#1B2B32',
  },
  save: {
    position:'relative',
    //alignSelf:'flex-end',
    backgroundColor:'#1B2B32',
    width:80,
    height:50,
    marginRight:20,
    marginLeft:10,
    left:20,
    borderRadius:25,
    
  },
  discard: {
    position:'relative',
    //alignSelf:'flex-end',
    backgroundColor:'#1B2B32',
    width:100,
    height:50,
    
    marginLeft:20,
    marginRight:10,
    right:20,
    borderRadius:25,
  },
	image: {
    alignSelf:'center',
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
     //convet image path to image file
     var imageToSave = _this.props.photo;
     var uploadURL = 'http://tessellate-penguin.herokuapp.com/events/'+_this.state.eventCode + '/image';
     NativeModules.ReadImageData.readImage(imageToSave, (image) => {
      imageToSave = image;
      
      var obj = {
          uri:_this.props.photo, // either an 'assets-library' url (for files from photo library) or an image dataURL
          uploadUrl:uploadURL.trim(),
          fileName:'image',
          //mimeType,
          headers:{
            //'Host': 'http://10.6.1.173:8081',
            'FacebookID':_this.props.facebookId,
          },
          data: {
              // whatever properties you wish to send in the request
              // along with the uploaded file
          }
      };
      NativeModules.FileTransfer.upload(obj, (err, res) => {
          // handle response
          // it is an object with 'status' and 'data' properties
          // if the file path protocol is not supported the status will be 0
          // and the request won't be made at all
          console.log('POSTING photo: ', res)
          console.log('photo: ', res.status)

          if (err){
            console.log(err.message)
          }
          if (res.status === 0 ){
            AlertIOS.alert(
              'Something went wrong!',
              'We could not upload your picture',
              [
                {text: 'Ok', onPress: () => console.log('Ok Pressed!')},
              ]
            )
          }
      });

     })
    

         tab('mosaic')
         nav.pop();
   
    //END PROGRESS HUD
   
  }



  render() {
    console.log('EVENT CODE: ' + this.state.eventCode)
    return (

        <Image style={styles.photo}
        source={{uri: this.props.photo}}>
          <TouchableHighlight style={styles.save} onPress={() => this._savePictureToDB(this.props.mainNavigator,this.props.selectedTab)
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