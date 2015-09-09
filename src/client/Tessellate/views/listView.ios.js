'use strict';

var React = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    ListView,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor:'#FFFFFF',
    position:'relative',
    marginTop:60,
    alignSelf:'stretch',
  },
  rowContainer: {
    padding: 10,
    backgroundColor:'grey',
  }
});


class UserEventsView extends React.Component {
	
	constructor(props){
	   super(props);
	   this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
	   this.state = {
	     dataSource: this.ds.cloneWithRows({events:[{eventName:'Macks Wedding', eventImage: '.img'},{eventName:'Prad Birthday'}]})
	   }
	 }

	 componentDidMount() {
	       this.fetchUserEvents();
	 }

	fetchUserEvents(){
		//api request
		var data = {
			events:[{eventName:'Macks Wedding'},{eventName:'Prad Birthday'}]
		};

		this.setState({
              dataSource: this.ds.cloneWithRows(data)
        },function(){
        	console.log('we done did it')
        })
	}

	renderRow(rowData){
		console.dir(rowData[0].eventName)
	   return (
	     <View>
	       <View style={styles.rowContainer}>
	         <Text> {rowData[0].eventName} </Text>
	       </View>
	      
	     </View>
	   )
	 }

	render(){
		
	    return (
	      <View style={styles.container}>
	          <ListView
	            dataSource={this.state.dataSource}
	            renderRow={this.renderRow.bind(this)}
	            renderHeader={() => null} />
	      </View>
	    )
	  }



};

module.exports = UserEventsView;