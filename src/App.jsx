import { useReducer, useEffect } from "react";
import { Header } from "@/components/Header";
import { Timer } from "@/components/Timer";
import { Start } from "@/components/Start";
import { Result } from "@/components/Result";
import { ButtonNext } from "@/components/ButtonNext";
import { Progress } from "@/components/Progress";
import { Questions } from "@/components/Questions";
import { secondsPerQuestion } from "@/utils/secondsPerQuestion";

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
