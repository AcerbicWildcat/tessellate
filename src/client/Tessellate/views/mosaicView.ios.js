  'use strict';
 
function drawSine(t) {
  var path = `M ${0} ${Math.sin(t) * 100 + 120}`;
  var x, y;
 
  for (var i = 0; i <= 10; i += 0.5) {
    x = i * 50;
    y = Math.sin(t + x) * 100 + 120;
    path = path + ` L ${x} ${y}`
  }
 
  return path;
}
 
 
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  AlertIOS,
} = React;
 
var {Use, Path, Defs, Mask, LinearGradient,G,SvgDocument,Svg} = require('react-native-svg-elements');
var TimerMixin = require('react-timer-mixin');

var MosaicView = React.createClass({
  mixins: [TimerMixin],
 
  getInitialState() {
    return {t: 0,
      nav:this.props.mainNavigator,
      eventCode:this.props.eventCode,
      facebookId:this.props.facebookId,
      mosaicMainImage:'./img'
    }
  },

  goHome(){
    this.props.nav.pop()
  },
 
  componentDidMount() {
    
    this.fetchMosaicData();
  },

  fetchMosaicData(){
    var _this = this;
    var apiString = 'http://localhost:8000/event/' + this.state.eventCode;

    var getMosaicObject = {  
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
        'Host': 'http://localhost:8081',
        'FacebookID':_this.props.facebookId,
      }
    }

    fetch(apiString, getMosaicObject)  
      .then(function(res) {
        if (!res){
          throw new Error('We were unable to find this event.')
        }
        return res.json();
       })
      .then(function(resJson) {
        var mosaicMainImage = resJson.image.imgPath;
        if (!resJson){
          throw new Error('This event does not exist!');
        }

        _this.setState({mosaicMainImage:mosaicMainImage}); 

        return resJson;
       })
      .catch((error) => {
        
        AlertIOS.alert(
           'Whoa! Something Went Wrong.',
           error.message,
           [
             {text: 'Try Again', onPress: () => {
              //redirect back to main page
              _this.props.nav.pop()

             }}
           ]
         );

      });

  },

 
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#1B2B32', justifyContent: 'center', alignItems: 'center'}}>
      <TouchableHighlight style={styles.goHome} activeOpacity={1} underlayColor={'transparent'} onPress={this.goHome.bind(this)}>
        <Image resizeMode='contain' style={styles.goHomeButton} source={require( 'image!mainLogo')}/>
      </TouchableHighlight>
      
        <Svg width={500} height={500} style={styles.container}>
          <Image source={{uri: this.state.mosaicMainImage}}
                 style={{width: 400, height: 400}} />
        </Svg>
      </View>
    );
  }
});

var styles = StyleSheet.create({
   header: {
      flex:1,
      position:'absolute',
      alignSelf:'stretch',
      backgroundColor:'#1B2B32',
      top:0,
      left:0,
      width:400,
      height:60,
    }, 
    container: {
      flex:1,
      position:'relative',
      justifyContent: 'center',
      alignItems: 'center',

    },
    goHome: {
      position:'relative',
      top:7,
      left:0,
      height:50,
      width:50,
      backgroundColor:'transparent',
    },
    goHomeButton:{
    
      position:'relative',
      top:7,
      left:0,
      height:50,
      width:50,
      backgroundColor:'transparent'
    }

});

module.exports = MosaicView;