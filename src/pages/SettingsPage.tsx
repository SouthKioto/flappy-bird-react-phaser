import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { Row, Container, Button, Form, FormSelect } from "react-bootstrap";
import { FaGear, FaArrowLeftLong } from "react-icons/fa6"; 
import './css/UniformStyle.css';
import './css/Colors.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import _defaultSettings_ from "../settings/DefaultUserSettings.json"

interface UserCock {
  cock_colour: number,
  cock_style: number,
}

interface UserPipe {
  pipe_colour: number,
  pipe_style: number,
}


interface Settings {
  user_name: string,
  user_score: number,

  user_cock: UserCock,
  user_pipe: UserPipe,

}

export const SettingsPage = () => {
  const [settings] = useState<Settings>(() => {
    const encodedSettings = localStorage.getItem("settings");
    if(encodedSettings === null)
    {
      localStorage.setItem("settings", JSON.stringify(_defaultSettings_));
      return JSON.parse(localStorage.getItem("settings") || "error");
    } 

    const decodedSettings = JSON.parse(encodedSettings);
    return decodedSettings;
  });

  const [userName, setUserName] = useState<string>(settings.user_name);
  const [userNameOnChange, setUserNameOnChange] = useState(userName);
  const [birdStyle, setBirdStyle] = useState<number>(settings.user_cock.cock_style);
  const [birdColor, setBirdColor] = useState<number>(settings.user_cock.cock_colour);
  const [pipeStyle, setPipeStyle] = useState<number>(settings.user_pipe.pipe_style);
  const [pipeColor, setPipeColor] = useState<number>(settings.user_pipe.pipe_colour);
 
  useEffect(() => {
    var BirdStyleOptionUrl = document.getElementById("BirdStyleOption" + birdStyle) as HTMLOptionElement;
    BirdStyleOptionUrl.selected = true;
    var BirdColorOptionUrl = document.getElementById("BirdColorOption" + birdColor) as HTMLOptionElement;
    BirdColorOptionUrl.selected = true;

    var PipeStyleOptionUrl = document.getElementById("PipeStyleOption" + pipeStyle) as HTMLOptionElement;
    PipeStyleOptionUrl.selected = true;
    var PipeColorOptionUrl = document.getElementById("PipeColorOption" + pipeColor) as HTMLOptionElement;
    PipeColorOptionUrl.selected = true;
  }, [settings, birdStyle, birdColor, pipeStyle, pipeColor])

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify({"user_name": userName, "user_score": 2137, "user_cock":{"cock_colour": birdColor, "cock_style": birdStyle}, "user_pipe":{"pipe_colour": pipeColor, "pipe_style": pipeStyle}}))
  }, [userName, birdStyle, birdColor, pipeStyle, pipeColor])

  return (
    <>
      <Container className='justify-content-center align-items-center text-center'>
        <Form.Group>
          <Row>
            <h1><FaGear/> SETTINGS</h1>
          </Row>
          <Row className='m-3'>
            <NavLink to={'/'}>
              <Button title='Go back' className='blue bg-green border-green shadow'>
                <FaArrowLeftLong/> Go back
              </Button>
            </NavLink>
          </Row>
          <Container className='bg-white d-flex justify-content-center shadow rounded p-3'> 
            <Form.Group>
              <h3>Player name:</h3>
              <Form.Control
                type='text'
                max={20}
                maxLength={20}
                className='shadow-sm text-center'
                value={userNameOnChange}
                onChange={(e) => setUserNameOnChange(e.target.value)}
                onBlur={(e) => setUserName(e.target.value)}
              />
              <hr className='m-4'/>
              <h5 className='mt-3'>Bird style:</h5>
              <img src={"assets/settings/bird/BirdStyle" + birdStyle + ".png"} alt={"birdStyle" + birdStyle} className='bird'/>
              <FormSelect onChange={(e) => setBirdStyle(Number(e.target.value))}>
                <option id="BirdStyleOption1" value="1">Classic</option>
                <option id="BirdStyleOption2" value="2">Cartoony</option>
              </FormSelect>
              <h5 className='mt-3'>Bird color:</h5>
              <FormSelect onChange={(e) => setBirdColor(Number(e.target.value))}>
                <option id="BirdColorOption1" value="1">Yellow</option>
                <option id="BirdColorOption2" value="2">Blue</option>
                <option id="BirdColorOption3" value="3">Red</option>
                <option id="BirdColorOption4" value="4">Green</option>
                <option id="BirdColorOption5" value="5">Brown</option>
                <option id="BirdColorOption6" value="6">White</option>
                <option id="BirdColorOption7" value="7">Pink</option>
              </FormSelect>
              <hr className='m-4'/>
              <h5 className='mt-3'>Pipe style:</h5>
              <img src={"assets/settings/pipe/PipeStyle" + pipeStyle + ".png"} alt={"pipeStyle" + pipeStyle} className='m-1'/>
              <FormSelect onChange={(e) => setPipeStyle(Number(e.target.value))}>
                <option id="PipeStyleOption1" value="1">Classic</option>
                <option id="PipeStyleOption2" value="2">Granite</option>
                <option id="PipeStyleOption3" value="3">Cartoon</option>
                <option id="PipeStyleOption4" value="4">Simple</option>
                <option id="PipeStyleOption5" value="5">Castle</option>
              </FormSelect>
              <h5 className='mt-3'>Pipe color:</h5>
              <FormSelect onChange={(e) => setPipeColor(Number(e.target.value))}>
                <option id="PipeColorOption1" value="1">Green</option>
                <option id="PipeColorOption2" value="2">Yellow</option>
                <option id="PipeColorOption3" value="3">Red</option>
                <option id="PipeColorOption4" value="4">Light blue</option>
                <option id="PipeColorOption5" value="5">White</option>
                <option id="PipeColorOption6" value="6">Pink</option>
                <option id="PipeColorOption7" value="7">Brown</option>
                <option id="PipeColorOption8" value="8">Copper</option>
              </FormSelect>
            </Form.Group>
          </Container>
        </Form.Group>
      </Container>
    </>
  )
}
