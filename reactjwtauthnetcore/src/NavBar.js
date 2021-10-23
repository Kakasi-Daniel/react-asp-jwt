import { NavLink } from "react-router-dom"

const NavBar = () => {
    return (
        <header>
            <nav>
                <NavLink exact to="/" className="logo">|T|T|T|</NavLink>
                <ul className="menu" >
                    <li><NavLink exact to="/" >Home</NavLink></li>
                    <li><NavLink exact to="login" >Login</NavLink></li>
                    <li><NavLink exact to="register" >Register</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}

export default NavBar
