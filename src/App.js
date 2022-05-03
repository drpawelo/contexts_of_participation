import React, { useState, useEffect } from 'react';
// import React from 'react';
import './App.css';
import xmlFileWheelContent from './data/wheel_contents.xml';

import Wheel from './components/Wheel';
import Ring from './components/Ring';

function App() {
  const [ringData, setRingData] = useState([])
  const [currentStyleId, setCurrentStyleId] = useState('defaultStyle')

  useEffect(() => {
    console.log(getWheelDataFromFile());
  }, []);

  const getWheelDataFromFile = () => {
    var xml2js = require('xml2js');
    let parser = new xml2js.Parser();
    let parsedText = ""

    fetch(xmlFileWheelContent)
      .then(readData => readData.text())
      .then(textFromFile => {
        parser.parseString(textFromFile, function (err, parsedJson) {
          parsedText = parsedJson;
        });
      }).then(() => {
        setRingData(parsedText.wheels.wheel);
      });
  }

  let changeStyleToNext = () => { 
    setCurrentStyleId('accessible');
  };
  return (
    <div className="container">
      <button onClick={changeStyleToNext}>ChangeStyle</button>
      <h1>The Critical Thinking Tool</h1>
      < Wheel rings={ringData} style={styleSettings[currentStyleId]} />
    </div>
  );

}




const styleSettings = {
  defaultStyle: {
    colors: ['red', 'blue', 'orange', 'red', 'blue', 'orange', 'red', 'blue', 'orange'],
    fontSize: 1
  },
  accessible: {
    colors: ['red', 'black', 'red', 'black','red', 'black','red', 'black','red', 'black'],
    fontSize: 2
  }
}

export default App;
