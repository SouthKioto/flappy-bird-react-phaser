import { useState } from "react";
import { NavLink } from "react-router";

export const TitlePage = () => {
  return (
    <>
      <h1>Title page</h1>
      <NavLink to={'/game'}>
        <input type="button" value='Start' />
      </NavLink>
    </>
  )
}
