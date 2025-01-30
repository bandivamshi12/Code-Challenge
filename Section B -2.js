npm install @hashgraph/sdk
const { Client, PrivateKey, AccountId, TopicCreateTransaction, ConsensusMessageSubmitTransaction, ConsensusMessageQuery, Hbar } = require('@hashgraph/sdk');

// Initialize the Hedera client for the Testnet
const client = Client.forTestnet();

// Replace with your actual Hedera account details
client.setOperator(AccountId.fromString('YOUR_ACCOUNT_ID'), PrivateKey.fromString('YOUR_PRIVATE_KEY'));

// Step 1: Create a Consensus Topic
async function createTopic() {
    const createTopicTx = new TopicCreateTransaction()
        .setTopicMemo("My Consensus Topic")  // Optional: You can add a memo
        .setAdminKey(client.operatorPublicKey)  // The admin key for the topic
        .setSubmitKey(client.operatorPublicKey);  // The key used to submit messages to the topic

    const txResponse = await createTopicTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const topicId = receipt.topicId;

    console.log(`Consensus Topic created with ID: ${topicId}`);
    return topicId;
}

// Step 2: Send a message to the Consensus Topic
async function sendMessage(topicId, message) {
    const consensusSubmitTx = new ConsensusMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(message);  // The message you want to send

    const txResponse = await consensusSubmitTx.execute(client);
    const receipt = await txResponse.getReceipt(client);

    console.log(`Message submitted successfully. Status: ${receipt.status}`);
}

// Step 3: Retrieve messages from the Consensus Topic
async function getMessages(topicId) {
    const messageQuery = new ConsensusMessageQuery()
        .setTopicId(topicId)
        .setStartTime(0)  // Optionally, set a start time
        .setMaxQueryPayment(new Hbar(2));  // Maximum fee for the query (in Hbar)

    // Execute the query to fetch the messages
    const response = await messageQuery.execute(client);
    for (let i = 0; i < response.length; i++) {
        console.log(`Message received: ${response[i].contents.toString()}`);
    }
}

// Putting it all together in a main function
async function main() {
    try {
        // Step 1: Create a consensus topic
        const topicId = await createTopic();

        // Step 2: Send messages to the consensus topic
        await sendMessage(topicId, "Hello, this is the first message!");
        await sendMessage(topicId, "This is another message.");

        // Step 3: Retrieve messages from the topic
        console.log("Retrieving messages from the topic...");
        await getMessages(topicId);

    } catch (error) {
        console.error("Error occurred:", error);
    }
}

// Run the main function
main();
