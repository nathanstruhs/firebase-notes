import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import { Session } from '../Session';
import * as ROUTES from '../../routes';

const Navigation = () => (
  <Session.Consumer>
    {authenticatedUser =>
      authenticatedUser ? <NavigationNonAuthenticated /> : <NavigationAuthenticated />
    }
  </Session.Consumer>
);

const NavigationAuthenticated = () => (
  <nav className='navbar is-dark'>
    <div className='navbar-menu'>
      <div className='navbar-start'>
        <Link to={ROUTES.HOME} className="navbar-item">Home</Link>
      </div>
    </div>
  </nav>

);

const NavigationNonAuthenticated = () => (
  <nav className='navbar is-dark'>
    <div className='navbar-menu'>
      <div className='navbar-start'>
        <Link to={ROUTES.ACCOUNT} className="navbar-item">Account</Link>
        <SignOutButton />
      </div>
    </div>
  </nav>
);

export default Navigation;