import React from 'react';
import Ring from './Ring';

function Wheel(props) {
    return (
        <div className="Wheel" >
            {
                props.rings.map(oneRingData => (
                    <Ring
                        segmentsList={oneRingData.segments}
                        color={oneRingData.color}
                    />
                ))
            }
        </div>
    );
}


export default Wheel;

//in props rings are like:
// [
//     {
//       color: 'red',
//       segments: [
//         { id: 1, topic: 'National Policies' },
//         { id: 2, topic: 'Social-Cultural-Values' },
//       ]
//     },
//     {
//       color: 'blue',
//       segments: [
//         { id: 4, topic: 'Work' },
//         { id: 5, topic: 'Media' },
//         { id: 6, topic: 'Education' },
//       ]
//     },