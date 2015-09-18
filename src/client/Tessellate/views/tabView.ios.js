'use strict';
 
var React = require('react-native');
var Mosaic = require('./mosaicView.ios');
var Camera = require('./cameraView.ios')
var Icon = require('react-native-vector-icons/FontAwesome');

var {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  Component,
  TextInput,
  TabBarIOS,
  NavigatorIOS,
  Navigator,
  Image,
  AppStateIOS,
  
} = React;




//Tab Bar Instance contains a Camera Tab and a Mosaic Tab
//You can toggle between the two
var TabView =  React.createClass( {



  getInitialState(){
    return {
      selectedTab: 'mosaic',
      eventCode: this.props.eventCode,
      mainNavigator: this.props.mainNavigator,
      facebookId:this.props.facebookId,
      navRef:this.props.navRef,
      loadEvents:this.props.loadEvents,
      showCamera:false,
      
    }
  },

  componentWillMount() {
    Icon.getImageSource('../assets/mainLogo.png', 25).then((source) => this.setState({ mosaicIcon: source }));
  },

  componentDidMount() {
    this.state.loadEvents();
    this.state.navRef.setState({navBarHidden:true});
  },

  /**
   * [setSelectedTabCallBack allows for user to be taken to Mosaic Tab after a picture has been saved]
   * @param {[string]} tab [Selected Tab]
   */
  setSelectedTabCallBack(tab){
    this.setState({selectedTab:tab})
  },


  render() {
    
    var camera = this.state.showCamera ? <Camera facebookId={this.state.facebookId} mainNavigator={this.state.mainNavigator} eventCode={this.state.eventCode} selectedTab={this.setSelectedTabCallBack}/> : null;
    return (
  
      <TabBarIOS selectedTab={this.state.selectedTab}>

        <Icon.TabBarItem
            iconName="camera"
            selected={this.state.selectedTab === 'camera'}
            title= 'Camera'
            onPress={() => {
                this.setState({
                    selectedTab: 'camera',
                    showCamera:true,
                });
            }}>
        
          {camera}  

        </Icon.TabBarItem>
        <Icon.TabBarItem
            sytle={styles.icon}
            iconName="picture-o"
            selected={this.state.selectedTab === 'mosaic'}
            title= 'Mosaic'
            onPress={() => {
                this.setState({
                    selectedTab: 'mosaic',
                    showCamera:false,
                });
          }}>

          <Mosaic loadEvents={this.state.loadEvents} facebookId={this.state.facebookId} eventCode={this.state.eventCode} nav={this.state.mainNavigator}/>
        </Icon.TabBarItem>
      </TabBarIOS>
      
      
    );
  },

  
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B2B32',
  },
  description: {
      fontSize: 30,
      textAlign: 'center',
      color: '#FFFFFF'
  },
  tabBarItem : {
    fontSize: 12,
    color: '#000',
  },
  tabBarItemIcon: {
    height:25,
    width:25,
  },
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
    icon: {
      height:15,
      width:15,
    },

});

module.exports = TabView;