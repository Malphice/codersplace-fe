import {json, LoaderFunction} from "@remix-run/cloudflare";
import {authenticationHandler} from "~/auth";
import {useLoaderData} from "@remix-run/react";

export const loader: LoaderFunction = async (args) => {
    const {user, octokit} = await authenticationHandler(args)
    const reponame = args.params.reponame || ""
    const repo = await octokit.rest.repos.get({repo: reponame, owner: user.data.login})
    return json({repo})
}

export default () => {
    const loaderData = useLoaderData<typeof loader>()
    return (
        <pre>
            {JSON.stringify(loaderData, null, 2)}
        </pre>
    )
}