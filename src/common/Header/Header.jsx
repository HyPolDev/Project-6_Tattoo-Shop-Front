import { Navigator } from "../Navigator/Navigator";
import { useNavigate } from "react-router-dom";
import "./Header.css"


export const Header = () => {
  const navigate = useNavigate()
  const passport = JSON.parse(localStorage.getItem("passport"))
  const role = passport?.decodificado.roleName
  const logOut = () => {
    localStorage.removeItem("passport")
    navigate("/login")
  }
  return (
    <div className="headerDesign">
      <h1>Tattoo Shop</h1>

      <Navigator title={"Home"} destination={"/"} />
      <Navigator title={"services"} destination={"/services"} />
      {passport ? (
        <div className="authMenu">
          <Navigator title={"my appointments"} destination={"/appointments"} />
          <Navigator title={passport.decodificado.userName} destination={"/profile"} />
          {role == "superadmin" || role == "admin" ? (
            <Navigator title={"ADMINISTRACION"} destination={"/superadmin"} />
          ) : <></>}
          <div onClick={logOut}>
            <Navigator title={"Log out"} destination={"/"} />
          </div>
        </div>) : (
        <div className="authMenu">
          <Navigator title={"Register"} destination={"/register"} />
          <Navigator title={"Login"} destination={"/login"} />
        </div>
      )}

    </div>
  )
}