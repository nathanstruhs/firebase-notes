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
      <div className='container'>
        <div className='profile-header'>
          <h1 className='title is-3'>{ this.props.authenticatedUser.displayName }</h1>
          <div class='image is-64x64'>
            <img className='profile-photo is-rounded' src={this.props.authenticatedUser.photoURL} alt='Firebase notes profile'/>
          </div>
        </div>

        <hr />

        <p>{ this.props.authenticatedUser.email }</p>
      </div>
    )
  }
}

export default withFirebase(Account);
