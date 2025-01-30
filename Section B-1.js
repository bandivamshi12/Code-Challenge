npm install @hashgraph/sdk
const { Client, PrivateKey, AccountId, TokenCreateTransaction, TokenType, TokenSupplyType, Hbar, TransferTransaction, TokenAssociateTransaction } = require('@hashgraph/sdk');

// Create a client for the Hedera testnet
const client = Client.forTestnet();
client.setOperator(AccountId.fromString('YOUR_ACCOUNT_ID'), PrivateKey.fromString('YOUR_PRIVATE_KEY'));

// Step 1: Create a fungible token
async function createFungibleToken() {
    // Generate a new private key for the token admin
    const tokenAdminKey = PrivateKey.generate();

    const tokenCreateTx = new TokenCreateTransaction()
        .setTokenName("My Fungible Token")  // Token Name
        .setTokenSymbol("MFT")             // Token Symbol
        .setDecimals(2)                    // Number of decimals
        .setTokenType(TokenType.FungibleCommon)
        .setInitialSupply(1000000)          // Initial supply of tokens
        .setTreasuryAccountId(client.operatorAccountId)  // Treasury Account
        .setAdminKey(tokenAdminKey.publicKey)              // Admin Key for token control
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(1000000);             // Max supply of the token

    // Execute the transaction and get the token ID
    const response = await tokenCreateTx.execute(client);
    const receipt = await response.getReceipt(client);
    const tokenId = receipt.tokenId;
    
    console.log(`Token created successfully! Token ID: ${tokenId}`);
    return tokenId;
}

// Step 2: Transfer tokens from one account to another
async function transferTokens(tokenId, fromAccountId, fromPrivateKey, toAccountId, amount) {
    // Create transfer transaction for fungible token
    const transferTx = new TransferTransaction()
        .addTokenTransfer(tokenId, fromAccountId, -amount) // Deduct from sender
        .addTokenTransfer(tokenId, toAccountId, amount);  // Add to receiver

    // Execute the transfer transaction
    const transferResponse = await transferTx.execute(client);
    const transferReceipt = await transferResponse.getReceipt(client);

    console.log(`Transfer successful! Status: ${transferReceipt.status}`);
}

// Step 3: Associate token with an account
async function associateTokenToAccount(accountId, privateKey, tokenId) {
    const associateTx = new TokenAssociateTransaction()
        .addToken(tokenId)
        .setAccountId(accountId)
        .freezeWith(client);

    // Sign the transaction with the private key of the account
    const signedTx = await associateTx.sign(privateKey);

    // Execute the transaction
    const response = await signedTx.execute(client);
    const receipt = await response.getReceipt(client);

    console.log(`Token association completed: ${receipt.status}`);
}

async function main() {
    try {
        // Step 1: Create the fungible token
        const tokenId = await createFungibleToken();

        // Step 2: Associate the token with the sender and receiver account
        const senderAccountId = AccountId.fromString('SENDER_ACCOUNT_ID'); // Replace with the sender's Account ID
        const senderPrivateKey = PrivateKey.fromString('SENDER_PRIVATE_KEY'); // Replace with sender's private key
        const receiverAccountId = AccountId.fromString('RECEIVER_ACCOUNT_ID'); // Replace with the receiver's Account ID

        await associateTokenToAccount(senderAccountId, senderPrivateKey, tokenId);
        await associateTokenToAccount(receiverAccountId, senderPrivateKey, tokenId);

        // Step 3: Transfer tokens from sender to receiver
        const amount = 1000; // Specify the number of tokens to transfer
        await transferTokens(tokenId, senderAccountId, senderPrivateKey, receiverAccountId, amount);

    } catch (error) {
        console.error("Error occurred:", error);
    }
}

// Run the main function
main();
