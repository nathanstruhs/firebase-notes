import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import uuid from 'uuid/v4';
import './index.scss';

const INITIAL_STATE = {
  activeNote: {},
  notes: [],
  loading: false
}

class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE }
  }

  componentDidMount() {
    this.props.firebase.notes().on('value', snapShot => {
      const notes = snapShot.val();
      this.setState({ notes, loaded: true });
      if (Object.keys(notes).length !== 0) {
        const id = Object.keys(notes)[0];
        const { title, body } = notes[id];
        this.setState({ activeNote: { id, title, body }});
      }
    });
  }

  newNote = () => {
    const id = uuid();
    const newNote = { id, title: 'New Note', body: 'Add yer content..' }
    this.props.firebase.note(id)
      .set({ ...newNote }, (error) => {
        if (error) {
          console.log(error);
        } else {
          this.setState({ activeNote: { ...newNote } })
        }
    });
  }

  setCurrentNote = (note) => {
    this.setState({ activeNote: { ...note }});
  }

  onTitleChange = (event) => {
    const activeNote = { ...this.state.activeNote }
    activeNote.title = event.target.value;

    this.props.firebase.note(activeNote.id)
      .update({ id: activeNote.id, title: event.target.value, body: activeNote.body }, (error) => {
        if (error) { console.log(error) }
      });

    this.setState({ activeNote });
  }

  onBodyChange = (event) => {
    const activeNote = { ...this.state.activeNote }
    activeNote.body = event.target.value;

    this.props.firebase.note(activeNote.id)
      .update({ id: activeNote.id, title: activeNote.title, body: event.target.value }, (error) => {
        if (error) { console.log(error) }
      });

    this.setState({ activeNote });
  }

  deleteNote = (id) => {
    this.props.firebase.note(id)
      .remove((error) => {
        if (error) { console.log(error) }
    });
  }

  fileUpload = (event) => {
    const file = event.target.files[0];
    const activeNote = this.state.activeNote;
    this.props.firebase.file().child(`/${activeNote.id}/${file.name}`).put(file);
  }

  noteList = () => {
    const { notes } = this.state;

    return (
      <ul className='menu-list'>
        { Object.keys(notes).map((a, i) => {
          const note = notes[a];
          return (
            <li key={i}>
              <div className='columns'>
                <a className='note-list-item column' onClick={() => this.setCurrentNote(note)}>{note.title}</a>
                <a className='button is-small is-link is-inverted is-outlined note-list-item column is-narrow' onClick={() => this.deleteNote(note.id)}>Delete</a>
              </div>
            </li>
          )
        })}
      </ul>
    );
  };

  render() {
    return(
      <div className='columns'>
      <div className='column has-background-info is-one-third'>
        <aside className='menu'>
          <div className='sidebar-header-container'>
            <h2 className='menu-label title is-3'>Ya Notes Boy</h2>
            <button className='button is-info is-inverted' onClick={this.newNote}>New Note +</button>
          </div>
          <hr />
          { this.state.loaded ? this.noteList() : null }
        </aside>
      </div>

      <div className='column has-background-info'>
        <div className='note-content'>
          <input className='note-content note-title' value={this.state.activeNote.title} onChange={this.onTitleChange} spellCheck='false' autoFocus='autofocus' />
        </div>

        <hr />

        <div className='note-content'>
          <textarea className='note-content note-body' value={this.state.activeNote.body} onChange={this.onBodyChange} spellCheck='false' />
        </div>

        <div className='field'>
          <div className='file is-link'>
            <label className='file-label'>
              <input className='file-input' type='file' onChange={this.fileUpload}/>
              <span className='file-cta'>
                <span className='file-label'>Attach file ✉️</span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default withFirebase(Notes);
