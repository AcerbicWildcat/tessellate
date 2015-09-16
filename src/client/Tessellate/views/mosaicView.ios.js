  'use strict';
 
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
var ProgressHUD = require('react-native-progress-hud'); 

var MosaicView = React.createClass({
  mixins: [TimerMixin,ProgressHUD.Mixin],
  
 
  getInitialState() {
    return {t: 0,
      nav:this.props.mainNavigator,
      eventCode:this.props.eventCode,
      facebookId:this.props.facebookId,
      mosaicMainImage:'./img'
    }
  },

  goHome(){
    //trigger reload of listview
    this.props.loadEvents();
    this.props.nav.pop()
  },
 
  componentDidMount() {
    
    this.fetchMosaicData();
  },

  fetchMosaicData(){
    var _this = this;
    var apiString = 'http://10.6.1.173:8000/event/' + this.state.eventCode;

    var getMosaicObject = {  
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
        'Host': 'http://10.6.1.173:8081',
        'FacebookID':_this.props.facebookId,
      }
    }
    _this.showProgressHUD();
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

        _this.setState({mosaicMainImage:mosaicMainImage},function(){
          _this.dismissProgressHUD();
        }); 
        
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
      
        <Svg width={800} height={800} style={styles.container}>
          <Image source={{uri: this.state.mosaicMainImage}}
                 style={{width: 400, height: 400}} />
        </Svg>
        <ProgressHUD isVisible={this.state.is_hud_visible} isDismissible={true} overlayColor="rgba(0, 0, 0, 0.11)" />  
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