import {json, LoaderFunction} from "@remix-run/cloudflare";
import {useLoaderData} from "@remix-run/react";
import {authenticationHandler} from "~/auth";


export const loader: LoaderFunction = async (args) => {
    const {user, octokit} = await authenticationHandler(args)
    const repos = await octokit.rest.repos.listForUser({username: user.data.login})
    return json({user: user.data, repos: repos.data})
}

export default () => {
    const loaderData = useLoaderData<typeof loader>()
    return (
        <div>
            <div className="flex justify-center">
                <div className="text-3xl"> Hi {loaderData.user.login}</div>
            </div>
            <div>
                <ul>{loaderData.repos.map((repo: any) => <li><a href={`/userspace/${repo.name}`}>{repo.name}</a>
                </li>)}</ul>
            </div>
        </div>
    )
}