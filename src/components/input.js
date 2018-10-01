import React,{Component} from 'react';

class Input extends Component{
    constructor(props){
        super(props);

        this.state = {term: ''}
    }

    updateInputValue(term){
        this.setState(
            {term}
        );
        this.props.onSearchTermChange(term);
    }

    render(){
        return(
            <div style={{display: 'flex', justifyContent: 'center'}} className="input">
                <form action={document.location.origin+'/channel/'+this.state.term}>
                    <div>
                    <input required="required" onChange={evt => this.updateInputValue(evt.target.value)} placeholder={'Channel name or id'} className="styledInput" />
                    <button className="button" type="submit">Find</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Input;