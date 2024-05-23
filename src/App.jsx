import { useReducer, useEffect } from "react";

const reducer = (state, action) => ({
  set_questions: {...state, questions: action.questions},
  set_currentQuestion: {...state, currentQuestion: state.currentQuestion === 4 ? 0 : state.currentQuestion + 1},
  set_btnDisabled: {...state, btnDisabled: action.btnDisabled},
  set_clickedAnswer: {...state, clickedAnswer: action.clickedAnswer}
})[action.type] || state

const App = () => {
  const [state, dispatch] = useReducer(reducer, {questions: [], currentQuestion: 0, btnDisabled: false, clickedAnswer: null})
  console.log(state.questions)
  let rightOption = state?.questions[state.currentQuestion]?.correctOption 

  useEffect(() => {
    fetch("http://localhost:5173/src/videogame-questions.json")
      .then(response => response.json())
      .then(data => dispatch({type: "set_questions",  questions: data}))
      .catch(error => alert(error.message))
  },[])

  // const checkTheAnswer = (answer) => {
  //   answer === rightOption
  // }

  const handleClickAnswer = (answer) => {
    dispatch({type: "set_btnDisabled", btnDisabled: true})
    dispatch({type: "set_clickedAnswer", clickedAnswer: answer})
    // checkTheAnswer(answer)
  }

  const handleNextClick = () => {
    dispatch({type: "set_currentQuestion"})
    dispatch({type: "set_btnDisabled", btnDisabled: false})
    dispatch({type: "set_clickedAnswer", clickedAnswer: null})
  }

  return (
    <div className="app">
      <div className="main">
        <div>
          <h4>{state?.questions[state.currentQuestion]?.question}</h4>
          <ul className="options" >
            {state?.questions[state?.currentQuestion]?.options.map((option, index) => (
            <li key={index}><button  disabled={state.btnDisabled} onClick={() => handleClickAnswer(index)} className={`btn btn-option ${state.btnDisabled && (index === rightOption ? "correct" : "wrong")}  ${state.clickedAnswer === index  && "answer"}`}>{option}</button></li>))}
          </ul>
        </div>
        <div>
          <div className="timer"></div>
          {state.btnDisabled && <div className=" btn btn-ui" onClick={handleNextClick}>Próxima</div>}
        </div>
      </div>
    </div>
  );
};

export default App;
