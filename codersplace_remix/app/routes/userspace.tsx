import { WebContainer } from "@webcontainer/api";
import { Suspense, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import React from "react";
import { defer, json } from "@remix-run/cloudflare";
import { Await, useLoaderData } from "@remix-run/react";

export function headers() {
    return {
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin"
    }
}
const files = [
    {
        name: "test.py",
        language: "python",
        content: "print('Hello World')"
    },
    {
        name: "test.js",
        language: "javascript",
        content: "console.log('Hello World')"
    }
]

async function getRepo(a:number){
    await new Promise(resolve => setTimeout(resolve, a))
    return {reponame:"abc"}
}

export async function loader(){
    const repo = getRepo(3000)
    return defer({repo})
}


function FileManager({fileIndex, setFileIndex}:{fileIndex:number, setFileIndex:any}) {
    return (
        <div className="w-52 h-full border-2 border-solid border-red-900 flex-none flex flex-col">
            {files.map((file, index) => {
                    if (index===fileIndex){
                        return <button className="text-red-900" onClick={() => setFileIndex(index)} key={file.name}>{file.name}</button>
                    }
                    else{
                        return <button onClick={() => setFileIndex(index)} key={file.name}>{file.name}</button>
                    }
                })
            }
        </div>
    )
}

function IDE() {
    const [fileIndex, setFileIndex] = useState(0)
    return (
            <div className="flex h-screen">
                <FileManager fileIndex={fileIndex} setFileIndex={setFileIndex}></FileManager>
                <div className="grow border-solid border-2 border-black">
                    <Editor
                        height="50vh"
                        defaultLanguage={files[0].language}
                        defaultValue={files[0].content}
                        language={files[fileIndex].language}
                        value={files[fileIndex].content}
                    />
                </div>
                <FileManager fileIndex={fileIndex} setFileIndex={setFileIndex}></FileManager>
            </div>
    )
}

export default function UserSpace() {
    const [container, setContainer] = useState<WebContainer>()
    const repo = useLoaderData<typeof loader>()

    useEffect(() => {
        WebContainer.boot().then((webcontainerInstance) => {
            setContainer(webcontainerInstance)
        });
    }, [setContainer])
    async function startDevServer() {
        if (container) {
            const installProcess = await container.spawn('turbo', ['--help']);
            const installExitCode = await installProcess.exit;
            if (installExitCode !== 0) {
                throw new Error('Unable to run npm version');
            }
            installProcess.output.pipeTo(new WritableStream({
                write(data) {
                    console.log(data);
                }
            }));
        }
        console.log("Container was not ready")
    }
    return (
        <div>
            <button onClick={startDevServer}>Press me haha</button>
            {container && <div>Container ready</div>}
            {!container && <div>Container not ready</div>}
            <Suspense fallback={<div>Loading</div>}>
                <Await resolve={repo.repo}>
                    {(promise) => promise.reponame}
                </Await>
            </Suspense>
            <IDE></IDE>
        </div>
    )
}


