import React, { FC } from "react"

type GamesDisplayProps = {
  gameId: number
}

export const GamesDisplay: FC<GamesDisplayProps> = ({ gameId }) => {
  console.log(gameId)
  return <div>coucou</div>
}
