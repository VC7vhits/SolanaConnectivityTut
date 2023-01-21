import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { CoinbaseWalletAdapter, PhantomWalletAdapter, SolletWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import React, { FC, ReactNode, useMemo } from 'react';
import { Program, web3 } from '@project-serum/anchor'
import Tk from './Tk';

require('@solana/wallet-adapter-react-ui/styles.css');

const App = () => {
    return (
        <Context>
            <Content />
        </Context>
    );
};
export default App;

const Context = ({ children }) => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolletWalletAdapter(),
            new CoinbaseWalletAdapter(),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content = () => {
    const wallet = useWallet();
    const network = WalletAdapterNetwork.Devnet;
    const connection = new web3.Connection(clusterApiUrl(network));

    const handleSendSol = async () => {
        let sender = wallet.publicKey;
        let receiver = new web3.PublicKey('7D6StyJSfQJ2d28weVscUn4frrsi9VLeQDCi8uvRtx63')

        let ix = web3.SystemProgram.transfer({ fromPubkey: sender, toPubkey: receiver, lamports: 100 });
        let tx = new web3.Transaction();
        tx.add(ix);

        let res = await wallet.sendTransaction(tx, connection, { preflightCommitment: 'finalized' })


        console.log("Trasaction Result: ", res);
    }

    return (
        <div className="App">
            <WalletMultiButton />
            {/* <h2> Hello </h2>
            <button onClick={async () => {
                await handleSendSol()
            }}>send Sol</button> */}

            <Tk />

        </div>
    );
};