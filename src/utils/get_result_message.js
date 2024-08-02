
const getResultMessage = ({score = 0, maxScore = 0}) => {

  const percentage = score/maxScore * 100  

  const resultMessage = {
    0: `😥 Poxa, você fez ${score} pontos de ${maxScore} (${percentage}%)`,
    10: `😐 Você fez ${score} pontos de ${maxScore} (${percentage}%)`,
    20: `🙂 Você fez ${score} pontos de ${maxScore} (${percentage}%)`,
    30: `😊 Você fez ${score} pontos de ${maxScore} (${percentage}%)`,
    40: `😁 Você fez ${score} pontos de ${maxScore} (${percentage}%)`,
    50: `🏆 Caramba! Você fez ${score} pontos de ${maxScore} (${percentage}%)`
  }

  return resultMessage[score]
}

export { getResultMessage }