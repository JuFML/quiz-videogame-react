const Result = ({state, onClickRestart, maxScore}) => {
  const percentage = state.userScore / maxScore * 100
  return (
    <>
      <p className="result"><span>😊</span>Você fez {state.userScore} pontos de {maxScore} ({percentage}%)</p>
      <button className=" btn btn-ui" onClick={onClickRestart}>Reiniciar quiz</button>
    </>
  )
}

export { Result }