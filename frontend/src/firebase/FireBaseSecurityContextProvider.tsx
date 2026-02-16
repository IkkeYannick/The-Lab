// Import specific Firebase modules needed
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged} from "firebase/auth";
import FireBaseSecurityContext from "./FireBaseSecurityContext.ts";
import {ReactNode, useEffect, useState} from "react";
import {useMasterTechnician} from "../hooks/useMasterTechnician.ts";
import {useFieldTechnician} from "../hooks/useFieldTechnician.ts";

// Firebase configuration
const fireBaseSecurityContextProvider = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app
const app = initializeApp(fireBaseSecurityContextProvider);

// Initialize Firestore
const firestore = getFirestore(app);

// eslint-disable-next-line react-refresh/only-export-components
export {app, firestore};

interface IWithChildren {
    children: ReactNode
}

export default function FireBaseSecurityContextProvider({children}: IWithChildren) {
    const [loggedInUser, setLoggedInUser] = useState<string | undefined>(undefined)
    const [loggedUserId, setLoggedUserId] = useState<string | undefined>(undefined)
    const [userRole, setUserRole] = useState<string | undefined>(undefined)
    const {isMasterTechnician} = useMasterTechnician()
    const {isFieldTechnician} = useFieldTechnician()

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedUserId(user.uid);
                setLoggedInUser(user.email || undefined);
                if (user.email) {
                    if (isMasterTechnician(user.email)) {
                        setUserRole('masterTechnician');
                    } else if (isFieldTechnician(user.email)) {
                        setUserRole('fieldTechnician');
                    } else {
                        setUserRole('user');
                    }
                }
            }
        });

        return () => unsubscribe();
    }, [isMasterTechnician, isFieldTechnician]);

    async function googleLogin() {
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        const auth = getAuth();
        signInWithPopup(auth, provider).then((value) => {
            if (value.user) {
                setLoggedUserId(value.user.uid);
                if (value.user.email) {
                    setLoggedInUser(value.user.email);
                    if (isMasterTechnician(value.user.email)) {
                        setUserRole('masterTechnician');
                        window.location.href = '/Dashboard';
                    } else if (isFieldTechnician(value.user.email)) {
                        setUserRole('fieldTechnician');
                        window.location.href = '/FieldCallPage';
                    } else {
                        setUserRole('user');
                        window.location.href = '/';
                    }
                }
            }
        }).catch(console.log);
    }

    function handleLogout() {
        console.log('Logging out');
        const auth = getAuth();
        auth.signOut().then(() => {
            setLoggedUserId(undefined);
            setLoggedInUser(undefined);
            setUserRole(undefined);
            console.log('User logged out successfully');
            window.location.href = '/';
        }).catch(console.log);
    }

    return (
        <FireBaseSecurityContext.Provider
            value={{
                googleLogin,
                handleLogout,
                loggedInUser,
                loggedUserId,
                userRole
            }}
        >
            {children}
        </FireBaseSecurityContext.Provider>
    )
}
