import {getAuth} from "@clerk/remix/ssr.server";
import {createClerkClient} from "@clerk/remix/api.server";
import {Octokit} from "@octokit/rest";
import {DataFunctionArgs} from "@remix-run/cloudflare";

export async function authenticationHandler(args: DataFunctionArgs) {
    const {userId} = await getAuth(args)
    const defaultUid = userId || ""

    const tokens = await createClerkClient({
        //@ts-ignore
        apiKey: args.context.CLERK_SECRET_KEY
        //@ts-ignore
    }).users.getUserOauthAccessToken(defaultUid, 'github')

    const token = tokens[0].token

    const octokit = new Octokit({
        "auth": token
    })

    const user = await octokit.rest.users.getAuthenticated()
    return {user, octokit}

}
