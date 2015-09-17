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
 
//var {Use, Path, Defs, Mask, LinearGradient,G,SvgDocument,Svg} = require('react-native-svg-elements');
//var TimerMixin = require('react-timer-mixin');
var ProgressHUD = require('react-native-progress-hud'); 

var MosaicView = React.createClass({
  mixins: [ProgressHUD.Mixin],
  
 
  getInitialState() {
    return {
      nav:this.props.mainNavigator,
      eventCode:this.props.eventCode,
      facebookId:this.props.facebookId,
      mosaicMainImage:'./img',
      mosaicTitle:'Could not find title of Mosaic',
      mosaicMembers:0,
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
        console.log('Mosaic Data',resJson)
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
      <TouchableHighlight style = {styles.header} onPress={this.goHome}>
      <Image resizeMode='contain' style={styles.header} source={require( 'image!tHeader')}/>
       </TouchableHighlight>
       <View style={styles.mosaicContainer}>
          <Text style={styles.mosaicTitleText}>{this.state.mosaicTitle}</Text> 
          <Text style={styles.mosaicMembersText}>Members: {this.state.mosaicMembers} </Text>
          <Image style={styles.mosaic} source={{uri: this.state.mosaicMainImage}} />
        </View>
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
      position:'absolute',
      top:7,
      left:80,
      height:50,
      width:50,
      backgroundColor:'transparent',
    },
    goHomeButton:{
    
      position:'absolute',
      top:7,
      left:80,
      height:50,
      width:50,
      backgroundColor:'transparent'
    },
    mosaicContainer:{
      position:'relative',
      backgroundColor:'white',
      padding:35,
      top:0,
      bottom:0,
    },
    mosaic: {
      position:'relative',
      marginLeft:10,
      marginRight:10,
      left:10,
      right:10,
      width:400,
      height: 400
    },
    mosaicTitleText: {
      position:'relative',
      fontSize:18,
      left:20,
      padding:5,
      fontStyle:'italic',
      fontWeight:'700',
      top:0,
    },
    mosaicMembersText: {
      position:'relative',
      fontSize:12,
      left:20,
      padding:5,
    }


});

/*

<TouchableHighlight style={styles.goHome} activeOpacity={1} underlayColor={'transparent'} onPress={this.goHome}>
        <Image resizeMode='contain' style={styles.goHomeButton} source={require( 'image!mainLogo')}/>
      </TouchableHighlight>
 */
module.exports = MosaicView;