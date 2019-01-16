import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import { Session } from '../Session';
import * as ROUTES from '../../routes';
import './index.scss';

const Navigation = () => (
  <Session.Consumer>
    {authenticatedUser =>
      authenticatedUser ? <NavigationAuthenticated /> : <NavigationNonAuthenticated />
    }
  </Session.Consumer>
);

const NavigationNonAuthenticated = () => (
  <nav className='navbar is-dark'>
    <div className='navbar-menu'>
      <div className='navbar-start'>
        <Link to={ROUTES.HOME} className="navbar-item">Firebase Notes</Link>
      </div>
    </div>
  </nav>

);

const NavigationAuthenticated = () => (
  <nav className='navbar is-dark'>
    <div className='navbar-menu'>
      <div className='navbar-end'>
        <Link to={ROUTES.NOTES} className="navbar-item">Notes</Link>
        <Link to={ROUTES.ACCOUNT} className="navbar-item">Account</Link>
        <SignOutButton />
      </div>
    </div>
  </nav>
);

export default Navigation;