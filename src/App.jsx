import { useReducer, useEffect } from "react";

const reducer = (state, action) => ({
  set_questions: {...state, questions: action.questions},
  set_currentQuestion: {...state, currentQuestion: state.currentQuestion === 4 ? 0 : state.currentQuestion + 1},
  set_clickedAnswer: {...state, clickedAnswer: action.clickedAnswer, userScore: action.userScore ? state.userScore + action.userScore : state.userScore}
})[action.type] || state

const initialState = {questions: [], currentQuestion: 0, clickedAnswer: null, userScore: 0}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)  
  let rightOption = state?.questions[state.currentQuestion]?.correctOption 
  let isTheLastQuestion = state.currentQuestion === state.questions.length - 1

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
    dispatch({type: "set_clickedAnswer", clickedAnswer: answer, userScore: rightOption === answer ? 10 : 0})
    // checkTheAnswer(answer)
  }

  const handleNextClick = () => {
    dispatch({type: "set_currentQuestion"})
    dispatch({type: "set_clickedAnswer", clickedAnswer: null})
  }

  return (
    <div className="app">
      <div className="main">
        {state.questions.length > 0 &&
        <>
          <div>
            <h4>{state?.questions[state.currentQuestion]?.question}</h4>
            <ul className="options" >
              {state?.questions[state?.currentQuestion]?.options.map((option, index) => (
              <li key={index}><button  disabled={state.clickedAnswer !== null} onClick={() => handleClickAnswer(index)} className={`btn btn-option ${state.clickedAnswer!== null && (index === rightOption ? "correct" : "wrong")}  ${state.clickedAnswer === index  && "answer"}`}>{option}</button></li>))}
            </ul>
          </div>
          <div>
            <div className="timer"></div>
            {state.clickedAnswer !== null && <button className=" btn btn-ui" onClick={handleNextClick}>{!isTheLastQuestion ? "Próxima" : "Finalizar"}</button>}
          </div>
        </>}
      </div>
    </div>
  );
};

export default App;
