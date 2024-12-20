import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from '../../firebaseConfig'; // Import auth and db from firebaseConfig
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"; // Import updateProfile
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { Route, Redirect, useHistory } from 'react-router-dom';

const AuthContext = createContext();

const getUser = user => {
  const { uid, email, displayName, phoneNumber } = user;
  return { uid, email, name: displayName, phone: phoneNumber };
}

const Auth = () => {
  const [user, setUser] = useState(null);
  const [index, setIndex] = useState(0); // Add index state
  const history = useHistory(); // Use useHistory hook

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async function (user) {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        const currentUser = user ? { ...getUser(user), ...userData } : {};
        setUser(currentUser);
        console.log('User signed in:', currentUser);
      } else {
        setUser(null);
        console.log('No user signed in');
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleChange = (newIndex) => () => {
    setIndex(newIndex);
  };

  //***************** sign in with popup Start ************************
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
      .then(async result => {
        const signedInUser = getUser(result.user);
        setUser(signedInUser);
        console.log('Signed in with Google:', signedInUser);
        // Store user data in Firestore
        const userDoc = doc(db, 'users', result.user.uid);
        await setDoc(userDoc, {
          email: signedInUser.email,
          name: signedInUser.name,
          phone: signedInUser.phone || ''
        }, { merge: true });
        window.history.back();
        return result.user;
      })
      .catch(error => {
        setUser({ error: error.message });
        console.error('Error signing in with Google:', error);
        return error.message;
      })

  }

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password) // Corrected to use signInWithEmailAndPassword
      .then(result => {
        const signedInUser = getUser(result.user); // Ensure user is set correctly
        setUser(signedInUser);
        console.log('Signed in:', signedInUser);
        return result.user;
      })
      .catch(error => {
        setUser({ error: error.message });
        console.error('Error signing in:', error);
        throw error; // Throw error to be caught in the SignUp component
      })
  }

  const signUp = (email, password, name, phone) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async result => {
        const currentUser = result.user;
        if (currentUser) {
          await updateProfile(currentUser, {
            displayName: name
          });
          // Store user data in Firestore
          const userDoc = doc(db, 'users', currentUser.uid);
          await setDoc(userDoc, {
            email: currentUser.email,
            name: name,
            phone: phone
          });
          // Fetch the updated user data from Firestore
          const updatedUserDoc = await getDoc(userDoc);
          const updatedUserData = updatedUserDoc.exists() ? updatedUserDoc.data() : {};
          const signedUpUser = { ...getUser(currentUser), ...updatedUserData }; // Merge Firestore data with auth data
          setUser(signedUpUser);
          console.log('Signed up:', signedUpUser);
          history.push("/"); // Redirect to the main page
          return result.user;
        } else {
          throw new Error("User not found after sign up");
        }
      })
      .catch(error => {
        setUser({ error: error.message });
        console.error('Error signing up:', error);
        return error.message;
      })
  }

  const signOutUser = () => {
    return signOut(auth)
      .then(result => {
        setUser(null);
        console.log('Signed out');
        return true;
      })
      .catch(error => {
        console.error('Error signing out:', error);
        return error.message;
      })
  }

  return {
    user,
    setUser, // Provide setUser function
    signIn,
    signUp,
    signOut: signOutUser,
    signInWithGoogle,
    index, // Provide index state
    handleChange // Provide handleChange function
  }
}

export const AuthProvider = props => {
  const auth = Auth();
  return <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);

//***************** Redirect review item to signIn ************************
export const PrivateRoute = ({ children, path, ...rest }) => {
  const { user } = useAuth(); // Use user state for authentication check
  console.log("output", children);
  console.log("user", user);
  return (
    <Route
      {...rest}
      path={path}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/signup",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}