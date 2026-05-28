import { App, Button, Card, InputNumber, Progress } from 'antd'
import React, { useEffect, useState } from 'react'
import './styles.css'

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

interface ITeamColor {
  color: TColor
  imgSrc: string
}

const CURRENT_SORT = '@sort-quadrinha/sort'

interface ISavedLocalStorageSort {
  playersPerTeam?: number
  teams: ITeam[]
  sorteds: TColor[]
}

const TeamsDraw: React.FC = () => {
  const { modal } = App.useApp()
  const teamColors: ITeamColor[] = [
    { color: 'Azul', imgSrc: azulColete },
    { color: 'Verde', imgSrc: verdeColete },
    { color: 'Preto', imgSrc: pretoColete },
    { color: 'Laranja', imgSrc: laranjaColete },
    { color: 'Vermelho', imgSrc: vermelhoColete },
    { color: 'Amarelo', imgSrc: amareloColete },
  ]

  const [sorteds, setSorteds] = useState<TColor[]>([])
  const [teams, setTeams] = useState<ITeam[]>([])
  const [playersPerTeam, setPlayersPerTeam] = useState(5)

  const totalPlayers = teams.length * playersPerTeam
  const isSorting = sorteds.length > 0
  const isDone = isSorting && sorteds.length === totalPlayers
  const progressPercent = totalPlayers > 0 ? Math.round((sorteds.length / totalPlayers) * 100) : 0

  const lastSorted = sorteds[sorteds.length - 1]
  const prevSorted = sorteds[sorteds.length - 2]

  const onSelectTeamColor = (color: TColor) => {
    let newTeams: ITeam[] = [...teams]
    const idx = teams.findIndex((t) => t.color === color)
    if (idx !== -1) {
      newTeams = newTeams.filter((nt) => nt.color !== color)
    } else {
      newTeams.push({ color, numberOfPlayers: 0 })
    }
    setTeams(newTeams)
  }

  const getImg = (color: TColor) => {
    return teamColors.find((tc) => tc.color === color)?.imgSrc
  }

  const sortNew = () => {
    let availableColors: TColor[] = []
    teams.forEach((t) => {
      const missingPlayers = playersPerTeam - t.numberOfPlayers
      availableColors.push(...Array(missingPlayers).fill(t.color))
    })
    availableColors = availableColors.sort(() => Math.random() - 0.5)

    const sortedColor = availableColors[Math.floor(Math.random() * availableColors.length)]

    setSorteds((prev) => [...prev, sortedColor])
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.color === sortedColor
          ? { ...team, numberOfPlayers: team.numberOfPlayers + 1 }
          : team
      )
    )
  }

  const saveLocalStorage = () => {
    const data: ISavedLocalStorageSort = { sorteds, teams, playersPerTeam }
    localStorage.setItem(CURRENT_SORT, JSON.stringify(data))
  }

  const initLocalStoredSorted = () => {
    const data = localStorage.getItem(CURRENT_SORT)
    const saved = data ? (JSON.parse(data) as ISavedLocalStorageSort) : null
    if (saved) {
      setTeams(saved.teams)
      setSorteds(saved.sorteds)
      if (saved.playersPerTeam) setPlayersPerTeam(saved.playersPerTeam)
    }
  }

  const handleReset = () => {
    modal.confirm({
      title: 'Iniciar novo sorteio?',
      content: 'Isso apagará todos os resultados atuais.',
      okText: 'Sim, recomeçar',
      cancelText: 'Cancelar',
      centered: true,
      onOk: () => {
        setTeams([])
        setSorteds([])
        localStorage.removeItem(CURRENT_SORT)
      },
    })
  }

  useEffect(() => {
    if (teams.length) {
      saveLocalStorage()
    }
  }, [teams])

  useEffect(() => {
    initLocalStoredSorted()
  }, [])

  return (
    <div className="app-wrapper">
      {/* ── Header ── */}
      <header className="app-header">
        <h1 className="app-title">⚽ Sorteio de Times</h1>
        {isSorting && (
          <button id="btn-novo-sorteio" className="reset-link" onClick={handleReset}>
            Novo sorteio
          </button>
        )}
      </header>

      {/* ── Main ── */}
      <main className="app-main">

        {/* Setup Phase */}
        {!isSorting && (
          <section className="setup-section">
            {/* Players per team config */}
            <div className="players-config">
              <span className="section-label" style={{ marginBottom: 0 }}>
                Jogadores por time
              </span>
              <InputNumber
                id="input-jogadores-por-time"
                min={2}
                max={11}
                value={playersPerTeam}
                onChange={(val) => val && setPlayersPerTeam(val)}
                className="players-input"
              />
            </div>

            {/* Team color selection */}
            <div>
              <span className="section-label">Escolha os times</span>
              <div className="choose-teams-container">
                {teamColors.map((tc) => {
                  const isSelected = !!teams.find((t) => t.color === tc.color)
                  return (
                    <Card
                      key={tc.color}
                      id={`card-time-${tc.color.toLowerCase()}`}
                      onClick={() => onSelectTeamColor(tc.color)}
                      className={`team-card ${isSelected ? 'team-card--selected' : ''}`}
                      hoverable
                    >
                      {isSelected && <span className="check-mark">✓</span>}
                      <img
                        height={52}
                        draggable={false}
                        alt={`Colete ${tc.color}`}
                        src={tc.imgSrc}
                      />
                      <span className={`team-name ${tc.color}`}>{tc.color}</span>
                    </Card>
                  )
                })}
              </div>
            </div>

            {teams.length < 2 && (
              <p className="helper-text">
                {teams.length === 0
                  ? 'Selecione pelo menos 2 times para começar'
                  : 'Selecione mais 1 time para começar'}
              </p>
            )}
          </section>
        )}

        {/* Teams Summary (visible during sort) */}
        {isSorting && (
          <section className="teams-summary-section">
            <span className="section-label">Times</span>
            <div className="teams-summary">
              {teams.map((t) => {
                const isFull = t.numberOfPlayers === playersPerTeam
                return (
                  <div
                    key={t.color}
                    className={`team-chip ${t.color} ${isFull ? 'team-chip--full' : ''}`}
                  >
                    {isFull ? (
                      <span className="team-chip-done">✓ {playersPerTeam}/{playersPerTeam}</span>
                    ) : (
                      <>
                        <img
                          src={getImg(t.color)}
                          alt={`Colete ${t.color}`}
                          className="team-chip-img"
                        />
                        <span className="team-chip-count">
                          {t.numberOfPlayers}
                          <span className="team-chip-total">/{playersPerTeam}</span>
                        </span>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
            <Progress
              percent={progressPercent}
              strokeColor="#2563eb"
              trailColor="#e2e8f0"
              className="sort-progress"
            />
          </section>
        )}

        {/* Sort Result Card */}
        {isSorting && (
          <section className="sort-result-section">
            {/* Current drawn */}
            <div className="current-sorted">
              <span className="section-label">Sorteado agora</span>
              <div
                className="current-sorted-content animate-in"
                key={sorteds.length}
              >
                <img
                  src={getImg(lastSorted)}
                  alt={`Colete ${lastSorted}`}
                  className="current-sorted-img"
                />
                <span className={`sorted-name-big ${lastSorted}`}>{lastSorted}</span>
              </div>
            </div>

            {/* Previous drawn */}
            {prevSorted && (
              <div className="prev-sorted">
                <span className="section-label" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>
                  Anterior
                </span>
                <div className="prev-sorted-content">
                  <img
                    src={getImg(prevSorted)}
                    alt={`Colete ${prevSorted}`}
                    className="prev-sorted-img"
                  />
                  <span className={`sorted-name ${prevSorted}`}>{prevSorted}</span>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Done Banner */}
        {isDone && (
          <div className="done-banner">
            <span>🎉</span>
            <span className="done-text">Todos os jogadores sorteados!</span>
          </div>
        )}

        {/* Order ranking */}
        {isSorting && (
          <section className="order-section">
            <span className="section-label">Ordem de entrada por time</span>
            <div className="order-list">
              {sorteds
                .filter((c, idx) => sorteds.indexOf(c) === idx)
                .map((color, idx) => (
                  <div key={color} className={`order-item ${color}`}>
                    <span className="order-num">{idx + 1}º</span>
                    <img
                      src={getImg(color)}
                      alt={`Colete ${color}`}
                      className="order-img"
                    />
                    <span className="order-name">{color}</span>
                  </div>
                ))}
            </div>
          </section>
        )}
      </main>

      {/* ── Fixed Footer: Sort Button ── */}
      {teams.length > 1 && !isDone && (
        <footer className="app-footer">
          <Button
            id="btn-sortear"
            size="large"
            type="primary"
            onClick={sortNew}
            className="sort-btn"
          >
            🎲 {sorteds.length === 0 ? 'Iniciar Sorteio' : 'Sortear próximo'}
          </Button>
        </footer>
      )}
    </div>
  )
}

export default TeamsDraw