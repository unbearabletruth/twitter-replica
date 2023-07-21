import { Link } from "react-router-dom";
import '../assets/styles/Error404.css'

function Error404({development = false}){

  return(
    <div id="error404Wrapper">
      {development ? 
      <p id="error404Text">
        Hmm...this page is in development (or not). Try searching for something else.
      </p>
      :
      <p id="error404Text">
        Hmm...this page doesn't exist. Try searching for something else.
      </p>
      }
      <Link to='/home' id="error404Link">Home</Link>
    </div>
  )
}

export default Error404;