import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";


export function headers(){
    return{
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin"
    }
}


export default function UserSpace(){
    const [container, setContainer] = useState<WebContainer>()

    useEffect(() => {
        WebContainer.boot().then((webcontainerInstance)=>{
            setContainer(webcontainerInstance)
        });
    }, [setContainer])
    async function startDevServer(){
        if(container) {
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
    return( 
        <div> 
            <button onClick={startDevServer}>Press me haha</button>
            {container && <div>Container ready</div>}
            {!container && <div>Container not ready</div>}
        </div>
    )
}


