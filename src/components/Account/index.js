import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Session } from '../Session';
import './index.scss';

const Account = () => (
  <Session.Consumer>
    { authenticatedUser => <AccountComponent authenticatedUser={authenticatedUser} /> }
  </Session.Consumer>
);

class AccountComponent extends Component {
  render() {
    return (
      <div>
        <div className='profile-header'>
          <h1 className='title is-3'>{ this.props.authenticatedUser.displayName }</h1>
          <img className='profile-photo' src={this.props.authenticatedUser.photoURL} />
        </div>

        <hr />

        <p>{ this.props.authenticatedUser.email }</p>
      </div>
    )
  }
}

export default withFirebase(Account);
