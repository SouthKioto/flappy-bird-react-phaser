import { useState } from "react";
import { NavLink } from "react-router";
import { Row, Container, Button } from "react-bootstrap";
import { FaPlay, FaGear, FaTableList } from "react-icons/fa6";
import './css/UniformStyle.css';
import './css/Colors.css'
import _defaultSettings_ from "../settings/DefaultUserSettings.json"

interface UserData {
  user_name: string,
  user_score: number,
}

export const TitlePage = () => {
  const [userData] = useState<UserData>(() => {
    const encodedUserData = localStorage.getItem("settings");
    if (encodedUserData === null) {
      localStorage.setItem("settings", JSON.stringify(_defaultSettings_));

      return JSON.parse(localStorage.getItem("settings") || "error");
    }

    const decodedUserData = JSON.parse(encodedUserData);
    let score = 0;

    const encodedLeaderboardData = localStorage.getItem("leaderboard");
    if (encodedLeaderboardData === null) {
      //localStorage.setItem("leaderboard",  JSON.stringify([{"user_name":"Mat","user_score":10000000000},{"user_name":"Player","user_score":1000},{"user_name":"Player1","user_score":2000}]));

      return ({ user_name: decodedUserData.user_name, user_score: score })
    }

    const decodedLeaderboardData = JSON.parse(encodedLeaderboardData);
    if (decodedLeaderboardData.find((entry) => (entry.user_name === decodedUserData.user_name)) === undefined) {
      return ({ user_name: decodedUserData.user_name, user_score: score })
    }

    score = decodedLeaderboardData.find((entry) => (entry.user_name === decodedUserData.user_name)).user_score;

    return ({ user_name: decodedUserData.user_name, user_score: score })
  })
  const [HiScore] = useState<number>(() => {
    const encodedLeaderboardData = localStorage.getItem("leaderboard");
    if (encodedLeaderboardData === null) {
      return 0;
    }

    const decodedLeaderboardData = JSON.parse(encodedLeaderboardData);
    const score = decodedLeaderboardData.sort((a, b) => b.user_score - a.user_score).slice(0, 1).user_score;
    return score;
  })

  return (
    <>
      <Container className='justify-content-center align-items-center text-center'>
        <Row className='m-5'>
          <h1 className='logo'>
            <span className='gold'>F</span><span className='magenta'>L</span><span className='cyan'>A</span><span className='blue'>P</span><span className='green'>P</span><span className='purple'>Y</span><br />
            <span className='purple'>B</span><span className='gold'>I</span><span className='magenta'>R</span><span className='cyan'>D</span>
          </h1>
        </Row>
        <Row>
          <h2>Current player: {userData.user_name}</h2>

        </Row>
        <Row>
          <h2>Hi-score: {HiScore}</h2>
        </Row>
        <Row>
          <h2>Your Hi-score: {userData.user_score}</h2>
        </Row>
        <Row>
          <small>(Navigate to the settings page in order to change player name)</small>
        </Row>
        <Row className='m-5 justify-content-center align-items-center text-center'>
          <NavLink to={'/game'}>
            <Button title='Play' className='play cyan bg-blue border-blue shadow'>
              <FaPlay />
            </Button>
          </NavLink>
        </Row>
        <Row className='m-5 justify-content-center align-items-center text-center'>
          <NavLink to={'/leaderboard'}>
            <Button title='Leaderboard' className='leaderboard green bg-purple border-purple shadow'>
              <h5><FaTableList /> Leaderboard</h5>
            </Button>
          </NavLink>
        </Row>
        <Row className='m-5 justify-content-center align-items-center text-center'>
          <NavLink to={'/settings'}>
            <Button title='Settings' className='settings gold bg-magenta border-magenta shadow'>
              <FaGear /> Settings
            </Button>
          </NavLink>
        </Row>
      </Container>
    </>
  )
}
