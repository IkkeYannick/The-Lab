import {useState} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";
import {firestore} from "../firebase/FireBaseSecurityContextProvider.tsx";


export interface Call {
    id: string;
    status: string;
    callId: string;
    date: any
    duration: number;
    technician: string;
}

const useCalls = () => {

    const [waitingCalls, setWaitingCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [allCalls, setAllCalls] = useState<Call[]>([]);
    const [callsToday, setCallsToday] = useState<number>(0);

    const fetchWaitingCalls = async () => {
        try {
            const q = query(collection(firestore, 'calls'), where('status', '==', 'waiting'));
            const querySnapshot = await getDocs(q);
            const calls: Call[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Call[];
            // Sort calls by date
            calls.sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());
            setWaitingCalls(calls);
        } catch (err) {
            setError('Failed to fetch waiting calls:' + err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllCalls = async () => {
        try {
            const q = query(collection(firestore, 'calls'));
            const querySnapshot = await getDocs(q);
            const calls: Call[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Call[];
            // Sort calls by date
            calls.sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());
            setAllCalls(calls);
        } catch (err) {
            setError('Failed to fetch waiting calls:' + err);
        } finally {
            setLoading(false);
        }
    }

    const fetchCallsToday = async () => {
        try {
            const twentyFourHoursAgo = new Date();
            twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

            const q = query(collection(firestore, 'calls'), where('date', '>=', twentyFourHoursAgo));
            const querySnapshot = await getDocs(q);
            setCallsToday(querySnapshot.size);
        } catch (err) {
            setError('Failed to fetch calls today:' + err);
        } finally {
            setLoading(false);
        }
    }


    return {waitingCalls, loading, error, allCalls, fetchAllCalls, fetchWaitingCalls, fetchCallsToday, callsToday};

}

export default useCalls;