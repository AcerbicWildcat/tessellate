'use strict';
 
var React = require('react-native');
var Mosaic = require('./mosaicView.ios');
var Camera = require('./cameraView.ios')
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
  
} = React;




//Tab Bar Instance contains a Camera Tab and a Mosaic Tab
//You can toggle between the two
class TabView extends Component {
  constructor(props){
    super(props);
    this.state = {
     	selectedTab: 'mosaic',
      eventCode: props.eventCode,
      mainNavigator: props.mainNavigator,
    }
  }

  setSelectedTabCallBack(tab){
    this.setState({selectedTab:tab})
  }

  render() {
    console.log('selected tab at tabView leve: ' + this.state.selectedTab)
    return (
    	<TabBarIOS selectedTab={this.state.selectedTab}>
    		<TabBarIOS.Item
    				style = {styles.tabBarItem}
                    selected={this.state.selectedTab === 'camera'}
                    title= 'Camera'
                    onPress={() => {
                        this.setState({
                            selectedTab: 'camera'
                        });
                    }}>
             <Camera mainNavigator={this.state.mainNavigator} selectedTab={this.setSelectedTabCallBack.bind(this)}/>
              
            </TabBarIOS.Item>
            <TabBarIOS.Item
                    selected={this.state.selectedTab === 'mosaic'}
                    title= 'Mosaic'
                    onPress={() => {
                        this.setState({
                            selectedTab: 'mosaic'
                        });
                    }}>
                    <Mosaic/>
                </TabBarIOS.Item>
    	</TabBarIOS>
      
    );
  }

  
}

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
  tabBarItem : {
    fontSize: 12,
    color: '#000',
  }

});

module.exports = TabView;