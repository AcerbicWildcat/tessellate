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
  	fontSize:22,
  	fontWeight:'700',
  	padding:12,
  	color:'#FFFFFF',
  },
  rowContainer: {
  	flex:1,
  	flexDirection:'row',
    padding: 20,
    backgroundColor:'#FFFFFF',
  }, 
  rowText: {
  	fontSize:17,
  	fontWeight:'500',
  },

  eventThumbnail: {
  	position:'relative',
  	height:35,
  	width:35,
  
  	
  }
});


class UserEventsView extends React.Component {
	
	constructor(props){
	   super(props);
	   this.sectionIDs = ['Created Events', 'Joined Events'];
	   this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,
	   sectionHeaderHasChanged: (s1, s2) => s1 !== s2})
	   this.state = {
	     dataSource: this.ds.cloneWithRowsAndSections({'Events':[{name:'You don\'t have any events yet...'}]}),
	     dataBlob:{}
	   }
	 }

	 componentDidMount() {
	 	//console.log('Events View Mounted!')
	       //this.fetchUserEvents();
	 }

	



	fetchUserEvents(){
		//console.log('fetching events')
		//construct GET request
		var self = this;
		var getEvents = {  
		  method: 'GET',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		    'Origin': '',
		    //'Host': 'http://10.6.1.173:8081',
		    'facebookid':this.props.facebookId,
		  }
		}
		this.props.spin();
		//make Fetch Call
		fetch('http://tessellate-penguin.herokuapp.com/events', getEvents)  
		  .then(function(res) {
		  	//console.log('listviewres:  ', res)
		  	if (!res){
		  		throw new Error('We could not find that event!')
		  	}
		    return res.json();
		   })
		  .then(function(resJson) {
		  	var userID = resJson._id;
		  	var data = resJson.events;
		  	var createdEvents = [];
		  	var joinedEvents = [];

		  	for (var i = 0 ; i< data.length; i++){

		  		if (userID === data[i]._creator.toString()){
		  			createdEvents.push(data[i]);
		  		} else {
		  			joinedEvents.push(data[i]);
		  		}
		  	}

		  	if (!createdEvents.length){
		  		createdEvents.push({name:'No created events...'})
		  	}

		  	if (!joinedEvents.length){
		  		joinedEvents.push({name:'No joined events...'})
		  	}	

		  	self.props.stopSpin();

  			var tempDataBlob = self.state.dataBlob;
  			tempDataBlob[self.sectionIDs[0]]=createdEvents;
  			tempDataBlob[self.sectionIDs[1]]=joinedEvents;

  			self.setState({
  	              dataSource: self.ds.cloneWithRowsAndSections(tempDataBlob)
  	        },function(){
  	        	
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
		//console.log('clicked event code: ' + eventCode)
		this.props.passEventCode(eventCode);
	}

	renderRow(rowData){
		var imageThumbnail = '';
		if (rowData.mainImage){
			imageThumbnail = encodeURI(rowData.mainImage.imgPath);
		}
	   return (
	     <View>
	       <View style={styles.rowContainer}>
	 		 <Image style={styles.eventThumbnail} source={{uri:imageThumbnail||null}}/>
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