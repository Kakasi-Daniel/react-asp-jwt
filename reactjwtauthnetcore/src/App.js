import {BrowserRouter,Switch,Route} from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import NavBar from './NavBar';
import { useEffect,useContext } from 'react';
import context from './store';
import jwtDecode from 'jwt-decode';

function App() {

  const [,dispatch] = useContext(context);

  useEffect(() => {
    (async()=>{
      let token = localStorage.getItem('token');

      if(token){
        const decoded = jwtDecode(token);
        const expDate = new Date(decoded.exp * 1000).getTime();
        const today = new Date().getTime();
        const remainingTime = expDate - today;
        if(remainingTime > 0){
          const res = await fetch("https://localhost:44387/api/account",{
            method: "GET",
            headers: {
             'Content-Type': 'Application/json',
             'Authorization': 'Bearer ' + token,
            }
          });
     
          const user = await res.json();
     
          dispatch({type:"setUser",user});
          setTimeout(()=>{
            dispatch({type: "logout"});
          },remainingTime)
        }else{
          dispatch({type: "logout"});
        }
        

       
      }
   
    })();
  }, [dispatch])

  return (

    <BrowserRouter>

      <NavBar/>

      <Switch>

        <Route path="/" exact={true} >
            <Home/>
        </Route>

        <Route path="/login">
            <Login/>
        </Route>

        <Route path="/register">
            <Register/>
        </Route>

        

      </Switch>

    </BrowserRouter>
  );
}

export default App;
