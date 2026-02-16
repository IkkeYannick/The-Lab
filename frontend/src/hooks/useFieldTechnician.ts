import {useEffect, useState} from "react";
import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    setDoc,
    deleteDoc,
    where,
    query,
    getDocs
} from "firebase/firestore";
import {firestore} from '../firebase/FireBaseSecurityContextProvider.tsx';

interface FieldTechnician {
    name: string;
    email: string;
    needsHelp: boolean;
    id?: string;
    loginCode: string;
}

export const useFieldTechnician = () => {
    const [fieldTechnician, setFieldTechnician] = useState<FieldTechnician | null>(null);
    const [fieldTechnicians, setFieldTechnicians] = useState<FieldTechnician[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fieldTechniciansCollectionRef = collection(firestore, 'fieldTechnicians');

    const addFieldTechnician = async (name: string, email: string) => {
        const fieldTechnician: FieldTechnician = {
            name,
            email,
            needsHelp: false,
            loginCode: Math.floor(Math.random() * 100000).toString(),
        };
        try {
            await addDoc(fieldTechniciansCollectionRef, fieldTechnician);
        } catch (error) {
            console.error('Error adding field technician:', error);
            setError('Error adding field technician');
        }
    };

    const updateFieldTechnician = async (fieldTechnician: FieldTechnician) => {
        try {
            const fieldTechnicianDocRef = doc(firestore, 'fieldTechnicians', fieldTechnician.id!);
            await setDoc(fieldTechnicianDocRef, fieldTechnician);
        } catch (error) {
            console.error('Error updating field technician:', error);
            setError('Error updating field technician');
        }
    };

    const removeFieldTechnician = async (id: string) => {
        try {
            const fieldTechnicianDocRef = doc(firestore, 'fieldTechnicians', id);
            await deleteDoc(fieldTechnicianDocRef);
        } catch (error) {
            console.error('Error removing field technician:', error);
            setError('Error removing field technician');
        }
    };

    const isFieldTechnician = (email: string) => {
        if (fieldTechnicians.length === 0) {
            return false;
        }
        for (const technician of fieldTechnicians) {
            if (technician.email.toLowerCase() === email.toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    const checkCodeLogin = async (code: string) => {
        console.log('Checking code:', code);
        const q = query(fieldTechniciansCollectionRef, where('loginCode', '==', code));
        const querySnapshot = await getDocs(q);
        console.log('Query snapshot:', querySnapshot);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const fieldTechnician = {...doc.data(), id: doc.id} as FieldTechnician;
            console.log('Field technician:', fieldTechnician);
            setFieldTechnician({...doc.data(), id: doc.id} as FieldTechnician);
            return fieldTechnician;
        }
        return null;
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(fieldTechniciansCollectionRef, (snapshot) => {
            const fieldTechniciansData: FieldTechnician[] = [];
            snapshot.forEach((doc) => {
                fieldTechniciansData.push({...doc.data(), id: doc.id} as FieldTechnician);
            });
            setFieldTechnicians(fieldTechniciansData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return {
        fieldTechnician,
        fieldTechnicians,
        loading,
        error,
        addFieldTechnician,
        updateFieldTechnician,
        removeFieldTechnician,
        isFieldTechnician,
        checkCodeLogin
    };
};