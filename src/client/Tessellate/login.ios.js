'use strict';

var React = require('react-native');
var Svg = require('react-native-svg');
var Path = Svg.Path;
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


//Display Current Version of Event's Mosaic
class MosaicView extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    //good option - https://github.com/Flipboard/react-canvas
    return (

      < View style = {
        styles.container
      } >
      <Svg width={500} height={500} style={{width: 320, height: 350}}>
           
      </Svg>
      < Text style = {
        styles.description
      } >
      Mosaic View < /Text>

      < /View>

    );
  }


}


//How to install react-native-svg with xCode 7+
//npm install react-native-svg --save
//right click on libraries - add files to "project name"
//add RNSvg.xcodeproj
//Select your projects target and Link Binary with Libraries - add libRNSvg.a
//link .tbd file
//Build Settings -Linking -Other Linker Flags - add -lxml2
//fin

module.exports = MosaicView;