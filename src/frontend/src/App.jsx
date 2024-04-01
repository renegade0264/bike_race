import React, { useState, useEffect } from 'react';
import Login from "./components/Login";
import { StoicIdentity } from "ic-stoic-identity";
import { Principal } from '@dfinity/principal';
import './assets/app.css';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../candid/ledger.did.js';
import { createAgent } from '@dfinity/utils';

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
	const fetchBalance = async (identity1) => {
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

			//get balance
			const balance = await actor.icrc1_balance_of({
				owner: principalId,
				subaccount: [],
			});
			const decimals = await actor.icrc1_decimals();
			const balanceFormatted = (Number(balance) / (10 ** decimals)).toFixed(2);

			setUserBalance(balanceFormatted);
			setIsLoading(false);
		}

		else if (walletType === 'stoic') {
			const principalId = localStorage.getItem('stoicPrincipalId');
			const args = {};
			args.identity = await StoicIdentity.load();
			args.host = 'https://ic0.app';
			const agent = new HttpAgent(args)
			if (process.env.NODE_ENV === 'development') {
				agent.fetchRootKey()
			}

			const actor = Actor.createActor(idlFactory, {
				agent,
				canisterId,
			});

			//get balance
			const balance = await actor.icrc1_balance_of({
				owner: Principal.fromText(principalId),
				subaccount: [],
			});
			const decimals = await actor.icrc1_decimals();
			const balanceFormatted = (Number(balance) / (10 ** decimals)).toFixed(2);

			setUserBalance(balanceFormatted);
			setIsLoading(false);
		}
		else {
			console.log('No wallet connected');
		}
	};

	const handleLogout = () => {
		const wallet = localStorage.getItem("walletType");
		switch (wallet) {
			case "plug":
				window.ic.plug.disconnect();
				localStorage.removeItem("plugPrincipalId");
				break;
			case "stoic":
				StoicIdentity.disconnect();
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

	useEffect(() => {
		if (isUserConnected) {
			const script = document.createElement('script');
			script.src = './app.js'
			script.async = true;
			document.body.appendChild(script);

			// clean up when the component unmounts or user logs out
			return () => {
				// document.body.removeChild(script);
			};
		}
	}, [isUserConnected]);

	return (
		<>
			{isUserConnected == true ? (
				<>
					<div className="balance-container">
						<h1>Balance : {isLoading ? "Fetching..." : (`${userBalance}`)}</h1>
						<button className='logout-button' onClick={handleLogout}>Logout</button>
					</div>
					<div id="unity-container" className="unity-desktop">
						<canvas id="unity-canvas" width="960" height="600"></canvas>
						<div id="unity-loading-bar">
							<div id="unity-logo"></div>
							<div id="unity-progress-bar-empty">
								<div id="unity-progress-bar-full"></div>
							</div>
						</div>
						<div id="unity-warning"> </div>
						<div id="unity-footer">
							<div id="unity-webgl-logo"></div>
							<div id="unity-fullscreen-button"></div>
							<div id="unity-build-title">Bike Racing</div>
						</div>
					</div>
				</>
			) : (
				// Render the Login component if not connected
				<Login onConnected={async () => {
					setIsUserConnected(true);
					await fetchBalance();
				}} />
			)
			}
		</>
	);
}

export default App;
