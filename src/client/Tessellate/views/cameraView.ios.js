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
      eventCode: this.props.eventCode
    }
  },

  render() {
    
    return (
      <Camera
        ref="cam"
        style={styles.container}
        type={this.state.cameraType}
      >
        <TouchableHighlight style={styles.button}
        onPress={this._takePicture}>
          <Image resizeMode='contain' style={styles.takePic} source={require('image!takePictureIcon')}/>
        </TouchableHighlight>

      </Camera>
    );
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
        var photoURL = data.toString();
      } else {
        //alert- something went wrong,please retake that picture
      }
      
      if (photoURL){
        self.props.mainNavigator.push({
          title: 'SOS',
          component:ReviewPhoto,
          passProps: {photo:photoURL,
          mainNavigator: self.props.mainNavigator,
          eventCode: self.state.eventCode,
          selectedTab:self.props.selectedTab }
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
        bottom:120,
        left:150,
        height: 36,
        width:160,
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
    }

});

module.exports = CameraView;