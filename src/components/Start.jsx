const Start = ({state, onClickStart}) => {

  return (
    <div className="start">
      <h2>Bem vindo ao Quiz dos Videogames!</h2>
      <h3>{state.questions?.length} questões para te testar</h3>
      <button className=" btn btn-ui" onClick={onClickStart}>Bora começar</button>
    </div>
  )
}

export { Start }