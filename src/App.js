import React, { useState } from 'react';
// import React from 'react';
import './App.css';

import Wheel from './components/Wheel';
import Ring from './components/Ring';

function App() {
  const [ringData, setRingData] = useState(initialRingData)
  const [currentStyleId, setCurrentStyleId] = useState('defaultStyle')

  return (
    <div className="container">
      <h1>The Critical Thinking Tool</h1>
      < Wheel rings={ringData} />
    </div>
  );
}

const styleSettings = {
  defaultStyle: {
    useBlackAndWhite: false,
    fontSize: 1
  },
  accessible: {
    useBlackAndWhite: true,
    fontSize: 2
  },
  big: {
    useBlackAndWhite: false,
    fontSize: 4
  }
}



const initialRingData = [
  {
    color: 'red',
    segments: [
      { id: 1, topic: 'National Policies' },
      { id: 2, topic: 'Social-Cultural-Values' },
      { id: 3, topic: 'Type of Economy' },
    ]
  },
  {
    color: 'blue',
    segments: [
      { id: 4, topic: 'Work' },
      { id: 5, topic: 'Media' },
      { id: 6, topic: 'Education' },
      { id: 7, topic: 'Housing' },
      { id: 8, topic: 'Economic Status' },
      { id: 9, topic: 'Health & Social Care' },
      { id: 10, topic: 'Technology' },
      { id: 11, topic: 'Leisure' }
    ]
  },
  {
    color: 'green',
    segments: [
      { id: 12, topic: 'Local Environments' },
      { id: 13, topic: 'Support Networks' },
      { id: 14, topic: 'Daily Living Activities' },
    ]
  },
  {
    color: 'orange',
    segments: [
      { id: 15, topic: 'The Body' },
      { id: 16, topic: 'Indentity' }
    ]
  },
  {
    color: 'purple',
    segments: [
      { id: 17, topic: 'Participation' },
    ]
  }
];



// function App() {
//   return (
//     // <div className='Wheel'>

//     //   <div className = "Ring1">
//     //     <div className='Segment1'> National Policies </div>
//     //     <div className='Segment2'> Social Cultural Values </div>
//     //     <div className='Segment3'> Type of Economy </div>
//     //   </div>

//     //   {/* <div classname = "Ring2"> */}
//     //     <div className='Segment4'> Work </div>
//     //     <div className='Segment5'> Media </div>
//     //     <div className='Segment6'> Education </div>
//     //     <div className='Segment7'> Housing </div>
//     //     <div className='Segment8'> Economic Status </div>
//     //     <div className='Segment9'> Health & Social Care </div>
//     //     <div className='Segment10'> Technology </div>
//     //     <div className='Segment11'> Leisure </div>
//     //   {/* </div> */}

//     //   {/* <div className='Ring3'> */}
//     //     <div className='Segment12'> Local Environment </div>
//     //     <div className='Segment13'> Support Networks </div>
//     //     <div className='Segment14'> Daily Living Activities </div>
//     //   {/* </div> */}

//     //   {/* <div className='Ring4'> */}
//     //     <div className='Segment15'> The Body </div>
//     //     <div className='Segment16'> Indentity </div>
//     //   {/* </div>  */}

//     //   {/* <div className='Ring5'> */}
//     //     <div className='Segment17'> Participation </div> 
//     //   {/* </div> */}

//     // </div>
//   );
// }

export default App;
