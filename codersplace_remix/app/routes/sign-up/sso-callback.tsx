import { AuthenticateWithRedirectCallback } from "@clerk/remix"

export default function AuthRedirect(){
    return <AuthenticateWithRedirectCallback></AuthenticateWithRedirectCallback>
}