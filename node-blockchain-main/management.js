const { Wallet } = require('./driver'); // Adjust the path based on your actual file structure

const voterWallet = new Wallet();

function submitVote(voterId, selectedCandidate) {
  // Logic to submit a vote using voterWallet.sign
  const dataToSign = '${voterId}-${selectedCandidate}-${Date.now()}';
  const signature = voterWallet.sign(dataToSign);
  
  const signatureString = `${signature.r}${signature.s}`;

  // Now you can pass the signatureString to the server or use it as needed
  // Example: send the data and signatureString to the server using a fetch or other method
  fetch('http://localhost:5000/submitVote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      voterId,
      selectedCandidate,
      signature: signatureString,
    }),
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  // Now you can use the signature or submit it to the server
  // Example: send the data and signature to the server using a fetch or other method
}

module.exports = { voterWallet, submitVote };
