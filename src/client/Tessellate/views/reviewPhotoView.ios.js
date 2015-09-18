'use strict';
 
var React = require('react-native');
var Icon = require('react-native-vector-icons/FontAwesome');

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

   
  }

  render() {
   var discard = (<Icon name="arrow-left" size={40} color="white" style={styles.icon} />)
   var save = (<Icon name="save" size={40} color="white" style={styles.icon} />)
    return (
      <View style={styles.container}>
        <Image style={styles.photo}source={{uri: this.props.photo}}>
        <TouchableHighlight style={styles.goHome}>
        <Image resizeMode='contain' style={styles.goHome} source={require( 'image!tHeader')}/>
        </TouchableHighlight>
          <TouchableHighlight style={styles.save} underlayColor='transparent' onPress={() => this._savePictureToDB(this.props.mainNavigator,this.props.selectedTab)}>
           {save}
          </TouchableHighlight>
          <TouchableHighlight style={styles.discard} underlayColor='transparent' onPress={() => this.props.mainNavigator.pop()}>
            {discard}
          </TouchableHighlight>
        </Image>
      </View>
      
      
    );
  }

  
}

var styles = StyleSheet.create({
  container: {
    flex:1,
  },
  photo: {
    flex:1,
    flexDirection:'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap:'wrap',
    backgroundColor: '#1B2B32',
  },
  save: {
    position:'absolute',
    backgroundColor:'transparent',
    bottom:10,
    right:20,
    
  },
  discard: {
    position:'absolute',
    backgroundColor:'transparent',
    width:100,
    height:50,
    left:10,
    top:10,
  },
  image: {
    alignSelf:'center',
  },
   goHome: {
      position:'absolute',
      top:7,
      left:80,
      opacity:.8, 
      height:50,
      width:50,
      backgroundColor:'transparent',
    },

});


module.exports = ReviewPhotoView;