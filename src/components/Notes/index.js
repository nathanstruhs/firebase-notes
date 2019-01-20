import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import uuid from 'uuid/v4';
import './index.scss';

const INITIAL_STATE = {
  currentUser: {},
  activeNote: {},
  notes: {},
  loading: false,
  uploading: false,
  uploadingProgress: 0
}

class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE }
  }

  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ currentUser: user });

        this.props.firebase.db.ref(`users/${user.uid}/notes`).on('value', snapShot => {
          const notes = snapShot.val();
          this.setState({ notes, loaded: true });
          if (notes) {
            if (Object.keys(notes).length !== 0) {
              const id = Object.keys(notes)[0];
              const { title, body, attachmentURL } = notes[id];
              this.setState({ activeNote: { id, title, body, attachmentURL }});
            }
          }
        });
      }
    });
  }

  noteList = () => {
    const { notes } = this.state;
    if (notes) {
      if (Object.keys(notes).length > 0) {
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
      }
    }
  };

  newNote = () => {
    const id = uuid();
    const userId = this.state.currentUser.uid;
    const newNote = { id, title: 'New Note', body: 'Add yer content..', attachmentURL: '' }

    this.props.firebase.db.ref(`users/${userId}/notes/${id}`)
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
    const userId = this.state.currentUser.uid;

    const activeNote = { ...this.state.activeNote }
    activeNote.title = event.target.value;

    this.props.firebase.db.ref(`users/${userId}/notes/${activeNote.id}`)

      .update({ title: event.target.value }, (error) => {
        if (error) { console.log(error) }
      });

    this.setState({ activeNote });
  }

  onBodyChange = (event) => {
    const userId = this.state.currentUser.uid;

    const activeNote = { ...this.state.activeNote }
    activeNote.body = event.target.value;

    this.props.firebase.db.ref(`users/${userId}/notes/${activeNote.id}`)
      .update({ body: event.target.value }, (error) => {
        if (error) { console.log(error) }
      });

    this.setState({ activeNote });
  }

  deleteNote = (id) => {
    const userId = this.state.currentUser.uid;

    this.props.firebase.db.ref(`users/${userId}/notes/${id}`)
      .remove((error) => {
        if (error) { console.log(error) }
    });
  }

  fileUpload = (event) => {
    const userId = this.state.currentUser.uid;

    const file = event.target.files[0];
    const activeNote = { ...this.state.activeNote };

    this.props.firebase.file().child(`/users/${userId}/${activeNote.id}/${file.name}`).put(file)
    .on('state_changed',
      (snapshot) => {
        let progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
        this.setState({ uploading: true, uploadingProgress: progress });
      },
      (error) => {
        console.log(error)
      },
      () => {
        this.props.firebase.file().child(`/users/${userId}/${activeNote.id}/${file.name}`).getDownloadURL()
        .then(url => {
          this.updateAttachmentURL(url);
        });
        this.setState({ uploading: false })
    });
  }

  progressBar = () => {
    return (
      <progress className='progress' value={this.state.uploadingProgress} max='100'></progress>
    )
  }

  updateAttachmentURL = (url) => {
    const userId = this.state.currentUser.uid;
    const activeNote = { ...this.state.activeNote };
    activeNote.attachmentURL = url;
    this.props.firebase.db.ref(`users/${userId}/notes/${activeNote.id}`)
      .update({ attachmentURL: url }, (error) => {
        if (error) { console.log(error) }});
    this.setState({ activeNote })
  };

  attachment = () => {
    const attachmentURL = this.state.activeNote.attachmentURL;

    if (attachmentURL !== '') {
      return (
        <div className='attachment'>
          <img src={attachmentURL} alt='attachment' />
          <a href={attachmentURL} className='open-link' target='_blank' download>Open</a>
        </div>
      );
    }
  }

  render() {
    return(
      <div className='columns'>
      <div className='column has-background-info is-one-third'>
        <aside className='menu'>
          <div className='sidebar-header-container'>
            <h2 className='menu-label title is-3'>All Notes</h2>
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
          { (this.state.loaded && this.state.activeNote.attachmentURL) ? this.attachment() : null }
        </div>

        { this.state.uploading ? this.progressBar() : null }

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
