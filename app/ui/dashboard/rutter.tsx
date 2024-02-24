"use client";
import { Button } from '@/app/ui/button';
import { useRutterLink } from "react-rutter-link";
import { createConnection } from '@/app/lib/rutterBackend';

const PUBLIC_KEY =
    process.env.NEXT_PUBLIC_RUTTER_PUBLIC_KEY || "RUTTER_PUBLIC_KEY";

export default function ConnectRutter() {
    const config = {
        publicKey: PUBLIC_KEY,
        onSuccess: (publicToken: String) => {
            // We call our NextJS backend API in pages/api/rutter.js
            // It exchanges the publicToken for an access_token and makes an API call to /orders/get
            console.log(publicToken);
            console.log("Creating connection");
            createConnection(publicToken).then((connection) => {
                console.log(connection);
            });
        },
    };
    const { open, ready, error } = useRutterLink(config);

    function handleClick() {
        console.log("Opening Rutter Link");
        open();
        console.log("Rutter Link opened");
    }
    return (
        <div>
            <Button onClick={handleClick}  >Connect Accounting System</Button>
        </div>
    )
}