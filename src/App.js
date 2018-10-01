import React, { Component } from 'react';
import './App.css';

import ChannelAdds from './components/channel';
import ChannelInfo from './components/channelInfo';
import Input from './components/input';
import Footer from './components/footer';
import Header from './components/header';

//const NumberFormat = require('react-number-format');
const youtubeSearch = require('youtube-api-v3-search');

// Configuration
const API_KEY = '';
const channelList = [
  "Mudja",
  "Mumbo Jumbo",
  "Ćale",
  "PewDiePie"
];

// Our component
class App extends Component {
  constructor(props){
    super(props);

    // Set default component state
    this.state = {
      channelId: this.getIdFromUrl(),
      channelName: null,
      channelThumb: null,
      subscriberCount: 0,
      oldSubscriberCount: 0,
      viewCount: 0,
      term: this.getTermFromUrl(),
      error: "false"
    }; 

    // Configuration for search package
    const options = {
      q: this.state.term,
      part:'snippet',
      type:'channel'
    };

    // Search YT for term given
    this.searchYT(API_KEY,options);
  }

  searchYT = (API_KEY,options) =>{
    // Checking if url contains name or id of youtube channel
    // If state is set to id, function will not search for name on Youtube
    if(this.state.channelId === null){
      // Do search 
      youtubeSearch(API_KEY,options, (error, value) => {  
        // Prevent from errors if no channel is found. 
        if(value.items.length !== 0){
          // Double check if name from API is equal to our search term
          if(value.items[0].snippet.title===this.state.term){
            // If its ok put data from API to our app state
            this.setState({
              channelId: value.items[0].snippet.channelId,
              channelName: value.items[0].snippet.title,
              channelThumb: value.items[0].snippet.thumbnails.default.url
            }); 
          }
        }
        // If error happens, it will return error div. This will probably never happen.
        if(error){
          console.log(error);
          return <div>Error!</div>
        }
      });
    }  
  }

  // Check if its default path / or channel path for share. (/channel/name)
  getTermFromUrl = () =>{
    // Get working url
    const url = window.location.pathname;
    // Check if url is home location
    if(url !== "/"){
      return this.returnNewChannel(url);
    }
    // Our channel list
    return this.returnRandomChannel();
  }

  // Check if its default path / or channel path for share. (/channel/id)
  getIdFromUrl = () => {
    // Get working url
    const url = window.location.pathname;
    // Check if url is home location
    if(url !== "/"){ 
      return this.returnId(url);
    }
    // If it is not id, return null
    return (null); 
  }

  returnNewChannel = (url) =>{
    // Js magic
    let newChannel = url.substring(url.lastIndexOf('/')+1);
    // Url decode for non standard characters
    newChannel = decodeURI(newChannel);
    return newChannel; 
  }

  returnRandomChannel = () =>{
   // Our channel list
   const randomChannel = channelList[Math.floor(Math.random()*channelList.length)];
   // Return one channel which is random taken
   return randomChannel;
  }

  returnId = (url) =>{
    let newChannel = url.substring(url.lastIndexOf('/')+1);
    // Stupid way to check this, but I didnt had time make this check more accurate
    // Basic check if this is youtube id, rather than name 
    if(newChannel.length === 24){
      // If it matches, return youtube id and skip name search
      return newChannel;
    }
    // No match, return null
    return (null); 
  }

  // Waiting for state updates
  async componentDidMount() {
    // When state is set let it fetch data for given channel id
    if(this.state.channelId !== "null"){
      try {
        // We are calling fetch function every 2 seconds
        setInterval(async () => {
          // Statisctic info get
          const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=statistics&id='+this.state.channelId+'&key='+API_KEY+'');
          // This one is just for img, because statistic part doesnt return img -.-'
          const imgreq = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&id='+this.state.channelId+'&key='+API_KEY+'');
          const blocks = await res.json();
          const img = await imgreq.json();
          // Check if data actualy is given to us
          if(blocks.items.length !== 0 || img.items.length !== 0){
            // Data good, set new states with info from API
            this.setState({
              subscriberCount:  blocks.items[0].statistics.subscriberCount,
              viewCount:  blocks.items[0].statistics.viewCount,
              channelName: img.items[0].snippet.title,
              channelThumb: img.items[0].snippet.thumbnails.default.url
            });
          }else{
            // Channel not found, set error state to true
            this.setState({
              error: "true"
            });
          }
        }, 2000);
      } catch(e) {
        console.log(e);
      }
    }
  }

  // Search state update on value change (onChange)
  updateInputValue(evt) {
    this.setState({
      tempSearch: evt
    });
  }
  // Render method
  render() {
    // Checking if error is set to true, if yes render error, if not do nothing just continue to data display
    let error;
    if(this.state.error !== "false"){  
      error = 
      <div className="alert">
        <strong>Attention!</strong> Channel not found.
      </div>;
    }

    /*
      Input part
    */
    let input;
    if(this.state.channelId !== null){
      input = <ChannelAdds onSearchTermChange={term => this.updateInputValue(term)} id={this.state.channelId} thumb={this.state.channelThumb} name={this.state.channelName} />
    }else{
      input = <Input onSearchTermChange={term => this.updateInputValue(term)}/>
    }
    
    // Yeah render this fudge
    return (
      <div className="App">
          <Header />
          {error}
          {input}
          <ChannelInfo subCount={this.state.subscriberCount} viewCount={this.state.viewCount} />     
          <Footer />
      </div>
    );
  }
}

export default App;
