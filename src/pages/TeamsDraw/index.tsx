import { Button, Card, Checkbox, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import './styles.css'

import azulColete from '../../assets/coletes-img/colete-azul.png'
import verdeColete from '../../assets/coletes-img/colete-verde.png'
import pretoColete from '../../assets/coletes-img/colete-preto.png'
import laranjaColete from '../../assets/coletes-img/colete-laranja.png'
import vermelhoColete from '../../assets/coletes-img/colete-vermelho.png'
import amareloColete from '../../assets/coletes-img/colete-amarelo.png'
import Meta from 'antd/es/card/Meta'
import { CheckOutlined } from '@ant-design/icons'

type TColor = 'Azul' | 'Verde' | 'Preto' | 'Laranja' | 'Vermelho' | 'Amarelo'

interface ITeam {
  color: TColor
  numberOfPlayers: number
}

interface ITeamColorAudio {
  color: TColor
  imgSrc: string
}

const CURRENT_SORT = '@sort-quadrinha/sort'

interface ISavedLocalStorageSort {
  numberOfPlayers?: number
  numberMaxOfTeams?: number
  teams: ITeam[]
  sorteds: TColor[]
}

const TeamsDraw: React.FC = () => {
  const PLAYERS_BY_TEAMS = 5

  const teamColors: ITeamColorAudio[] = [
    {color: 'Azul', imgSrc: azulColete },
    {color: 'Verde', imgSrc: verdeColete },
    {color: 'Preto', imgSrc: pretoColete },
    {color: 'Laranja', imgSrc: laranjaColete },
    {color: 'Vermelho', imgSrc: vermelhoColete },
    {color: 'Amarelo', imgSrc: amareloColete }
  ]
  const [sorteds, setSorteds] = useState<TColor[]>([])
  const [animate, setAnimate] = useState(false)

  const [teams, setTeams] = useState<ITeam[]>([])

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

    setSorteds((prev) => [...prev, sortedColor])
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.color === sortedColor ? { ...team, numberOfPlayers: team.numberOfPlayers + 1 } : team
      )
    )
  }

  const saveLocalStorage = () => {
    const data: ISavedLocalStorageSort = {
      sorteds,
      teams
    }

    localStorage.setItem(CURRENT_SORT, JSON.stringify(data))
  }

  const initLocalStoredSorted = () => {
    const data = localStorage.getItem(CURRENT_SORT)
    const sorted = data ? JSON.parse(data) as ISavedLocalStorageSort : null
    if (sorted) {
      setTeams(sorted.teams)
      setSorteds(sorted.sorteds)
    }
  }

  const onResetClick = () => {
    setTeams([])
    setSorteds([])
  }

  useEffect(() => {
    if (teams.length) {
      setAnimate(false);
      setTimeout(() => setAnimate(true), 100)
      saveLocalStorage()
    }
  }, [teams]);

  useEffect(() => {
    initLocalStoredSorted()
  }, []);
  
  return (
    <section>
      <div className="players-teams">
        {sorteds.length > 0 && (
          <Button
            size='small'
            type='primary'
            onClick={onResetClick}
          >Novo sorteio</Button>
        )}
      </div>

        {sorteds.length === 0 && (
          <div>
            <span>Escolha as cores:</span>
            <div className="choose-teams-container">
              {teamColors.map((tc) => 
                <Card
                  key={tc.color}
                  onClick={() =>  onSelectTeamColor(tc.color)}
                  style={{ opacity: teams.find((t) => t.color === tc.color) ? 1 : 0.35 }}
                >
                  <img
                    style={{ height: 48 }}
                    draggable={false}
                    alt="example"
                    src={tc.imgSrc}
                  />
                  <span className={tc.color}>{tc.color}</span>
                </Card>
              )}
            </div>
          </div>
        )}

      <div className="teams-resume">
        <div>
          {teams.map((t) => 
            <span key={t.color} className={t.color}>{t.numberOfPlayers}/{PLAYERS_BY_TEAMS} - {t.color}</span>
          )}
        </div>

        <div>
          {sorteds
            .filter((c, idx) => sorteds.indexOf(c) === idx)
            .map((color, idx) => 
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

        {teams.length > 1 && (
          <Button
            size='large'
            type='primary'
            disabled={sorteds.length === (teams.length * PLAYERS_BY_TEAMS)}
            onClick={sortNew}
          >Sortear</Button>
        )}
      </div>
    </section>
  )
}

export default TeamsDraw