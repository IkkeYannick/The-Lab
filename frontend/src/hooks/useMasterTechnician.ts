import {useEffect, useState} from "react";
import {addDoc, collection, onSnapshot} from "firebase/firestore";
import {firestore} from '../firebase/FireBaseSecurityContextProvider.tsx';

interface MasterTechnician {
    name: string;
    email: string;
    id?: string;
    isAvailable: boolean;
}

export const useMasterTechnician = () => {
    const [masterTechnicians, setMasterTechnicians] = useState<MasterTechnician[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const masterTechniciansCollectionRef = collection(firestore, 'masterTechnicians');

    const isMasterTechnician = (email: string) => {
        if (masterTechnicians.length === 0) {
            return false;
        }
        for (const technician of masterTechnicians) {
            if (technician.email.toLowerCase() === email.toLowerCase()) {
                return true;
            }
        }
        return false;
    };

    const addMasterTechnician = async (name: string, email: string) => {
        const masterTechnician: MasterTechnician = {
            name,
            email,
            isAvailable: true,
        };
        try {
            await addDoc(masterTechniciansCollectionRef, masterTechnician);
        } catch (error) {
            console.error('Error adding master technician:', error);
            setError('Error adding master technician');
        }
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(masterTechniciansCollectionRef, (snapshot) => {
            const masterTechniciansData: MasterTechnician[] = [];
            snapshot.forEach((doc) => {
                masterTechniciansData.push({...doc.data(), id: doc.id} as MasterTechnician);
            });
            setMasterTechnicians(masterTechniciansData);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching master technicians:', error);
            setError('Error fetching master technicians');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return {
        isMasterTechnician,
        addMasterTechnician,
        masterTechnicians,
        loading,
        error,
    };
};