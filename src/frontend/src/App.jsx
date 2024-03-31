import React, { useState, useEffect } from 'react';
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Suspense } from "react";
import { Physics } from '@react-three/rapier';
import Login from "./components/Login";
import { StoicIdentity } from "ic-stoic-identity";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { createAgent } from "@dfinity/utils";
import { Principal } from '@dfinity/principal';
import './assets/app.css';
import { Actor } from '@dfinity/agent';
import idlFactory from '../candid/ledger.did.js';

function App() {

	const [isUserConnected, setIsUserConnected] = useState(false);
	const [userBalance, setUserBalance] = useState(null); // State to hold the balance
	const [isLoading, setIsLoading] = useState(true);

	const verifyConnection = async () => {
		setIsUserConnected(localStorage.getItem('isConnected') == 'true'); // Update the value of isUserConnected
		if (localStorage.getItem('isConnected')) {
			await fetchBalance();
		}
	};

	// Function to fetch the balance
	const fetchBalance = async () => {
		const whitelist = [process.env.CANISTER_ID_FRONTEND];
		const host = window.location.origin;
		const walletType = localStorage.getItem('walletType');
		const canisterId = 'kttqw-5aaaa-aaaak-afloq-cai';

		setIsLoading(true);

		if (walletType === 'plug') {
			// check for agent
			if (!window.ic.plug.agent) {
				await window.ic.plug.createAgent({ whitelist });
			}
			const principalId = await window.ic.plug.agent.getPrincipal();

			// get plug agent
			const agent = window.ic.plug.agent;

			const actor = Actor.createActor(idlFactory, {
				agent,
				canisterId,
			});

			const balance = await actor.icrc1_balance_of({
				owner: principalId,
				subaccount: [],
			});
			
			setUserBalance(balance);
			setIsLoading(false);
		}
		else if (walletType === 'stoic') {
			const principalId = localStorage.getItem('stoicIdentity');
			// console.log(identity);
			const identity =await StoicIdentity.load();
			console.log(identity);
			const agent = await createAgent({
				identity,
				host: host,
			});
			

			const actor = Actor.createActor(idlFactory, {
				agent,
				canisterId,
			});
			// console.log(actor);

			const balance = await actor.icrc1_balance_of({
				owner: Principal.fromText('44eio-obkrg-k6wts-mqhod-67syw-ksqdc-gprqi-zs5en-s3lk2-2ecmq-6ae'),
				subaccount: [],
			});
			console.log(balance);
		}
		else {
			console.log('No wallet connected');
		}
	};

	const handleLogout = async () => {
		const wallet = localStorage.getItem("walletType");
		switch (wallet) {
			case "plug":
				window.ic.plug.disconnect();
				localStorage.removeItem("plugPrincipalId");
				break;
			case "stoic":
				await StoicIdentity.disconnect();
				localStorage.removeItem("stoicPrincipalId");
				break;
			default:
				console.error("No login method found");
				break;
		}
		localStorage.removeItem("walletType");
		localStorage.setItem('isConnected', 'false');
		setIsUserConnected(false); // Update the connection state
		setUserBalance(null); // Optionally reset the user balance or other related state
	};

	useEffect(() => {
		verifyConnection();
	}, []);

	return (
		<>
			{isUserConnected == true ? (
				<div className="balance-container">
					<h1>Balance : {isLoading ? "Fetching..." : (`${userBalance}`)}</h1>
					<button className='logout-button' onClick={handleLogout}>Logout</button>
				</div>
				// <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
				//   <Suspense>
				//     <Physics>
				//       <color attach="background" args={["#ececec"]} />
				//       <Experience />
				//     </Physics>
				//   </Suspense>
				// </Canvas>
			) : (
				// Render the Login component if not connected
				<Login onConnected={async () => {
					setIsUserConnected(true);
					await fetchBalance();
				}} />
			)}
		</>
	);
}

export default App;
