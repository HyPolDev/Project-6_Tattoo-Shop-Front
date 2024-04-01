import { useEffect, useState } from "react";
import { CButton } from "../../common/CButton/CButton";
import { CInput } from "../../common/CInput/CInput";
import { validame } from "../../utils/functions";
import "./Login.css";
import { LoginUser } from "../../services/apiCalls";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "react-jwt";
import { Header } from "../../common/Header/Header";


export const Login = () => {
  const userData = JSON.parse(localStorage.getItem("passport"));
  const navigate = useNavigate();
  const [tokenStorage, setTokenStorage] = useState(userData?.token);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [credentialsError, setCredentialsError] = useState({
    emailError: "",
    passwordError: "",
  });

  const [msgError, setMsgError] = useState("");

  useEffect(() => {
    if (tokenStorage) {
      navigate("/");
    }
  }, [tokenStorage]);

  const inputHandler = (e) => {
    setCredentials((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const checkError = (e) => {
    const error = validame(e.target.name, e.target.value);

    setCredentialsError((prevState) => ({
      ...prevState,
      [e.target.name + "Error"]: error,
    }));
  };

  const loginMe = async () => {
    try {
      for (let elemento in credentials) {
        if (credentials[elemento] === "") {
          throw new Error("All fields must be filled ");
        }
      }
      console.log("0");
      const fetched = await LoginUser(credentials);

      const decodificado = decodeToken(fetched.token);

      const passport = {
        token: fetched.token,
        decodificado: decodificado,
      };

      localStorage.setItem("passport", JSON.stringify(passport));

      setMsgError(
        ""
      );
      console.log("2");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setMsgError(error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="loginDesign">
        <CInput
          className={`inputDesign ${credentialsError.emailError !== "" ? "inputDesignError" : ""
            }`}
          type={"email"}
          placeholder={"email"}
          name={"email"}
          disabled={""}
          value={credentials.email || ""}
          onChangeFunction={(e) => inputHandler(e)}
          onBlurFunction={(e) => checkError(e)}
        />
        <div className="error">{credentialsError.emailError}</div>
        <CInput
          className={`inputDesign ${credentialsError.passwordError !== "" ? "inputDesignError" : ""
            }`}
          type={"password"}
          placeholder={"password"}
          name={"password"}
          disabled={""}
          value={credentials.password || ""}
          onChangeFunction={(e) => inputHandler(e)}
          onBlurFunction={(e) => checkError(e)}
        />
        <div className="error">{credentialsError.passwordError}</div>

        <CButton
          className={"cButtonDesign"}
          title={"Login"}
          functionEmit={loginMe}
        />
        <div className="error">{msgError}</div>
      </div>
    </>
  );
};
