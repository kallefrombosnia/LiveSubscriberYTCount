import React from 'react';
const NumberFormat = require('react-number-format');

const ChannelInfo = ({subCount,viewCount}) =>{
    return(
        <div>
            <div className="styledDiv"> 
                <NumberFormat value={subCount} displayType={'text'} thousandSeparator={true} />
            </div>
            <div className="viewCount">
                <p>Video view count</p>
                <p className="count">
                <NumberFormat value={viewCount} displayType={'text'} thousandSeparator={true} />
                </p>    
            </div>
            <div className="noteUpdate">updated every 2 seconds</div>  
        </div>
    )
};

export default ChannelInfo;