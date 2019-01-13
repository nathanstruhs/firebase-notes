import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../routes';
import './index.scss';

const SignUpPage = () => (
  <div>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  signUp = (event) => {
    const { email, password } = this.state;

    this.props.firebase
      .signUp(email, password)
      .then(response => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.ACCOUNT);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  signIn = (event) => {
    const { email, password } = this.state;

    this.props.firebase
      .signIn(email, password)
      .then(response => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.ACCOUNT);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  signInGoogle = (event) => {
    const { email, password } = this.state;

    this.props.firebase
    .signInWithGoogle(email, password)
    .then(response => {
      this.setState({ ...INITIAL_STATE });
      this.props.history.push(ROUTES.ACCOUNT);
    }).catch(error => {
      this.setState({ error });
    });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    return (
      <div className='home-container box'>
        <form onSubmit={this.onSubmit}>
          <div className='field'>
            <input className='input' name="email" value={email} onChange={this.onChange} type="text" placeholder="Email" />
          </div>

          <div className='field'>
            <input className='input' name="password" value={password} onChange={this.onChange} type="password" placeholder="Password" />
          </div>

          <div className='field is-grouped'>
            <p className="control">
              <button className='button is-info' type="button" onClick={this.signUp}>Sign up</button>
            </p>
            <p className="control">
              <button className='button is-info' type="button" onClick={this.signIn}>Sign in</button>
            </p>
          </div>

          <hr />

          <div className='field'>
            <button className='button is-danger' type="button" onClick={this.signInGoogle}>Sign in with Google</button>
          </div>

          {error && <p>{error.message}</p>}
        </form>
      </div>
    );
  }
}

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export { SignUpForm };