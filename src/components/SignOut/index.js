import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../routes';

const INITIAL_STATE = {
  redirect: false,
  error: null,
};

class SignOutButton extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  signOut = (event) => {
    this.props.firebase
      .signOut()
      .then(response => {
        this.setState({ redirect: true })

        // this does not work, whyyy
        // this.props.history.push(ROUTES.ACCOUNT);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    if (this.state.redirect === true) {
      return <Redirect to={ROUTES.HOME} />
    }

    return (
      <div className='navbar-item'>
        <div className='field'>
          <p className='control'>
            <a className='navbar-item button is-info is-outlined' onClick={this.signOut}>Sign Out</a>
          </p>
        </div>
      </div>
    )
  }
}

export default withFirebase(SignOutButton);
