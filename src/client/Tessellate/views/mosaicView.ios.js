  'use strict';
 
var React = require('react-native');
var Icon = require('react-native-vector-icons/FontAwesome');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  AlertIOS,
} = React;

var ProgressHUD = require('react-native-progress-hud'); 

var MosaicView = React.createClass({
  mixins: [ProgressHUD.Mixin],
  
  getInitialState() {
    return {
      nav:this.props.mainNavigator,
      eventCode:this.props.eventCode,
      facebookId:this.props.facebookId,
      mosaicMainImage:'.img',
      mosaicTitle:'',
      mosaicMembers:'',
      mosaicImages:0,
      loaded:'false',
      eventUrl: '',
    }
  },

/**
 * [goHome reload eventsand return to mainView]
 * 
 */
  goHome(){
    this.props.loadEvents();
    this.props.nav.pop()
  },
 
  componentDidMount() {
    this.fetchMosaicData();
  },

  /**
   * [fetchMosaicData GET /event/:eventCode]
   * 
   */
  fetchMosaicData(){
    var _this = this;
    var apiString = 'http://tessellate-penguin.herokuapp.com/event/' + this.state.eventCode;
    _this.setState({eventUrl:apiString});
    var getMosaicObject = {  
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
        //'Host': 'http://10.6.1.173:8081',
        'FacebookID':_this.props.facebookId,
      }
    }
    _this.showProgressHUD();
    fetch(apiString, getMosaicObject)  
      .then(function(res) {
        //console.log(res);
        if (!res){
          throw new Error('We were unable to find this event.')
        }
        return res.json();
       })
      .then(function(resJson) {
        var mosaicMainImage = resJson.image.imgPath;
        var eventName = resJson.event.name || 'No Event Title';
        var eventMembers = resJson.event.contributors.length || 0;
        var eventImages = resJson.event.images.length || 0;
        if (!resJson){
          throw new Error('This event does not exist!');
        }
        _this.setState({mosaicMainImage:mosaicMainImage,mosaicTitle:eventName,mosaicMembers:eventMembers,mosaicImages:eventImages},function(){
          _this.dismissProgressHUD();
        }); 
        _this.setState({loaded:true});
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
     var membersIcon = (<Icon name="child" size={20} color="black" style={styles.icon} />)
     var photoIcon = (<Icon name="photo" size={20} color="black" style={styles.icon} />)
     var mosaic = this.state.mosaicMainImage === '.img' ? require('image!mainLogo') : {uri: this.state.mosaicMainImage};
    return (
      <View style={styles.outerContainer}>
        <TouchableHighlight style = {styles.header} onPress={this.goHome}>
          <Image resizeMode='contain' style={styles.header} source={require( 'image!tHeader')}/>
        </TouchableHighlight>
        <View style={styles.mosaicContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.mosaicTitleText}>{this.state.mosaicTitle}</Text>
          </View>
          <Text style={styles.mosaicEventCodeText}>
            <Text style={styles.searchText}> Search: </Text>
            #{this.state.eventCode} 
          </Text>
          <Image resizeMode='contain' style={styles.mosaic} source={mosaic} />
          <View style={styles.statsContainer}>
          {membersIcon}
            <Text style={styles.mosaicMembersText}>
              {this.state.mosaicMembers} 
              <Text style={styles.filler}> Member(s)</Text>
            </Text>
          {photoIcon}
            <Text style={styles.mosaicMembersText}>
              {this.state.mosaicImages} 
              <Text style={styles.filler}> Photo(s) </Text>
            </Text>
          </View>
        </View>
        <ProgressHUD  isVisible={this.state.is_hud_visible} isDismissible={false} overlayColor="rgba(0, 0, 0, 0.11)" />
      </View>
    );
  }
});

var styles = StyleSheet.create({
   header: {
      position:'relative',
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
      justifyContent:'center',

    },
    outerContainer: {
      flex:1,
    },
  
    mosaicContainer:{
      position:'relative',
      backgroundColor:'white',
      top:5,
      bottom:0,
      left:0,
      justifyContent:'center',
      alignItems:'center',
     
    },
    mosaic: {
      position:'relative',
      width:300,
      height:300,
      marginTop:10,
      marginBottom:20,
      marginLeft:0,
      marginRight:0,
      left:0,
      backgroundColor:'#1B2B32'
    },
    statsContainer: {
      flex:1,
      flexDirection:'row',
    },
    mosaicTitleText: {
      fontStyle:'italic',
      fontSize:34,
      fontWeight:'500',
    },
    titleRow:{
      flex:1,
      flexDirection:'row',
      alignItems:'center',
      marginTop:20,
    },
    mosaicMembersText: {
      position:'relative',
      flex:1,
      fontSize:20,
      fontWeight:'700',
      alignSelf:'flex-start',
      left:0,
      marginRight:15,
      marginLeft:5,
      marginBottom:20,

    },
    mosaicEventCodeText: {
      position:'relative',
      fontSize:16,
      fontStyle:'normal',
      fontWeight:'200',
      color:'grey',
      right:5,

    },
    searchText: {
      fontSize:18,
      fontStyle:'normal',
      fontWeight:'400',
      color:'#1B2B32',
    },
    eventThumbnail: {
      width: 20,
      height: 20,
      marginRight:10,
      marginLeft:10,    
    },
   takePictures:{
    position:'relative',
    backgroundColor:'#1B2B32',
    width:200,
    height:30,
    alignItems:'center',
    bottom:0,
   },
   takePicturesText: {
    color:'white',
    fontSize:16,
    fontWeight:'200',
   },
   filler: {
    fontSize:12,
    fontWeight:'300',
   }


});

module.exports = MosaicView;