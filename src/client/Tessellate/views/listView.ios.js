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
  },
  buttonText: {
    fontSize: 18,
    color: 'white'
  },
  button: {
    height: 60,
    backgroundColor: '#48BBEC',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchInput: {
    height: 60,
    padding: 10,
    fontSize: 18,
    color: '#111',
    flex: 10
  },
  rowContainer: {
    padding: 10,
  },
  footerContainer: {
    backgroundColor: '#E3E3E3',
    alignItems: 'center',
    flexDirection: 'row'
  }
});


class UserEventsView extends React.Component {
	
	constructor(props){
	   super(props);
	   this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
	   this.state = {
	     dataSource: this.ds.cloneWithRows({events:[{eventName:'Macks Wedding'},{eventName:'Prad Birthday'}]})
	   }
	 }

	 componentDidMount() {
	       this.fetchUserEvents();
	 }

	fetchUserEvents(){
		//api request
		var data = {

		};

		this.setState({
              dataSource: this.ds.cloneWithRows(data)
        },function(){
        	console.log('we done did it')
        })
	}

	renderRow(rowData){
		console.log('cloning rows with data: ' + rowData)
	   return (
	     <View>
	       <View style={styles.rowContainer}>
	         <Text> {rowData} </Text>
	       </View>
	      
	     </View>
	   )
	 }

	render(){
		console.log('rendering list view')
	    return (
	      <View style={styles.container}>
	          <ListView
	            dataSource={this.state.dataSource}
	            renderRow={this.renderRow}
	            renderHeader={() => null} />
	      </View>
	    )
	  }



};

module.exports = UserEventsView;