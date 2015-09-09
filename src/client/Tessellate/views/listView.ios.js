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
    padding: 20,
    marginTop:10,
    backgroundColor:'grey',
  }
});


class UserEventsView extends React.Component {
	
	constructor(props){
	   super(props);
	   this.sectionIDs = ['Created Events', 'Joined Events'];
	   this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,
	   sectionHeaderHasChanged: (s1, s2) => s1 !== s2})
	   this.state = {
	     dataSource: this.ds.cloneWithRows([{eventName:'You don\'t have any events yet...'}]),
	     dataBlob:{}
	   }
	 }

	 componentDidMount() {
	       this.fetchUserEvents();
	 }

	fetchUserEvents(){
		//api request
		var data = [{eventName:'Jimmy Wedding',img:'  hello jimmy'},{eventName:'Rob Birthday'}];
		var tempDataBlob = this.state.dataBlob;
		tempDataBlob[this.sectionIDs[0]]=data;
		tempDataBlob[this.sectionIDs[1]]=data;

		this.setState({
              dataSource: this.ds.cloneWithRowsAndSections(tempDataBlob)
        },function(){
        	console.log('we done did it')
        })
	}

	renderRow(rowData){
		
	   return (
	     <View>
	       <View style={styles.rowContainer}>
	         <Text> {rowData} </Text>
	       </View>
	      
	     </View>
	   )
	 }

	renderSectionHeader(sectionData, sectionID){
		return (
	      <View style={styles.section}>
	        <Text style={styles.sectionText}>{sectionID}</Text>
	      </View>
      )
	}

	render(){
		
	    return (
	      <View style={styles.container}>
	          <ListView
	            dataSource={this.state.dataSource}
	            renderRow={this.renderRow.bind(this)}
	            renderSectionHeader={this.renderSectionHeader}
	            renderHeader={() => null} />
	      </View>
	    )
	  }



};

module.exports = UserEventsView;