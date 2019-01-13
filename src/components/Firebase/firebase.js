import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.db = app.database();
  }

  signUp = (email, password) => (
    this.auth.createUserWithEmailAndPassword(email, password)
  );

  signIn = (email, password) => (
    this.auth.signInWithEmailAndPassword(email, password)
  );

  signInWithGoogle = (email, password) => (
    this.auth.signInWithPopup(this.googleProvider)
  )

  signOut = () => (
    this.auth.signOut()
  );

  user = (uuid) => (
    this.db.ref(`users/${uuid}`)
  );

  users = () => (
    this.db.ref('users')
  );

  note = (uuid) => (
    this.db.ref(`notes/${uuid}`)
  )

  notes = () => (
    this.db.ref('/notes')
  );
}

export default Firebase;
