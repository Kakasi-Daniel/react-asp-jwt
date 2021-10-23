import { createContext, useReducer } from "react";

const defaultValues = {
  user: null,
  isLogged: false,
};

const authContext = createContext(defaultValues);

const reducer = (state, action) => {
  if (action.type === "setUser") {
    localStorage.setItem("token",action.user.token)
    
    return{
        user: {...action.user},
        isLogged: true
    }
  }
  if (action.type === "logout") {
    localStorage.removeItem("token");
    return{
        user: null,
        isLogged: false
    }
  }
  else {
    console.log("default case");
    return defaultValues;
  }
};

export const ContextWrapper = (props) => {
  return (
    <authContext.Provider value={useReducer(reducer, defaultValues)}>
      {props.children}
    </authContext.Provider>
  );
};

export default authContext;
