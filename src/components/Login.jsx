import { signIn, signOutUser } from "../firebase/connection";

function Login(){
    return(
        <>
            <button onClick={() => signIn()}>log in with google</button>
            <button onClick={() => signOutUser()}>log out</button>
        </>
    )
}

export default Login;