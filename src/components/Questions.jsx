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

export { Questions }