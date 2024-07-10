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

export { Progress }