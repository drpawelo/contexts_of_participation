import React from 'react';
import Ring from './Ring';

function Wheel(props) {
    console.log('props');
    console.log(props.style);
    return (
        <div className="Wheel" >
            {
                props.rings.map((oneRingData, index) => (
                    <Ring
                        segmentsList={oneRingData.item}
                        color={props.style.colors[index]}
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