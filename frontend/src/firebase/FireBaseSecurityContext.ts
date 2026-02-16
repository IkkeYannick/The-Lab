import {createContext} from 'react'

export interface ISecurityContext {
    loggedInUser: string | undefined
    loggedUserId: string | undefined
    userRole: string | undefined
    googleLogin: () => void
    handleLogout: () => void
}

export default createContext<ISecurityContext>({
    loggedInUser: undefined,
    loggedUserId: undefined,
    userRole: undefined,
    googleLogin: () => {},
    handleLogout: () => {},
})
