import { SignIn } from "@clerk/remix"


export default function SignInPage(){
   return <SignIn routing="path" path="/sign-in"></SignIn>
}