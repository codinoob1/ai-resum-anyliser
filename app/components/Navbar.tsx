import {Link, useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";

const Navbar = (props: any) => {
    const {auth} = usePuterStore();

    useEffect(() => {
        if(auth.isAuthenticated){
            //display signout button
        }
    }, []);

    return (
        <nav className="navbar">
            <Link to="/">
                <p className="font-bold text-2xl text-gradient ">Resumea</p>
            </Link>
            <Link to="/upload" className="primary-button w-fit">
                Upload Resume
            </Link>
            {auth.isAuthenticated ? (
                <button
                    onClick={auth.signOut}
                    className="primary-button w-fit"
                >
                    Sign out
                </button>
            ) : (
                <Link to="/auth" className="primary-button w-fit">
                    Sign in
                </Link>
            )}
        </nav>
    )
}

export default Navbar;