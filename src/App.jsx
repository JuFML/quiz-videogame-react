import { useReducer, useEffect } from "react";

const reducer = (state, action) => ({
  set_questions: {...state, questions: action.questions},
  set_currentQuestion: {...state, currentQuestion: action.currentQuestion},
  set_userScore: { ...state, userScore: action.userScore ? state.userScore + action.userScore : state.userScore},
  reset_userScore: { ...state, userScore: 0},
  set_clickedAnswer: {...state, clickedAnswer: action.clickedAnswer },
  set_shouldShowResult: {...state, shouldShowResult: action.shouldShowResult }
})[action.type] || state

const initialState = {questions: [], currentQuestion: 0, clickedAnswer: null, userScore: 0, shouldShowResult: false}

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
    dispatch({type: "set_clickedAnswer", clickedAnswer: answer})
    dispatch({type: "set_userScore", userScore: rightOption === answer ? state?.questions[state.currentQuestion]?.points : 0})
    // checkTheAnswer(answer)
  }

  const handleNextClick = () => {
    dispatch({type: "set_currentQuestion", currentQuestion: isTheLastQuestion ? null : state.shouldShowResult ? 0 : state.currentQuestion + 1})
    dispatch({type: "set_clickedAnswer", clickedAnswer: null})
    dispatch({type: "set_shouldShowResult", shouldShowResult: isTheLastQuestion})
    state.shouldShowResult && dispatch({type: "reset_userScore"})
  }

  return (
    <div className="app">
      <div className="main">
        {state.shouldShowResult && <p className="result"><span>😊</span>Você fez {state.userScore} pontos de {(state.questions.length)*10} ({state.userScore/((state.questions.length)*10)*100}%)`</p>}
        {state.questions.length > 0 && !state.shouldShowResult &&
        <>
          <div>
            <h4>{state?.questions[state.currentQuestion]?.question}</h4>
            <ul className="options" >
              {state?.questions[state?.currentQuestion]?.options.map((option, index) => (
              <li key={index}><button  disabled={state.clickedAnswer !== null} onClick={() => handleClickAnswer(index)} className={`btn btn-option ${state.clickedAnswer!== null && (index === rightOption ? "correct" : "wrong")}  ${state.clickedAnswer === index  && "answer"}`}>{option}</button></li>))}
            </ul>
          </div>
          </>}
          <div>
            <div className="timer"></div>
            <button className=" btn btn-ui" onClick={handleNextClick}>{state.shouldShowResult ? "Reiniciar quiz" : !isTheLastQuestion ? "Próxima" : "Finalizar"}</button>
          </div>

      </div>
    </div>
  );
};

export default App;
