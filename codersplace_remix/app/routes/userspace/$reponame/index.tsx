import {json, LoaderFunction} from "@remix-run/cloudflare";
import {authenticationHandler} from "~/auth";
import {useLoaderData} from "@remix-run/react";
import React from "react";

export const loader: LoaderFunction = async (args) => {
    const {user, octokit} = await authenticationHandler(args)
    const reponame = args.params.reponame || ""
    const commits = await octokit.rest.repos.listCommits({owner: user.data.login, repo: reponame})
    const last_commit = commits.data[0]
    const tree_sha = last_commit.commit.tree.sha
    const tree = await octokit.rest.git.getTree({
        owner: user.data.login,
        repo: reponame,
        tree_sha: tree_sha,
        recursive: "true"
    })
    const file_paths = tree.data.tree.flatMap(tree_file => tree_file.path ? [tree_file.path] : [])

    //@ts-ignore
    return json({file_paths})
}

function FileManager({files}: { files: string[] }) {
    return (
        <div
            className="w-96 h-full border-2 border-solid p-4 divide-y divide-black gap-2 border-red-900 flex-none flex flex-col">
            {files.map((file) => {
                return <a className="w-full text-red-900" key={file}>{file}</a>
            })
            }
        </div>
    )
}

export default () => {
    const loaderData = useLoaderData<typeof loader>()
    return (
        <div className="flex border-2 border-black flex-row flex-grow">
            <FileManager files={loaderData.file_paths}/>
            <div className="border-2 border-green-500 flex-grow"></div>
        </div>
    )
}