import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import uuid from 'uuid/v4';
import './index.scss';

class Notes extends Component {
  render() {
    return(
      <div></div>
    )
  }
}

export default withFirebase(Notes);
