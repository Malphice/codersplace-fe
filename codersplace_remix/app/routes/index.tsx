import { getAuth } from "@clerk/remix/ssr.server";
import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export async function loader(args:any){
  const { userId, sessionId, getToken } = await getAuth(args);
  // fetch data
  return json({userId, sessionId});
}

export default function Index() {
  const authData = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {authData.userId}
    </div>

  );
}
