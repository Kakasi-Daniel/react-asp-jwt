import { useContext } from "react"
import context from './store';

const Home = () => {

    const [state,dispatch] = useContext(context)

    const logoutHandler = () =>{
        dispatch({type:'logout'})
    }

    return (
        <div className="home centered" >
            {state.isLogged ? (
                <>
                <h1>Hello {state.user.displayName}</h1>
                <button onClick={logoutHandler} >Logout</button>
                </>
            ):
                <h1>User is logged off</h1>
            }
        </div>
    )
}

export default Home
