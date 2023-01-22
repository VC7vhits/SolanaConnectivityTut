import { web3, Program, AnchorProvider } from '@project-serum/anchor'
import { SystemStateCoder } from '@project-serum/anchor/dist/cjs/coder/system/state';
import {
    getAssociatedTokenAddressSync,
    getAssociatedTokenAddress,
    MINT_SIZE,
    createInitializeMintInstruction,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
    createTransferInstruction,
    createBurnInstruction,
    TOKEN_PROGRAM_ID,
    getAccount,
    getMint,
} from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react';

const {
    PublicKey,
    Keypair,
    Connection,
    SystemInstruction
} = web3;

const log = console.log;

export const Tk = () => {
    const wallet = useWallet();
    const { publicKey } = useWallet()
    const connection = new Connection("https://api.devnet.solana.com", { commitment: 'finalized' });

    const user = publicKey;
    let ixs = [];

    const skBuffer = Uint8Array.from([180, 49, 156, 226, 36, 112, 36, 84, 11, 136, 89, 39, 233, 15, 56, 189, 188, 183, 227, 138, 9, 98, 247, 233, 73, 196, 89, 246, 237, 30, 150, 37, 174, 226, 82, 172, 17, 101, 143, 206, 131, 254, 251, 141, 202, 152, 210, 3, 173, 119, 102, 41, 67, 43, 112, 28, 150, 43, 136, 228, 132, 137, 80, 40])
    const mint = Keypair.fromSecretKey(skBuffer);

    const getTokenBalance = async (mint, owner) => {
        let ata = getAssociatedTokenAddressSync(mint, owner);

        const ataInfo = await connection.getAccountInfo(ata);
        if (ataInfo == null) return 0;

        const _ataInfo = await getAccount(connection, ata);

        const mintInfo = await getMint(connection, mint);
        const decimal = mintInfo.decimals;

        return parseInt(_ataInfo.amount.toString()) / (10 ** decimal);
    }

    async function _sendTransaction() {
        const tx = new web3.Transaction();
        tx.add(...ixs);
        ixs = [];

        const res = await wallet.sendTransaction(tx, connection);
        log("Tx Sign: ", res);
    }


    const handleCreateToken = async () => {
        log("Creating : ", mint.publicKey.toBase58())

        if (user == null) throw "unable to find the wallet publickey"

        const rent = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

        let ix1 = web3.SystemProgram.createAccount({
            fromPubkey: user,
            lamports: rent,
            newAccountPubkey: mint.publicKey,
            programId: TOKEN_PROGRAM_ID,
            space: MINT_SIZE,
        })

        let ix2 = createInitializeMintInstruction(
            mint.publicKey,
            5,
            user,
            user,
        );

        let tx = new web3.Transaction();
        tx.add(ix1, ix2);

        let res = await wallet.sendTransaction(tx, connection, { signers: [mint] });
        log("Result : ", res);
    }

    const handleTokenBalance = async () => {
        // const key = new PublicKey("FUKSnd2hoM5d4rVFfKSV3soP3FXZqUJU5mZdyQorDHyB")

        const key = user
        const _mint = new PublicKey("AEebUMF2WxAtDqHP3tUgJCZwySvk3zGC4JQ5dH8uBFaH")
        let res = await getTokenBalance(mint.publicKey, key);
        log("Res: ", res);
    }

    const handleMinting = async () => {
        let ata = getAssociatedTokenAddressSync(mint.publicKey, user);

        log("Ata: ", ata.toBase58());

        let ataInfo = await connection.getAccountInfo(ata);
        let ixs = [];

        if (ataInfo == null) {
            const ix = createAssociatedTokenAccountInstruction(
                user,
                ata,
                user,
                mint.publicKey,
            );

            log("Added instruction to init tokenAccount")
            ixs.push(ix);
        }

        const ix = createMintToInstruction(mint.publicKey, ata, user, 1000_00);
        ixs.push(ix);

        const tx = new web3.Transaction();
        tx.add(...ixs);
        // for(let i of ixs){
        //     tx.add(i);
        // }

        const res = await wallet.sendTransaction(tx, connection);
        log("res:", res);
    }

    const handleTransferToken = async () => {
        const receiver = new web3.PublicKey("GPv247pHoMhA6MFdLmzXzA9JdmVgn6g1VvLUS8kn38Ej")
        const receiverAta = getAssociatedTokenAddressSync(mint.publicKey, receiver);
        const sender = publicKey
        const senderAta = getAssociatedTokenAddressSync(mint.publicKey, sender);

        log("Receiver Ata: ", receiverAta.toBase58());

        let ataInfo = await connection.getAccountInfo(receiverAta);
        let ixs = [];

        if (ataInfo == null) {
            const ix = createAssociatedTokenAccountInstruction(
                user,
                receiverAta,
                receiver,
                mint.publicKey,
            );

            log("Added instruction to init tokenAccount")
            ixs.push(ix);
        }

        let ix = createTransferInstruction(senderAta, receiverAta, sender, 1000_00);
        ixs.push(ix);

        const tx = new web3.Transaction();
        tx.add(...ixs);

        const res = await wallet.sendTransaction(tx, connection);
        log("res: ", res);
    }

    const handleBurnToken = async () => {
        const ata = getAssociatedTokenAddressSync(mint.publicKey, user);
        const ix = createBurnInstruction(ata, mint.publicKey, user, 50000);
        ixs.push(ix);

        await _sendTransaction();
    }

    return <>
        <hr></hr>
        <hr></hr>
        <center><h3>Tokens</h3></center>
        <hr></hr>
        <hr></hr>

        <h5>Mint: {mint.publicKey.toBase58()}</h5>
        <h5>Balance : { }</h5>

        <br></br>
        <button onClick={handleCreateToken}>Create Token</button>
        <button onClick={handleMinting}>Mint Token</button>
        <button onClick={handleTransferToken}>Transfer Token</button>
        <button onClick={handleBurnToken}> Burn Token </button>

        <hr></hr>
        <button onClick={handleTokenBalance}>CLICK</button>

    </>
}
export default Tk;