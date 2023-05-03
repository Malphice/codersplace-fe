import type {MetaFunction, LoaderFunction, LinksFunction} from "@remix-run/cloudflare";
import stylesheet from "~/tailwind.css";
import {rootAuthLoader} from "@clerk/remix/ssr.server";
import {ClerkApp} from "@clerk/remix";
import {ClerkCatchBoundary} from "@clerk/remix";


import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "New Remix App",
    viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
    {rel: "stylesheet", href: stylesheet},
];

// Clerk
export const loader: LoaderFunction = (args) => rootAuthLoader(args);
export const CatchBoundary = ClerkCatchBoundary();


function App() {
    return (
        <html lang="en">
        <head>
            <Meta/>
            <Links/>
        </head>
        <body>
        <div className="flex border-2 border-blue-500 flex-col h-screen">
            <div className="flex border-2 border-red-500 flex-row h-16"/>
            <Outlet/>
        </div>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        </body>
        </html>
    );
}

export default ClerkApp(App)
