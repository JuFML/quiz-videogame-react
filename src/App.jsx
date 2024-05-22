import { useReducer, useEffect } from "react";

const reducer = (state, action) => ({
  get_questions: {...state, questions: action.questions},
  set_currentQuestion: {...state, currentQuestion: state.currentQuestion === 4 ? 0 : state.currentQuestion + 1},
  set_btnDisabled: {...state, btnDisabled: !state.btnDisabled},
})[action.type] || state

const App = () => {
  const [state, dispatch] = useReducer(reducer, {questions: [], currentQuestion: 0, btnDisabled: false})
  
  useEffect(() => {
    fetch("http://localhost:5173/src/videogame-questions.json")
      .then(response => response.json())
      .then(data => dispatch({type: "get_questions",  questions: data}))
  },[])

  const handleNextClick = () => {
    dispatch({type: "set_currentQuestion"})
    dispatch({type: "set_btnDisabled"})
  }

  return (
    <div className="app">
      <div className="main">
        <h4>{state?.questions[state.currentQuestion]?.question}</h4>
        <ul className="options">
          {state?.questions[state?.currentQuestion]?.options.map((option, index) => (
          <li key={index} className="btn btn-option" disabled={state.btnDisabled} onClick={() => dispatch({type: "set_btnDisabled"})}>{option} </li>))}
        </ul>
        <div>
          <div className="timer"></div>
          {state.btnDisabled && <div className=" btn btn-ui" onClick={handleNextClick}>Próxima</div>}
        </div>
      </div>
    </div>
  );
};

export default App;
