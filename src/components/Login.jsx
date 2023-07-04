import { signInWithGoogle, signOutUser, createUser, signIn } from "../firebase/connection";
import { useState } from "react";
import background from '../assets/images/sign-up-image.jpg'
import twitterIcon from '../assets/images/twitter-icon.svg'
import closeIcon from '../assets/images/close-icon.svg'
import '../assets/styles/Login.css'
import { useNavigate } from "react-router-dom";

function Login(){
    const [signInData, setSignInData] = useState({
        email: "",
        password: ""
    })
    const [createPopup, setCreate] = useState(false)
    const [signInPopup, setSignIn] = useState(false)
    let navigate = useNavigate(); 

    const goHome = () =>{ 
        let path = '/home'; 
        navigate(path);
      }

    const googleSignIn = () => {
        signInWithGoogle();
        goHome();
    }

    const handleChange = (e) => {
        setSignInData({
            ...signInData,
            [e.target.name] : e.target.value
        }) 
    }

    const signInUser = (e) => {
        e.preventDefault();
        signIn(signInData);
        goHome();
    }
    
    const createPopupState = () => {
        setCreate(!createPopup)
    }

    const signInPopupState = () => {
        setSignIn(!signInPopup)
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
                    <button onClick={createPopupState} id="createAccount">Create account</button>
                    
                </div>
                <p id="haveAccountText">Already have an account?</p>
                {signInPopup ?
                    <form onSubmit={signInUser}>
                        <label>email</label>
                        <input onChange={handleChange} name="email"></input>
                        <label>password</label>
                        <input onChange={handleChange} name="password"></input>
                        <button type="submit">Submit</button>
                    </form>
                    :
                    <button onClick={signInPopupState} id="signInToAccount">Sign in</button>
                }
            </div>
            {createPopup ?
                <CreateAccount goHome={goHome} popup={createPopupState} />
                :
                null
            }
        </div>
    )
}

function CreateAccount({goHome, popup}){
    const [createData, setCreateData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setCreateData({
            ...createData,
            [e.target.name] : e.target.value
        }) 
    }

    const createNewUser = (e) => {
        e.preventDefault();
        createUser(createData);
        goHome();
    }

    return(
        <div id="createPopupWrapper">
            <button onClick={popup} className="closePopup">
                <img src={closeIcon} alt="x" className="closeIcon"></img>
            </button>
            <p id="createTitle">Create your account</p>
            <form onSubmit={createNewUser} id="createForm">
                <div id="createInputs">
                    <input 
                        onChange={handleChange} 
                        name="name" 
                        placeholder="Name" 
                        className="createInput"
                    >
                    </input>
                    <input 
                        onChange={handleChange} 
                        name="email" 
                        placeholder="Email" 
                        className="createInput"
                    >
                    </input>
                    <input 
                        onChange={handleChange} 
                        name="password" 
                        placeholder="Password" 
                        className="createInput"
                    >
                    </input>
                </div>
                <button type="submit" id="submitCreate">Create</button>
            </form>
        </div>
    )
}

export default Login;