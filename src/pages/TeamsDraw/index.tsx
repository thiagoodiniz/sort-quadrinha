import { Button, Checkbox, Input } from 'antd';
import React, { useState } from 'react';
import './styles.css';
import azul from '../../assets/audios/azul.mp3'
import verde from '../../assets/audios/verde.mp3'
import preto from '../../assets/audios/preto.mp3'
import laranja from '../../assets/audios/laranja.mp3'
import vermelho from '../../assets/audios/vermelho.mp3'
import amarelo from '../../assets/audios/amarelo.mp3'

type TColors = 'Azul' | 'Verde' | 'Preto' | 'Laranja' | 'Vermelho' | 'Amarelo'

interface ITeam {
  color: TColors
  numberOfPlayers: number
}

interface ITeamColorAudio {
  color: TColors
  audioSrc: string
}

const TeamsDraw: React.FC = () => {
  const PLAYERS_BY_TEAMS = 5
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>()
  const [numberMaxOfTeams, setNumberMaxOfTeams] = useState<number>()

  const teamColors: ITeamColorAudio[] = [
    {color: 'Azul', audioSrc: azul },
    {color: 'Verde', audioSrc: verde },
    {color: 'Preto', audioSrc: preto },
    {color: 'Laranja', audioSrc: laranja },
    {color: 'Vermelho', audioSrc: vermelho },
    {color: 'Amarelo', audioSrc: amarelo },
  ]
  const [sorteds, setSorteds] = useState<string[]>([])

  const [teams, setTeams] = useState<ITeam[]>([])

  const onChangeNumberOfPlayers = (players: number) => {
    setNumberOfPlayers(players)
    setNumberMaxOfTeams(Math.ceil(players / PLAYERS_BY_TEAMS))
    setTeams([])
  }

  const onSelectTeamColor = (color: TColors) => {
    let newTeams: ITeam[] = [...teams]
    const idx = teams.findIndex((t) => t.color === color)
    if (idx !== -1) {
      newTeams = newTeams.filter((nt) => nt.color !== color)
    } else {
      newTeams.push({
        color,
        numberOfPlayers: 0
      })
    }
    setTeams(newTeams)
  }

  const playAudio = (color: TColors) => {
    const audioSrc = teamColors.find((tc) => tc.color === color)?.audioSrc
    const audio = new Audio(audioSrc)
    audio.play()
  }

  const sortNew = () => {
    const availableColors = teams.filter((t) => t.numberOfPlayers < PLAYERS_BY_TEAMS).map((t) => t.color)

    if (availableColors.length === 0) {
      return
    }

    const sortedColor = availableColors[Math.floor(Math.random() * availableColors.length)]
    playAudio(sortedColor)
    setSorteds((prev) => [...prev, sortedColor])
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.color === sortedColor ? { ...team, numberOfPlayers: team.numberOfPlayers + 1 } : team
      )
    )
  }
  
  return (
    <section>
      <div className="players-teams">
        <div>
          <span>Número de jogadores</span>
          <Input 
            value={numberOfPlayers}
            disabled={sorteds.length > 0}
            onChange={(e) => onChangeNumberOfPlayers(Number(e.target.value))}
            placeholder='Digite o número de jogadores'
            type='number'
            max={30}
          />
        </div>
        <div>
          <span>Número de times</span>
          <Input placeholder='Digite o número de jogadores' value={numberMaxOfTeams} disabled />
        </div>
      </div>

      <div>
        <span>Escolha as cores:</span>
        <div>
          {teamColors.map((tc) => 
            <Checkbox
              disabled={(numberMaxOfTeams === teams.length && !teams.find((t) => t.color === tc.color)) || !numberMaxOfTeams || sorteds.length > 0}
              onChange={() => onSelectTeamColor(tc.color)}
              checked={!!teams.find((t) => t.color === tc.color)}
            >{tc.color}</Checkbox>
          )}
        </div>
      </div>

      <div className="teams-resume">
        <div>
          {teams.map((t) => 
            <span>{t.numberOfPlayers}/{PLAYERS_BY_TEAMS} - {t.color}</span>
          )}
        </div>

        <div>
          {sorteds
            .filter((c, idx) => sorteds.indexOf(c) === idx)
            .filter((_, idx) => idx < 5).map((color, idx) => 
              <span className={color}>{`${idx + 1}º - ${color}`}</span>
          )}
        </div>
      </div>

      <div className="sort-container">
        <div>
          { sorteds.length > 1 && (
            <div className="last-sorted">
              <span>último sorteado:</span>
              <span className={`sorted-column ${sorteds[sorteds.length - 2]}`}>{ sorteds[sorteds.length - 2] }</span>
            </div>
          )}

          { sorteds.length > 0 && (
            <div>
              <span>Sorteado:</span>
              <span className={`sorted-column ${sorteds[sorteds.length - 1]}`}>{ sorteds[sorteds.length - 1] }</span>
            </div>
          )}
        </div>

        <Button
          size='large'
          type='primary'
          disabled={sorteds.length === (teams.length * PLAYERS_BY_TEAMS)}
          onClick={sortNew}
        >Sortear</Button>
      </div>
    </section>
  )
}

export default TeamsDraw