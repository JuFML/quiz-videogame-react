import { getResultMessage } from "../utils/get_result_message"

const Result = ({state, onClickRestart, maxScore}) => {
  
  return (
    <>
      <p className="result">{getResultMessage({score: state.userScore, maxScore })}</p>
      <button className=" btn btn-ui" onClick={onClickRestart}>Reiniciar quiz</button>
    </>
  )
}

export { Result }