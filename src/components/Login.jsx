import { signInWithGoogle, signOutUser, createUser, signIn } from "../firebase/connection";
import { useState } from "react";

function Login(){
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [emailSignIn, setEmailSingIn] = useState()
    const [passwordSignIn, setPasswordSignIn] = useState()

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
    console.log(email)
    return(
        <>
            <button onClick={() => signIn()}>log in</button>
            <button onClick={() => signInWithGoogle()}>log in with google</button>
            <h1>createUser</h1>
            <form onSubmit={createNewUser}>
                <label>name</label>
                <input onChange={handleName}></input>
                <label>email</label>
                <input onChange={handleEmail}></input>
                <label>password</label>
                <input onChange={handlePassword}></input>
                <button type="submit">Submit</button>
            </form>
            
            <button onClick={() => signOutUser()}>log out</button>
            <h1>singinUser</h1>
            <form onSubmit={signInUser}>
                <label>email</label>
                <input onChange={handleEmailSignIn}></input>
                <label>password</label>
                <input onChange={handlePasswordSignIn}></input>
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

export default Login;