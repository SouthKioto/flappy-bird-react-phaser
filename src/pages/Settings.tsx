import { useEffect, useState } from "react"
import _defaultSettings_ from "../settings/DefaultSettings.json"

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

export const Settings = () => {
  const [defaultSettings, setDefaultSettings] = useState<Settings>(_defaultSettings_)

  useEffect(() => {
    setDefaultSettings(_defaultSettings_);
    console.log(defaultSettings);
  }, [defaultSettings])

  return (
    <>
      <h1>
        Default Settings:
      </h1>

      <ul>
        <li>User name: {defaultSettings.user_name}</li>
        <li>User Score: {defaultSettings.user_score}</li>
        <li>
          User cock:
          <ul>
            <li>Cock colour: {defaultSettings.user_cock.cock_colour}</li>
            <li>Cock style: {defaultSettings.user_cock.cock_style}</li>
          </ul>
        </li>

        <li>
          User pipe:
          <ul>
            <li>pipe colour: {defaultSettings.user_pipe.pipe_colour}</li>
            <li>pipe colour: {defaultSettings.user_pipe.pipe_style}</li>
          </ul>
        </li>
      </ul>

    </>
  )
}
