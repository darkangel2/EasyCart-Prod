import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from '../../firebaseConfig'; // Import auth and db from firebaseConfig
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"; // Import updateProfile
import { collection, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { Route, Redirect, useHistory } from 'react-router-dom';

const AuthContext = createContext();

const getUser = user => {
    const { email, displayName } = user;
    return { email, name: displayName };
}

const Auth = () => {

    const [user, setUser] = useState(null);
    const history = useHistory(); // Use useHistory hook

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, function (user) {
            if (user) {
                const currentUser = getUser(user); // Corrected to use getUser function
                setUser(currentUser);
                console.log('User signed in:', currentUser);
            } else {
                setUser(null);
                console.log('No user signed in');
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

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
                    name: signedInUser.name
                });
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
                window.history.back();
                return result.user;
            })
            .catch(error => {
                setUser({ error: error.message });
                console.error('Error signing in:', error);
                return error.message;
            })
    }

    const signUp = (email, password, name) => {
        return createUserWithEmailAndPassword(auth, email, password)
            .then(async result => {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    await updateProfile(currentUser, {
                        displayName: name
                    });
                    const signedUpUser = getUser(currentUser); // Ensure user is set correctly
                    setUser(signedUpUser);
                    console.log('Signed up:', signedUpUser);
                    // Store user data in Firestore
                    const userDoc = doc(db, 'users', currentUser.uid);
                    await setDoc(userDoc, {
                        email: signedUpUser.email,
                        name: signedUpUser.name
                    });
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
        signIn,
        signUp,
        signOut: signOutUser,
        signInWithGoogle
    }
}

export const AuthProvider = props => {
  const auth = Auth();
  return <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);

//***************** Redirect review item to signIn ************************
export const PrivateRoute = ({ children, ...rest }) => {
    const { user } = useAuth(); // Use user state for authentication check
    return (
        <Route
            {...rest}
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