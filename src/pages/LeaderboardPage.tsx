import { useState } from "react";
import { NavLink } from "react-router";
import { Row, Container, Button } from "react-bootstrap";
import { FaTableList, FaArrowLeftLong } from "react-icons/fa6";
import './css/UniformStyle.css';
import './css/Colors.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface LeaderboardEntry {
  user_name: string,
  user_score: number,
}

export const LeaderboardPage = () => {
  const [Leaderboard] = useState<LeaderboardEntry[]>(() => {
    const encodedLeaderboardData = localStorage.getItem("leaderboard");
    if (encodedLeaderboardData === null) {
      /*localStorage.setItem("leaderboard", JSON.stringify([{
        "user_name": "Mata",
        "user_score": 10000000000
      },
      {
        "user_name": "Player",
        "user_score": 1000
      },
      {
        "user_name": "Player1",
        "user_score": 2000
      }]));*/

      return [JSON.parse(localStorage.getItem("settings") || "error")];
    }

    const decodedLeaderboardData = JSON.parse(encodedLeaderboardData);
    return decodedLeaderboardData;
  })

  return (
    <>
      <Container className='justify-content-center align-items-center text-center'>
        <Row>
          <h1><FaTableList /> LEADERBOARD</h1>
        </Row>
        <Row className='m-3 justify-content-center align-items-center text-center'>
          <NavLink to={'/'}>
            <Button title='Go back' className='back blue bg-green border-green shadow'>
              <FaArrowLeftLong /> Go back
            </Button>
          </NavLink>
        </Row>
        <Row>
          <h2>TOP 25 PLAYERS:</h2>
        </Row>
        <Row>
          <table className='leaderboard shadow rounded p-3'>
            <tbody>
              <tr><th>Player:</th><th>Score:</th></tr>
              {([...Leaderboard].sort((a, b) => b.user_score - a.user_score)).slice(0, 25).map(function(entry, index) {
                return <tr key={index}><td>{entry.user_name}</td><td>{entry.user_score}</td></tr>
              })}
            </tbody>
          </table>
        </Row>
      </Container>
    </>
  )
}
