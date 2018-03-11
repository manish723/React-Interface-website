var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');

var AptList = require('./AptList');
var AddAppointment = require('./AddAppointment');
var SearchAppointments = require('./SearchAppointments');

var MainInterface = React.createClass({
  getInitialState: function() {
    return {
      myAppointments: [],
      isVisible:false,
      property:"petName",
      order:'asc',
      text:''
    } //return
  }, //getInitialState

  componentDidMount: function() {
    this.serverRequest = $.get('./js/data.json', function(result) {
      var tempApts = result;
      this.setState({
        myAppointments: tempApts
      }); //setState
    }.bind(this));
  }, //componentDidMount

  componentWillUnmount: function() {
    this.serverRequest.abort();
  }, //componentWillUnmount

  deleteMessage: function(item) {
    var allApts = this.state.myAppointments;
    var newApts = _.without(allApts, item);
    this.setState({
      myAppointments: newApts
    }); //setState
  }, //deleteMessage

toggledisp:function(){
    var k=this.state.isVisible;
if(k==false){
  k=true;
}else k=false;

this.setState({
  isVisible:k
})
  },

  additem:function(item){
   var k=this.state.myAppointments;
   k.push(item);
   this.setState({
     myAppointments:k
   })
  },


sort:function(prop){
var k=this.state.myAppointments;
var p=this.state.order;//so making a local var here is not a choice
k=_.orderBy(k,function(item){
  return item[prop]//here this.state.property is not accessible, as it is outside function, so we took a var above and stored it
},p)
this.setState({
  property:prop,//we ar setting property here as we changed the value, so that it is stored for the fture use for resort fn
  myAppointments:k
})
},

resort:function(ord){
  var k=this.state.myAppointments;
  var m=this.state.property;
  k=_.orderBy(k,function(item){
    return item[m]
  },ord)
  this.setState({
    order:ord,
    myAppointments:k
  })
  },

  searchapp:function(val){
    this.setState({
  text:val
    })
  },

  render: function() {
   var filteredApts=[];
   var text=this.state.text;
   var filteredApts1=this.state.myAppointments;
   filteredApts1.forEach(item => {    //IMP, YOU COULD HAVE APPLIED THIS FOREACH FUNCTION in the 
    //ABOVE SEARCHAPP HANDLE BUT YOU CANT BECAUSE IN THAT CASE YOU WOULD BE CHANGING THE STATE OF APPOINTMENT ARRAY 
    //WHICH WILL NOT ALLOW YOU TO DISPLAY THE RESULTS WHEN YOU DO BACKSPACE, EX WHEN YOU SEARCH SPOT AND THEN YOUBACKSPACE SPOT AND EMPTIED THE TEXTBOX
    //YOU SHOLD GET ALL 4 VALUES AVAILABLE BUT IN CASE IF YOU CHANGE OF STATE OF ARRAY YOU NWILL NOT GET ALL 4 VALUES
    //note that is a bracket not braces {}//there is not special about it is usual but you made fucking mistake
      if((item.petName.toLowerCase().indexOf(text.toLowerCase())!=-1) ||  //this is checking if it consists the search val or not if yes when index!=-1 then it will display that value
      (item.ownerName.toLowerCase().indexOf(text.toLowerCase())!=-1) ||
      (item.aptDate.toLowerCase().indexOf(text.toLowerCase())!=-1) ||
      (item.aptNotes.toLowerCase().indexOf(text.toLowerCase())!=-1))
    {
      filteredApts.push(item);
    }
  });

    var filteredApts = filteredApts.map(function(item) {
      return(
        <AptList 
          singleItem = { item }
          onDelete = { this.deleteMessage } />
      ) //return
    }.bind(this)); //filteredApts.map
    return (<div>
        <AddAppointment isVisible={this.state.isVisible}
        toggle={this.toggledisp}
        add={this.additem}/>
        <SearchAppointments sortprop={this.sort}
        resort={this.resort}
        orderBy={this.state.property}
        orderDir={this.state.order}
        search={this.searchapp}
       />
        <ul className="item-list media-list">{filteredApts}</ul>
      </div>
    ) //return
  } //render
}); //MainInterface

ReactDOM.render(
  <MainInterface />,
  document.getElementById('petAppointments')
); //render
