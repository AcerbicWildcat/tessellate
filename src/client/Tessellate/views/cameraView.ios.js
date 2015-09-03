var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,

} = React;
var Camera = require('react-native-camera');
var ReviewPhoto = require('./reviewPhotoView.ios')

var CameraView = React.createClass({
  getInitialState() {
    return {
      cameraType: Camera.constants.Type.back
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
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableHighlight>

      </Camera>
    );
  },

  //switch camera view
  _switchCamera() {
    var state = this.state;
    state.cameraType = state.cameraType === Camera.constants.Type.back
      ? Camera.constants.Type.front : Camera.constants.Type.back;
    this.setState(state);
  },

  //take picture
  _takePicture() {
    var self = this;
    this.refs.cam.capture(function(err, data) {
      var photoURL = data.toString();
      if (photoURL){
        self.props.mainNavigator.push({
          title: 'SOS',
          component:ReviewPhoto,
          passProps: {photo:photoURL,
          mainNavigator: self.props.mainNavigator,
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
        bottom:50,
        left:100,
        height: 36,
        width:160,
        backgroundColor: 'grey',
        borderRadius: 8,

    },
   buttonText: {
        fontSize: 12,
        color: 'white',
        alignSelf: 'center'
    },

});

module.exports = CameraView;