import { useReducer, useEffect, useState } from "react";

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
      userScore: 0, 
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
      userScore: action.rightOption === action.clickedAnswer ? state.userScore + state?.questions[state.currentQuestion]?.points : state.userScore + 0
    }
  }

  if(action.type === "game_over") {
    return {...state, appStatus: "finished"}
  }

  return state
}

const initialState = {questions: [], currentQuestion: null, clickedAnswer: null, userScore: 0, countdown: 50, appStatus: "ready"}

const secondsPerQuestion = 30

const Timer = ({appState, onHandleTimer}) => {
  const [seconds, setSeconds] = useState(secondsPerQuestion * appState.questions.length)

  useEffect(() =>{

    if(seconds === 0) {
      onHandleTimer({message:"game_over"})
      return
    }

    const id = setTimeout(() => setSeconds(prev => prev -1), 1000)
    return () => clearTimeout(id)

  }, [seconds, onHandleTimer])
  const mins = Math.floor(seconds/60)
  const secs = seconds % 60

  return (
    <>
      <div className="timer">{mins < 10 ? `0${mins}`: mins}:{secs < 10 ? `0${secs}`: secs}</div>
    </>
  )
}

const Header = () => {
  return (    
    <header className="app-header">
      <img src="/images/logo-quiz-videogames.png" alt="Logo do Quiz dos Videogames" />
      <h1>Quiz dos Videogames</h1>
    </header>
  )
}

const Start = ({state, onClickStart}) => {

  return (
    <div className="start">
      <h2>Bem vindo ao Quiz dos Videogames!</h2>
      <h3>{state.questions?.length} questões para te testar</h3>
      <button className=" btn btn-ui" onClick={onClickStart}>Bora começar</button>
    </div>
  )
}

const Result = ({state, onClickRestart, maxScore}) => {
  const percentage = state.userScore / maxScore * 100
  return (
    <>
      <p className="result"><span>😊</span>Você fez {state.userScore} pontos de {maxScore} ({percentage}%)</p>
      <button className=" btn btn-ui" onClick={onClickRestart}>Reiniciar quiz</button>
    </>
  )
}

const ButtonNext = ({onClickNext, isTheLastQuestion}) => {
  return (
    <button className=" btn btn-ui" onClick={onClickNext}>{!isTheLastQuestion ? "Próxima" : "Finalizar"}</button>
  )
}

const Progress = ({state, maxScore}) => {
  const userHasAnswered = state.clickedAnswer !== null
  const progressValue = userHasAnswered ? state.currentQuestion + 1 : state.currentQuestion

  return (
    <header className="progress">
      <label>
        <progress max={state.questions.length} value={progressValue}>{progressValue}</progress>
        <span>Questao <b>{state.currentQuestion + 1}</b> / {state.questions.length}</span>
        <span><b>{state.userScore}</b> / {maxScore}</span>
      </label>
    </header>
  )
}

const Questions = ({state, onClickAnswer, rightOption}) => {

  return (
    <div>
      <h4>{state?.questions[state.currentQuestion]?.question}</h4>
      <ul className="options" >
        {state?.questions[state?.currentQuestion]?.options.map((option, index) => (
        <li key={index}><button  disabled={state.clickedAnswer !== null} onClick={() => onClickAnswer(index)} className={`btn btn-option ${state.clickedAnswer!== null && (index === rightOption ? "correct" : "wrong")}  ${state.clickedAnswer === index  && "answer"}`}>{option}</button></li>))}
      </ul>
    </div>
  )
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)  
  const rightOption = state?.questions[state?.currentQuestion]?.correctOption 
  const isTheLastQuestion = state?.currentQuestion === state?.questions?.length - 1
  const maxScore = state.questions.reduce((acc, question) => acc + question.points, 0)
  


  useEffect(() => {
    fetch("http://localhost:5173/src/videogame-questions.json")
      .then(response => response.json())
      .then(data => dispatch({type: "set_questions",  questions: data}))
      .catch(error => alert(error.message))
  },[])

  useEffect(() => {
    let id

    const run = () => {
      if(state.seconds === null) {
        return
      }

      id = setTimeout(() => dispatch({type: "tick"}), 1000)
    }

    run()
    return () => clearTimeout(id)
  }, [state.seconds])

  const handleClickAnswer = (answer) =>dispatch({type: "clicked_answer", clickedAnswer: answer, rightOption})
  const handleClickNext = () => dispatch({type: "clicked_next_answer", isTheLastQuestion})
  const handleClickRestart = () => dispatch({type: "clicked_restart"})
  const handleClickStart = () => dispatch({type: "clicked_start"})
  const handleTimer = ({message}) => dispatch({type: message})

  return (
    <div className="app">
      <Header />
      <div className="main">
        {state.appStatus === "ready" && <Start state={state} onClickStart={handleClickStart}/>}
        {state.appStatus === "finished" && <Result state={state} onClickRestart={handleClickRestart} maxScore={maxScore}/>        }
        {state.appStatus === "active" && state.questions.length > 0 &&
          <>
            <Progress state={state} maxScore={maxScore} />
            <Questions state={state} onClickAnswer={handleClickAnswer} rightOption={rightOption}/>
            <div>
              <Timer appState={state} onHandleTimer={handleTimer}  />
              { state.clickedAnswer != null && <ButtonNext onClickNext={handleClickNext} isTheLastQuestion={isTheLastQuestion}/>}
            </div>
          </>
        }

      </div>
    </div>
  );
};

export default App;
