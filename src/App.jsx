import { useState } from "react";
import { useEffect } from "react";

const App = () => {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  console.log(questions[currentQuestion])
  
  useEffect(() => {
    fetch("http://localhost:5173/src/videogame-questions.json")
      .then(response => response.json())
      .then(data => setQuestions(data))
  },[])

  

  return (
    <div className="app">
      <div className="main">
        <h4>{questions[currentQuestion]?.question}</h4>
        <ul className="options">
          {questions[currentQuestion]?.options.map((option, index) => (
          <li key={index} className="btn btn-option">{option}</li>))}
        </ul>
      </div>
    </div>
  );
};

export default App;
