import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import uuid from 'uuid/v4';
import './index.scss';

class Notes extends Component {
  render() {
    return(
      <div className='columns'>
      <div className='column has-background-info is-one-third'>

        <aside className='menu'>
          <div className='sidebar-header-container'>
            <h2 className='menu-label title is-3'>Ya Notes Boy</h2>
            <button className='button is-info is-inverted'>New Note +</button>
          </div>

          <hr />

        </aside>
      </div>

      <div className='column has-background-info'>
        <div className='note-title title is-4'>
          Title
        </div>

        <hr />

        <div className='note-body'>
          Body
        </div>
      </div>
    </div>
    )
  }
}

export default withFirebase(Notes);
