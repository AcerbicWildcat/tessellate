'use strict';
//phone dev ip: 10.6.1.173
var React = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    ListView,
    AlertIOS,
    Image,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor:'#FFFFFF',
    position:'relative',
    top:0,
    marginTop:60,
    alignSelf:'stretch',
  },
  section: {

  	marginTop:0,
  	backgroundColor:'#37646F',
  },
  sectionText: {
  	fontSize:18,
  	fontWeight:'700',
  	padding:12,
  	color:'#FFFFFF',
  },
  rowContainer: {
    padding: 20,
    backgroundColor:'#FFFFFF',
  }, 
  rowText: {
  	fontSize:10,
  	fontWeight:'500',
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
		//construct GET request
		var self = this;
		var getEvents = {  
		  method: 'GET',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		    'Origin': '',
		    'Host': 'http://localhost:8081'
		  }
		}
		this.props.spin();
		//make Fetch Call
		fetch('http://localhost:8000/user', getEvents)  
		  .then(function(res) {
		  	console.log('attempting to get events' + res);
		  	
		    return res.json();
		   })
		  .then(function(resJson) {
		  	console.log('Res JSON: ' + resJson)
		  	console.dir(resJson)
		  	var data = resJson.events;
		  	var createdEvents = [];
		  	var joinedEvents = [];

		  	for (var i = 0 ; i< data.length; i++){
		  		//console.dir(data[i]._creator.toString());
		  	}

		  	self.props.stopSpin();

  			var tempDataBlob = self.state.dataBlob;
  			tempDataBlob[self.sectionIDs[0]]=data;
  			tempDataBlob[self.sectionIDs[1]]=data;

  			self.setState({
  	              dataSource: self.ds.cloneWithRowsAndSections(tempDataBlob)
  	        },function(){
  	        	console.log('we done did it')
  	        })
  			
		    return resJson;
		   })
		  .catch((error) => {
		  	self.stopSpin()
		  	AlertIOS.alert(
		  	   'Whoa! Something Went Wrong.',
		  	   error.message,
		  	   [
		  	     {text: 'Try Again', onPress: () => {self.fetchUserEvents}}
		  	   ]
		  	 );

		  });
	}

	goToMosaic(eventCode){
		this.props.passEventCode(eventCode);
	}

	renderRow(rowData){
				
	   return (
	     <View>
	       <View style={styles.rowContainer}>
	         <Text style={styles.rowText} onPress={this.goToMosaic.bind(this,rowData.eventCode)}> {rowData.name} |  {'#'}{rowData.eventCode} 
	         </Text>
	         
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
	            renderHeader={() => null} 
	            automaticallyAdjustContentInsets={false}/>
	      </View>
	    )
	  }

};

module.exports = UserEventsView;