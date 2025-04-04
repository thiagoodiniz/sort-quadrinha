import { Button, Checkbox, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import './styles.css'

import azul from '../../assets/audios/azul.mp3'
import verde from '../../assets/audios/verde.mp3'
import preto from '../../assets/audios/preto.mp3'
import laranja from '../../assets/audios/laranja.mp3'
import vermelho from '../../assets/audios/vermelho.mp3'
import amarelo from '../../assets/audios/amarelo.mp3'

import azulColete from '../../assets/coletes-img/colete-azul.png'
import verdeColete from '../../assets/coletes-img/colete-verde.png'
import pretoColete from '../../assets/coletes-img/colete-preto.png'
import laranjaColete from '../../assets/coletes-img/colete-laranja.png'
import vermelhoColete from '../../assets/coletes-img/colete-vermelho.png'
import amareloColete from '../../assets/coletes-img/colete-amarelo.png'

type TColor = 'Azul' | 'Verde' | 'Preto' | 'Laranja' | 'Vermelho' | 'Amarelo'

interface ITeam {
  color: TColor
  numberOfPlayers: number
}

interface ITeamColorAudio {
  color: TColor
  audioSrc: string
  imgSrc: string
}

const TeamsDraw: React.FC = () => {
  const PLAYERS_BY_TEAMS = 5
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>()
  const [numberMaxOfTeams, setNumberMaxOfTeams] = useState<number>()

  const teamColors: ITeamColorAudio[] = [
    {color: 'Azul', audioSrc: azul, imgSrc: azulColete },
    {color: 'Verde', audioSrc: verde, imgSrc: verdeColete },
    {color: 'Preto', audioSrc: preto, imgSrc: pretoColete },
    {color: 'Laranja', audioSrc: laranja, imgSrc: laranjaColete },
    {color: 'Vermelho', audioSrc: vermelho, imgSrc: vermelhoColete },
    {color: 'Amarelo', audioSrc: amarelo, imgSrc: amareloColete }
  ]
  const [sorteds, setSorteds] = useState<TColor[]>([])
  const [animate, setAnimate] = useState(false)

  const [teams, setTeams] = useState<ITeam[]>([])

  const onChangeNumberOfPlayers = (players: number) => {
    setNumberOfPlayers(players)
    setNumberMaxOfTeams(Math.ceil(players / PLAYERS_BY_TEAMS))
    setTeams([])
  }

  const onSelectTeamColor = (color: TColor) => {
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

  const playAudio = (color: TColor) => {
    const audioSrc = teamColors.find((tc) => tc.color === color)?.audioSrc
    const audio = new Audio(audioSrc)
    audio.play()
  }

  const getImg = (color: TColor) => {
    const imgSrc = teamColors.find((tc) => tc.color === color)?.imgSrc
    return imgSrc
  }

  const sortNew = () => {
    const availableColors = teams.filter((t) => t.numberOfPlayers < PLAYERS_BY_TEAMS).map((t) => t.color)

    if (availableColors.length === 0) {
      return
    }

    const sortedColor = availableColors[Math.floor(Math.random() * availableColors.length)]
    playAudio(sortedColor)
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.color === sortedColor ? { ...team, numberOfPlayers: team.numberOfPlayers + 1 } : team
      )
    )
    setSorteds((prev) => [...prev, sortedColor])
  }

  useEffect(() => {
    setAnimate(false);
    setTimeout(() => setAnimate(true), 100)
  }, [teams]);
  
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
              key={tc.color}
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
            <span key={t.color}>{t.numberOfPlayers}/{PLAYERS_BY_TEAMS} - {t.color}</span>
          )}
        </div>

        <div>
          {sorteds
            .filter((c, idx) => sorteds.indexOf(c) === idx)
            .filter((_, idx) => idx < 5).map((color, idx) => 
              <span key={color} className={color}>{`${idx + 1}º - ${color}`}</span>
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
              { animate && (
                  <img 
                    alt="team color" 
                    className="sorted-img animate-img" 
                    src={getImg(sorteds[sorteds.length - 1])} key={sorteds[sorteds.length - 1]}/>
                ) 
              }
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