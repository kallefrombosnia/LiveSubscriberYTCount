import React, { Component } from 'react';
import './App.css';
const NumberFormat = require('react-number-format');

const API_KEY = '';
const youtubeSearch = require('youtube-api-v3-search');

const channelList = [
  "Mudja",
  "Mumbo Jumbo",
  "Ćale",
  "PewDiePie"
];
class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      channelId: this.checkId(),
      channelName: null,
      channelThumb: null,
      subscriberCount: 0,
      oldSubscriberCount: 0,
      viewCount: 0,
      term: this.checkName(),
      error: "false"
    }; 

    const options = {
      q: this.state.term,
      part:'snippet',
      type:'channel'
    };

    if(this.state.channelId === null){

      youtubeSearch(API_KEY,options, (error, value) => {  

          if(value.items.length !== 0){

            if(value.items[0].snippet.title===this.state.term){

              this.setState({
                channelId: value.items[0].snippet.channelId,
                channelName: value.items[0].snippet.title,
                channelThumb: value.items[0].snippet.thumbnails.default.url
              }); 

            }
          }

          if(error){
            return <div>Error!</div>
          }

        });
      }  

  }

  checkName = () =>{
    const url = window.location.pathname;
    if(url !== "/"){
      let newChannel = url.substring(url.lastIndexOf('/')+1);
      newChannel = decodeURI(newChannel);
      return newChannel;  
    }
    const randomChannel = channelList[Math.floor(Math.random()*channelList.length)];
    return randomChannel;
  }

  checkId = () => {
    const url = window.location.pathname;
    if(url !== "/"){
      let newChannel = url.substring(url.lastIndexOf('/')+1);
      if(newChannel.length === 24){
        return newChannel;
      }
    }
    return (null); 
  }

  async componentDidMount() {
    if(this.state.channelId !== "null"){
      try {
        setInterval(async () => {
          const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=statistics&id='+this.state.channelId+'&key='+API_KEY+'');
          const imgreq = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&id='+this.state.channelId+'&key='+API_KEY+'');
          const blocks = await res.json();
          const img = await imgreq.json();
        
          if(blocks.items.length !== 0 || img.items.length !== 0){
            this.setState({
              subscriberCount:  blocks.items[0].statistics.subscriberCount,
              viewCount:  blocks.items[0].statistics.viewCount,
              channelName: img.items[0].snippet.title,
              channelThumb: img.items[0].snippet.thumbnails.default.url
            });
          }else{
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

  updateInputValue(evt) {
    this.setState({
      tempSearch: evt.target.value
    });
  }

  render() {
    let error;
    if(this.state.error !== "false"){  
      error = 
      <div className="alert">
        <strong>Attention!</strong> Channel not found.
      </div>;
    }
    let input;
    if(this.state.channelId !== null){
      input = 
              <div>
                  <div style={{display: 'flex', justifyContent: 'center'}} className="input">
                    <form action={document.location.origin+'/channel/'+this.state.tempSearch}>
                      <div>
                        <input required="required" onChange={evt => this.updateInputValue(evt)} placeholder={'Channel name or id'} className="styledInput" />
                        <button className="button" type="submit">Find</button>
                      </div>
                    </form>
                  </div>
                  <form style={{display: 'flex', justifyContent: 'center'}} className="subscribeForm" target="_blank" action={'https://www.youtube.com/channel/'+ this.state.channelId}>
                    <input style={{opacity: 89.5, display: 'block'}} className="subscribeButton" type="submit" value="Subscribe!" />
                    <input type="hidden" name="sub_confirmation" value="1" />
                  </form>
                
                <div className="channelName">
                  <div className="channelThumb">
                    <img src={this.state.channelThumb} alt="thumbnail" />
                  </div>
                  {this.state.channelName}
                </div>
              </div>
    }else{
      input = 
      <div style={{display: 'flex', justifyContent: 'center'}} className="input">
        <form action={document.location.origin+'/channel/'+this.state.tempSearch}>
          <div>
            <input required="required" onChange={evt => this.updateInputValue(evt)} placeholder={'Channel name or id'} className="styledInput" />
            <button className="button" type="submit">Find</button>
          </div>
        </form>
      </div>
    }

    return (
      <div className="App">
          <h1>Real - Time YouTube Subscriber Count</h1>
          <h2>by <a href={'https://github.com/kallefrombosnia'}>@kallefrombosnia</a></h2>
          {error}
          {input}
          <div className="styledDiv"> 
            <NumberFormat value={this.state.subscriberCount} displayType={'text'} thousandSeparator={true} />
          </div>
          <div className="viewCount">
            <p>Video view count</p>
            <p className="count">
              <NumberFormat value={this.state.viewCount} displayType={'text'} thousandSeparator={true} />
            </p>    
          </div>
          <div className="noteUpdate">updated every 2 seconds</div>         
          <footer className=""></footer>
      </div>
    );
  }
}

export default App;
