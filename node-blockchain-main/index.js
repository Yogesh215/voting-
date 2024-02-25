const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 5000;
app.use(express.json());
const { Chain, Transaction, Block, Wallet } = require('./driver');

const votedVoters = new Set(); // Set to store voted voters
const candidates = []; // Array to store the list of candidates
app.post('/addCandidate', (req, res) => {
  const { candidateName } = req.body;
  const candidateWallet = new Wallet();
  if (candidateName && !candidates.includes(candidateName)) {
    candidates[candidateName] = {'public_key':candidateWallet.publicKey,'private_key':candidateWallet.privateKey};
    res.status(200).json({ message: 'Candidate added successfully.' });
  } else {
    res.status(400).json({ error: 'Invalid candidate name or candidate already exists.' });
  }
});

app.get('/candidates', (req, res) => {
  res.send(candidates);
});

app.get('/checkVote/:voterId', (req, res) => {
  const { voterId } = req.params;
  // Check if the voter has already voted
  if (votedVoters.has(voterId)) {
    res.json(true); // Voter has already voted
  } else {
    res.json(false); // Voter has not voted yet
  }
});

app.post('/', (req, res) => {
  const { voterId, selectedCandidate } = req.body;
  const WalletInstance = new Wallet();

  // Check if the voter has already voted
  if (votedVoters.has(voterId)) {
    res.status(400).json({ error: 'You have already voted.' });
  } else {
    // Otherwise, proceed with the vote submission
    console.log(`${voterId} has voted for ${selectedCandidate}`);
    votedVoters.add(voterId); // Add the voter to the voted set

    WalletInstance.sendMoney(selectedCandidate, candidates[selectedCandidate].public_key);

    res.sendStatus(200);
  }
});


{/**

wallet = voters -> create instance dynamically at the time of voting
amount = selected candidates
checkLead -> verify for tampering winner
*/}

app.get('/instance', (req, res) => {
  res.send(Chain.instance);
});

app.get('/checkLead', (req, res) => {
  const {winner} = Chain.instance.checkLead();
  res.send({winner})
});

app.listen(port, () => console.log('server running on ', port));
