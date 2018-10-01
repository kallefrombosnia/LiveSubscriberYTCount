import React, {Component} from 'react';

class ChannelAdds extends Component{
    constructor(props){
        super(props);
        this.state = {
          term: ''
        }
    }

    onInputChange(term){
      this.setState({term});
      this.props.onSearchTermChange(term);
    }
    
    render(){
        return(
            <div>
              <div style={{display: 'flex', justifyContent: 'center'}} className="input">
                <form action={document.location.origin+'/channel/'+this.state.term}>
                  <div>
                    <input required="required" onChange={term => this.onInputChange(term.target.value)} placeholder={'Channel name or id'} className="styledInput" />
                    <button className="button" type="submit">Find</button>
                  </div>
                </form>
              </div>
              <form style={{display: 'flex', justifyContent: 'center'}} className="subscribeForm" target="_blank" action={'https://www.youtube.com/channel/'+ this.props.id}>
                <input style={{opacity: 89.5, display: 'block'}} className="subscribeButton" type="submit" value="Subscribe!" />
                <input type="hidden" name="sub_confirmation" value="1" />
              </form>
              <div className="channelName">
                <div className="channelThumb">
                  <img src={this.props.thumb} alt="thumbnail" />
                </div>
                {this.props.name}
              </div>
            </div>
        )
    };
}

export default ChannelAdds;