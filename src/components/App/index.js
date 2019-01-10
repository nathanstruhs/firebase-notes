import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import HomePage from '../Home';
import AccountPage from '../Account';
import { Session } from '../Session';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../routes';

import './index.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticatedUser: false };
  }

  componentDidMount() {
    this.authStateChangedlistener = this.props.firebase.auth.onAuthStateChanged(
      authenticatedUser => {
        authenticatedUser ? this.setState({ authenticatedUser }) : this.setState({ authenticatedUser: false });
      }
    );
  }

  componentWillUnmount() {
    this.authStateChangedlistener();
  }

  render() {
    return (
      <Session.Provider value={this.state.authenticatedUser}>
        <Router>
          <div className='container has-background-grey-light'>
            <Navigation authenticatedUser={this.state.authenticatedUser}/>

            <div className='internal-container'>
              <Route exact path={ROUTES.HOME} component={HomePage} />
              <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            </div>
          </div>
        </Router>
      </Session.Provider>
    );
  }
}

export default withFirebase(App);
