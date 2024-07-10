const ButtonNext = ({onClickNext, isTheLastQuestion}) => {
  return (
    <button className=" btn btn-ui" onClick={onClickNext}>{!isTheLastQuestion ? "Próxima" : "Finalizar"}</button>
  )
}

export { ButtonNext }