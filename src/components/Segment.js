import React from 'react';

function Segment(props) {
    return(
        <li className="Segment" >
                <p>{props.title} - {props.description} </p>
        </li>
    ); 
}


export default Segment;


//     segmentsList
//  title: 'a' 