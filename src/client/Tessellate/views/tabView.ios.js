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

var cameraBase64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABbElEQVRIS8WV6zGDQRSGn1SADqgAFaACdKADUgEqIB1EBahAVIAK0IFUwDyZPWYn+fbiR8b+yiRnz3s5756MWPMZrbk/LYALYKNB4hOYlmpqAHvAS6fCHeBjqLYGcAucdwKMAetXTglgM7Hf7gSQ/T7wtVwvgFbcAIedzXrLZsBYAD8cNG49p0GGzyo767g3E+C70nwOmKRSSgTR+zxpk+TGrn1bAKfAQyIg68Ul4C1LzQlwn5HcAq4iIDWAu2SDd2XqnBy+x2GanFAmieNSikoWBXuZ+x6iefQRxOQ4l2UVv1g1BRFh5V4W5nSd7PDnQaL/ChDPvygfOEox18b3v84glz80xDwERRtrFjlEVcTzN0mq8QgYCXL4sl8OwaKw9Q5ekw0rOyYB2fQprZvBHLQAvGQMteAxU2Njc+/31YUogOxafyrBTkUeF2TPmQvwl73f0zSvmcRjcoC9u78XRGunrf/k3mbFurUD/ADn0059y6g/CQAAAABJRU5ErkJggg==';
var mosaicBase64Icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAAAAAA7VNdtAAABlElEQVR4nO2Uz0oDQQzGJ5lYarcqtUK9+AA+gIjgUUTw/XwAH0JvFT1460E8FLwJgn8LSut22+5mvHSS7EGwngptTrOd/JLOfN/EuWUsboA3HxzMh90IYNb/6XJciyUC3L6B1MAj2XDF4xbHJPqA3qbypxe+mFYKlZeGbpwd5FOEk2v62ojFGCe2/+c643SZpV8cT5Kn5H1EAMEi3kNEPHoX63pEN3MsOELMokvZPswsy8BRfeZAdemDjiyypgLUqvViihRJlW62Vf2e6ROuWqL+uBsiEqpdevgU+6wObJeViiB5c1/r5rS7MxbH1Q0Bh0091uuebowoSycRATaI6zekSz/TO8KUACDasuRKhygKIKC8HVzacuYgRHny5bevd+wQnOQ4oO+BSBlyi2QjkXI4HqmUY3pKoxUDZYbgyy2Rb9hJBPH37jlonMggBld50t/Tc5PUppGxT8ljeZA/NimCdbK1T+li1HwOQM4PAHMr5dwifx19msSU/Db6En3k9apJqlG7pcK+29HX1tGX3pn52PkBX1XL/QlloOoAAAAASUVORK5CYII=";



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