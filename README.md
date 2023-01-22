# NOTE:
## Here some Depandcy require install
    - @project-serum/anchor
    - @solana/wallet-adapter-wallets 
    - @solana/wallet-adapter-react-ui-starter
        *```yarn add @solana/wallet-adapter-wallets @solana/wallet-adapter-react-ui-starter @project-serum/anchor```

## IF you face the webpack issue then follow below link:
    - `https://web3auth.io/docs/troubleshooting/webpack-issues`

## FOR TOKEN EXAMPLE: 
    - Try to create the new keypair by executing this `solana-keygen new -o ./_users/mint.json` and just copy the keypair array in `Tk.js` -> line 35 -> Uint8Array.from(args) as `args` 