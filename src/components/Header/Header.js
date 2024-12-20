import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import Logo from '../../images/background.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../SignUp/useAuth';

const Header = (props) => {

    const auth = useAuth();

    return (
        <nav className='navbar navbar-expand navbar-light bg-white py-2  sticky-top'>
            <div className="container">
                <Link to='/' className='navbar-brand'>
                    <img src={Logo} alt="Nilgiri Cart logo" />
                </Link>

                <ul className='navbar-nav align-items-center'>
                    <li className='nav-item active'>
                        <Link to='/checkout' className='nav-link'>
                            <FontAwesomeIcon icon={faCartArrowDown} />
                            <span className='badge bg-light'>{props.cart.length}</span>
                        </Link>
                    </li>

                    <li className='nav-item'>
                        {
                            auth.user ?
                                <Link to='/profile' className='nav-link'>
                                    <img src="/path/to/profile-icon.png" alt="Profile" className="profile-icon" />
                                </Link>
                                :
                                <Link to={{ pathname: '/signup', state: { defaultReturningUser: true } }} className='nav-link'>Login</Link>
                        }
                    </li>

                    <li className='nav-item'>
                        {
                            auth.user ?
                                <Link to='/' className='nav-link'>
                                    <button onClick={() => { auth.signOut() }}
                                        className='btn btn-danger btn-rounded'
                                    >
                                        Sign Out
                                </button>
                                </Link>
                                :
                                <Link to={{ pathname: '/signup', state: { defaultReturningUser: false } }} className='nav-link'>
                                    <button
                                        className='btn btn-danger btn-rounded'
                                    >
                                        Sign Up
                                    </button>
                                </Link>
                        }
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;