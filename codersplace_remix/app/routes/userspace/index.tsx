import {json, LoaderFunction} from "@remix-run/cloudflare";
import {useLoaderData} from "@remix-run/react";
import {authenticationHandler} from "~/auth";


export const loader: LoaderFunction = async (args) => {
    const {user, octokit} = await authenticationHandler(args)
    const repos = await octokit.rest.repos.listForUser({username: "facebook"})
    return json({user: user.data, repos: repos.data})
}

export default () => {
    const loaderData = useLoaderData<typeof loader>()
    return (
        <div className="container mx-auto ">
            <div className="flex justify-center">
                <div className="text-3xl"> Hi {loaderData.user.login}</div>
            </div>
            <div className="flex flex-wrap gap-8">
                {
                    loaderData.repos.map((repo: any) => <div
                            className="flex flex-col border-black border-2 shadow-md rounded-lg basis-1/4 flex-grow px-3 py-2 divide-y-2">
                        <div><a className="text-3xl" href={`/userspace/${repo.name}`}>{repo.name}</a></div>
                        <div className="h-64">Content</div>

                        </div>

                    )}
            </div>
        </div>
    )
}