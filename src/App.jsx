import { useReducer, useEffect } from "react";

// const reducer = (state, action) => ({
//   set_questions: {...state, questions: action.questions},
//   set_currentQuestion: {...state, currentQuestion: action.currentQuestion},
//   set_userScore: { ...state, userScore: action.userScore ? state.userScore + action.userScore : state.userScore},
//   reset_userScore: { ...state, userScore: 0},
//   set_clickedAnswer: {...state, clickedAnswer: action.clickedAnswer },
//   set_countdown: {...state, countdown: action.countdown},
//   set_appStatus: {...state, appStatus: action.appStatus}
// })[action.type] || state

  const reducer = (state, action) => {

    if(action.type === "set_questions") {
      return {...state, questions: action.questions}
    }

    if(action.type === "clicked_next_answer") {
      return {...state, clickedAnswer: null, appStatus: action.isTheLastQuestion ? "finished" : state.appStatus, currentQuestion: action.isTheLastQuestion ? null : state.currentQuestion + 1}
    }

    if(action.type === "clicked_restart") {
      return {...state, currentQuestion: null, userScore: action.userScore ? state.userScore + action.userScore : state.userScore, appStatus: "ready"}
    }

    if(action.type === "clicked_start") {
      return {...state, appStatus: "active", currentQuestion: 0}
    }

    if(action.type === "clicked_answer") {
      return {...state, clickedAnswer: action.clickedAnswer, userScore: action.rightOption === action.clickedAnswer ? state?.questions[state.currentQuestion]?.points : 0}
    }

    return state
  }

const initialState = {questions: [], currentQuestion: null, clickedAnswer: null, userScore: 0, countdown: 50, appStatus: "ready"}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)  
  let rightOption = state?.questions[state?.currentQuestion]?.correctOption 
  let isTheLastQuestion = state?.currentQuestion === state?.questions?.length - 1

  useEffect(() => {
    fetch("http://localhost:5173/src/videogame-questions.json")
      .then(response => response.json())
      .then(data => dispatch({type: "set_questions",  questions: data}))
      .catch(error => alert(error.message))
  },[])

  // useEffect(() => {
    // let idIntervalo
    // if(state.currentQuestion !== null) {
      // const idIntervalo = setInterval(
      //   dispatch({type: "set_countdown", countdown: state?.countdown > 0 ? state.countdown - 1 : 0})
      //   , 10000)      
    // }
  //   return () => clearInterval(idIntervalo)
    
  // }, [state?.countdown])

  // const checkTheAnswer = (answer) => {
  //   answer === rightOption
  // }

  const handleClickAnswer = (answer) => {
    console.log(answer)
    dispatch({type: "clicked_answer", clickedAnswer: answer, rightOption})
    // dispatch({type: "set_clickedAnswer", clickedAnswer: answer})
    // dispatch({type: "set_userScore", userScore: rightOption === answer ? state?.questions[state.currentQuestion]?.points : 0})
    // checkTheAnswer(answer)
  }

  const handleClickNext = () => {
    dispatch({type: "clicked_next_answer", isTheLastQuestion})
    // dispatch({type: "set_clickedAnswer", clickedAnswer: null})
    // dispatch({type: "set_appStatus", appStatus: isTheLastQuestion ? "finished" : state.appStatus})
    // dispatch({type: "set_currentQuestion", currentQuestion: isTheLastQuestion ? null : state.currentQuestion + 1})
  }

  const handleClickRestart = () => {
    dispatch({type: "clicked_restart"})
    // dispatch({type: "set_currentQuestion", currentQuestion: null })
    // dispatch({type: "reset_userScore"})
    // dispatch({type: "set_appStatus", appStatus: "ready"})
  }

  const handleClickStart = () => {
    dispatch({type: "clicked_start"})
    // dispatch({type: "set_appStatus", appStatus: "active"})
    // dispatch({type: "set_currentQuestion", currentQuestion: 0})
  }

  return (
    <div className="app">
      <header className="app-header">
        <img src="/images/logo-quiz-videogames.png" alt="Logo do Quiz dos Videogames" />
        <h1>Quiz dos Videogames</h1>
      </header>
      <div className="main">
        {state.appStatus === "ready" && 
          <div className="start">
            <h2>Bem vindo ao Quiz dos Videogames!</h2>
            <h3>{state.questions?.length} questões para te testar</h3>
            <button className=" btn btn-ui" onClick={handleClickStart}>Bora começar</button>
          </div>
        }
    

        {state.appStatus === "finished" && 
        <>
          <p className="result"><span>😊</span>Você fez {state.userScore} pontos de {(state.questions.length)*10} ({state.userScore/((state.questions.length)*10)*100}%)`</p>
          <button className=" btn btn-ui" onClick={handleClickRestart}>Reiniciar quiz</button>
        </>
        }
        {state.appStatus === "active" && state.questions.length > 0 &&
          <>
            <div>
              <h4>{state?.questions[state.currentQuestion]?.question}</h4>
              <ul className="options" >
                {state?.questions[state?.currentQuestion]?.options.map((option, index) => (
                <li key={index}><button  disabled={state.clickedAnswer !== null} onClick={() => handleClickAnswer(index)} className={`btn btn-option ${state.clickedAnswer!== null && (index === rightOption ? "correct" : "wrong")}  ${state.clickedAnswer === index  && "answer"}`}>{option}</button></li>))}
              </ul>
            </div>
            <div>
              <div className="timer">00:{state.countdown}</div>
              { state.clickedAnswer != null && <button className=" btn btn-ui" onClick={handleClickNext}>{!isTheLastQuestion ? "Próxima" : "Finalizar"}</button>}
            </div>
          </>
        }

      </div>
    </div>
  );
};

export default App;
