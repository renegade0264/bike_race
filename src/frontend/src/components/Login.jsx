import React from 'react';
import PlugConnect from '@psychedelic/plug-connect';
import { StoicIdentity } from "ic-stoic-identity";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { createAgent } from "@dfinity/utils";
import '../assets/login.css';

function Login({ onConnected }) {
    //function for plug wallet
    const whitelist = [process.env.CANISTER_ID];
    const handlePlugConnect = async () => {
        // check if plug extension is installed
        if (window.ic && window.ic.plug) {
            try {
                const publicKey = await window.ic.plug.requestConnect({ whitelist });
                // console.log(publicKey);
            } catch (e) {
                console.log(e);
            }
            if (!window.ic.plug.agent) {
                await window.ic.plug.createAgent({ whitelist });
            }

            localStorage.setItem('walletType', 'plug');
            localStorage.setItem('isConnected', 'true');
            localStorage.setItem('plugPrincipalId', JSON.stringify(window.ic.plug.principalId));
            onConnected();
        }
    };

    //function for stoic wallet
    const handleStoicConnect = async () => {
        StoicIdentity.load().then(async identity => {
            if (identity === false) {
                identity = await StoicIdentity.connect();
            }
            // display the connected principal!
            // console.log(identity);
            localStorage.setItem('walletType', 'stoic');
            localStorage.setItem('isConnected', 'true');
            localStorage.setItem('stoicPrincipalId', JSON.stringify(identity._principal.toText()));
            // localStorage.setItem('stoicIdentity',identity)
            // console.log(localStorage.getItem('stoicIdentity'));
            onConnected();
        })
    };

    return (
        <div className="outer-container">
            <div id='main'>
                <h1>Connect</h1>
                <button
                    className="stoic-button"
                    onClick={handlePlugConnect}
                >
                    <img src="/plug-logo.png" className="plug-icon" /> Plug Wallet
                </button>
                <button
                    className="stoic-button"
                    onClick={handleStoicConnect}
                >
                    <img src="/stoic.png" className="stoic-icon" /> Stoic Wallet
                </button>
            </div>
        </div>
    );
}

export default Login;