var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,

} = React;
var Camera = require('react-native-camera');
var ReviewPhoto = require('./reviewPhotoView.ios')

var CameraView = React.createClass({
  getInitialState() {
    return {
      cameraType: Camera.constants.Type.back,
      captureTarget:Camera.constants.CaptureTarget.disk, 
      eventCode: this.props.eventCode,
      facebookId: this.props.facebookId,
    }
  },

  renderCamera(){
    return (
      <Camera
        ref="cam"
        style={styles.container}
        type={this.state.cameraType}
      >
        <Image resizeMode='contain' style={styles.goHomeButton} source={require( 'image!mainLogo')}/>
        <TouchableHighlight style={styles.button}
        onPress={this._takePicture}>
          <Image resizeMode='contain' style={styles.takePic} source={require('image!takePictureIcon')}/>
        </TouchableHighlight>

      </Camera>
    );
  },

  renderText(){
    return (
      <View style={styles.container}>
        <Text> You are unable to take photos on this device </Text>
      </View>
    )
  },

  render() {
     return (<Camera
        ref="cam"
        style={styles.container}
        type={this.state.cameraType}
      >

        <TouchableHighlight style={styles.goHome}>
           <Image resizeMode='contain' style={styles.goHomeButton} source={require( 'image!mainLogo')}/>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button}
        onPress={this._takePicture} underlayColor={'transparent'}>
          <Image resizeMode='contain' style={styles.takePic} source={require('image!takePictureIcon')}/>
        </TouchableHighlight>

      </Camera>)
    
  },

  /**
   * [_switchCamera Toggle Camera Angle]
   * @return {[null]} [no return value]
   */
  _switchCamera() {
    var state = this.state;
    state.cameraType = state.cameraType === Camera.constants.Type.back
      ? Camera.constants.Type.front : Camera.constants.Type.back;
    this.setState(state);
  },

  /**
   * [_takePicture Captures Image and routes user to ReviewPhotoView]
   * @return {[null]} [none]
   */
  _takePicture() {
    var self = this;
    this.refs.cam.capture(function(err, data) {
      if (data){
        console.log('DATA: ', data)
        var photoURL = data.toString();
      } else {
        //alert- something went wrong,please retake that picture
      }
      
      if (photoURL){
        self.props.mainNavigator.push({
          title: 'Review Photo',
          component:ReviewPhoto,
          passProps: {photo:photoURL,
          mainNavigator: self.props.mainNavigator,
          eventCode: self.state.eventCode,
          selectedTab:self.props.selectedTab,
          facebookId:self.state.facebookId }
        })
      }
    });
  }


  /*<TouchableHighlight onPress={this._switchCamera}>
          <Text>The old switcheroo</Text>
        </TouchableHighlight>*/
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    position:'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  button: {
        position:'absolute',
        bottom:55,
        left:135,
        backgroundColor: 'transparent',
        borderRadius: 8,

    },
   buttonText: {
        fontSize: 12,
        color: 'white',
        alignSelf: 'center'
    },
    takePic: {
      width:100,
      height:100,
  
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
    goHomeButton:{
     position:'absolute',
      top:7,
      left:80,
      opacity:.8, 
      height:50,
      width:50,
      backgroundColor:'#1B2B32',
    }

});

module.exports = CameraView;