import React from 'react';
import Segment from './Segment';

function Ring(props) {
    return(
        <div>
            <p>{"ring"}</p>
            <ul className="Ring" style={{color: props.color}} >
                {
                     props.segmentsList.map(oneSegment => (
                        <Segment title = {oneSegment['$']["name"]}
                        description={oneSegment['_']} />
                     ))
                }
        </ul>
        </div>
       
    ); 
}
export default Ring;

//  in props segmentsList are like:   
// [
//          { id: 1, topic: 'National Policies' },
//          { id: 2, topic: 'Social-Cultural-Values' },
//     ]
//  
//  in props color are like:   
// 'blue'