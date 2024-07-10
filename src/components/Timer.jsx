import { useEffect, useState } from "react"
import { secondsPerQuestion } from "@/utils/secondsPerQuestion"

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

export { Timer }