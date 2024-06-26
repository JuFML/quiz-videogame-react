import { useReducer, useEffect } from "react";

const secondsPerQuestion = 30

  const reducer = (state, action) => {

    if(action.type === "set_questions") {
      return {
        ...state, 
        questions: action.questions
      }
    }

    if(action.type === "clicked_next_answer") {
      return {
        ...state, 
        clickedAnswer: null, 
        appStatus: action.isTheLastQuestion ? "finished" : state.appStatus, 
        currentQuestion: action.isTheLastQuestion ? null : state.currentQuestion + 1, 
        seconds: action.isTheLastQuestion ? null : state.seconds
      }
    }

    if(action.type === "clicked_restart") {
      return {
        ...state, 
        currentQuestion: null, 
        userScore: action.userScore ? state.userScore + action.userScore : state.userScore, 
        appStatus: "ready"
      }
    }

    if(action.type === "clicked_start") {
      return {
        ...state, 
        appStatus: "active", 
        currentQuestion: 0, 
        seconds: secondsPerQuestion * state.questions.length
      }
    }

    if(action.type === "clicked_answer") {
      return {
        ...state, 
        clickedAnswer: action.clickedAnswer, 
        userScore: action.rightOption === action.clickedAnswer ? state?.questions[state.currentQuestion]?.points : 0
      }
    }

    if(action.type === "tick") {
      return {
        ...state, 
        seconds: state.seconds === 0 ? null : state.seconds - 1,
        appStatus: state.seconds === 0 ? "finished" : state.appStatus
      }
    }

    return state
  }

const initialState = {questions: [], currentQuestion: null, clickedAnswer: null, userScore: 0, countdown: 50, appStatus: "ready", seconds: null}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)  
  let rightOption = state?.questions[state?.currentQuestion]?.correctOption 
  let isTheLastQuestion = state?.currentQuestion === state?.questions?.length - 1
  const minutes = Math.floor(state.seconds/60)
  const seconds = state.seconds % 60

  useEffect(() => {
    fetch("http://localhost:5173/src/videogame-questions.json")
      .then(response => response.json())
      .then(data => dispatch({type: "set_questions",  questions: data}))
      .catch(error => alert(error.message))
  },[])

  useEffect(() => {
    if(state.seconds === null) {
      return
    }

    const id = setTimeout(() => dispatch({type: "tick"}), 1000)
    return () => clearTimeout(id)
  }, [state.seconds])

  const handleClickAnswer = (answer) => {
    console.log(answer)
    dispatch({type: "clicked_answer", clickedAnswer: answer, rightOption})
  }

  const handleClickNext = () => {
    dispatch({type: "clicked_next_answer", isTheLastQuestion})
  }

  const handleClickRestart = () => {
    dispatch({type: "clicked_restart"})
  }

  const handleClickStart = () => {
    dispatch({type: "clicked_start"})
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
              <div className="timer">{minutes < 10 ? `0${minutes}`: minutes}:{seconds < 10 ? `0${seconds}`: seconds}</div>
              { state.clickedAnswer != null && <button className=" btn btn-ui" onClick={handleClickNext}>{!isTheLastQuestion ? "Próxima" : "Finalizar"}</button>}
            </div>
          </>
        }

      </div>
    </div>
  );
};

export default App;
