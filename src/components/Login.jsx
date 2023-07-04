import { signInWithGoogle, signOutUser, createUser, signIn } from "../firebase/connection";
import { useState } from "react";
import background from '../assets/images/sign-up-image.jpg'
import twitterIcon from '../assets/images/twitter-icon.svg'
import '../assets/styles/Login.css'
import { useNavigate } from "react-router-dom";

function Login(){
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [emailSignIn, setEmailSingIn] = useState()
    const [passwordSignIn, setPasswordSignIn] = useState()
    const [create, setCreate] = useState(false)
    const [signIn, setSignIn] = useState(false)
    let navigate = useNavigate(); 

    const routeChange = () =>{ 
        let path = '/home'; 
        navigate(path);
      }

    const googleSignIn = () => {
        signInWithGoogle();
        routeChange();
    }

    const handleName = (e) => {
        setName(e.target.value)
    }

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const createNewUser = (e) => {
        e.preventDefault();
        createUser(email, password, name)
    }

    
    const handleEmailSignIn = (e) => {
        setEmailSingIn(e.target.value)
    }

    const handlePasswordSignIn = (e) => {
        setPasswordSignIn(e.target.value)
    }

    const signInUser = (e) => {
        e.preventDefault();
        signIn(emailSignIn, passwordSignIn)
    }
    
    const createPopup = () => {
        setCreate(true)
    }

    const signInPopup = () => {
        setSignIn(true)
    }

    return(
        <div id="loginWrapper">
            <img src={background} alt="background"></img>
            <div id="loginContent">
                <img src={twitterIcon} alt="icon" id="loginTwitterIcon"></img>
                <p id="loginTitle">Happening now</p>
                <p id="loginJoinText">Join Twitter replica today.</p>
                <div id="loginMainBlock">
                    <button onClick={googleSignIn} id="googleSignIn">Sign in with Google</button>
                    <p id="loginOr">or</p>
                    {create ?
                        <form onSubmit={createNewUser}>
                            <label>name</label>
                            <input onChange={handleName}></input>
                            <label>email</label>
                            <input onChange={handleEmail}></input>
                            <label>password</label>
                            <input onChange={handlePassword}></input>
                            <button type="submit">Submit</button>
                        </form>
                        :
                        <button onClick={createPopup} id="createAccount">Create account</button>
                    }
                </div>
                <p id="haveAccountText">Already have an account?</p>
                {signIn ?
                    <form onSubmit={signInUser}>
                        <label>email</label>
                        <input onChange={handleEmailSignIn}></input>
                        <label>password</label>
                        <input onChange={handlePasswordSignIn}></input>
                        <button type="submit">Submit</button>
                    </form>
                    :
                    <button onClick={signInPopup} id="signInToAccount">Sign in</button>
                }
            </div>
        </div>
    )
}

export default Login;