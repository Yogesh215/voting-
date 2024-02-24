import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [voterId, setVoterId] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [voteStatus, setVoteStatus] = useState('');

  useEffect(() => {
    // Fetch the list of candidates from the server
    fetch('http://localhost:5000/candidates')
      .then(response => response.json())
      .then(data => setCandidates(data));
  }, []);

  const onSubmitHandler = async function () {
    // Check if the voter has already voted
    const response = await fetch(`http://localhost:5000/checkVote/${voterId}`);
    const hasVoted = await response.json();

    if (hasVoted) {
      // If voted, show an error message or disable the submit button
      setVoteStatus('You have already voted.');
      setSubmitDisabled(true);
    } else {
      // Otherwise, proceed with the vote submission
      await fetch('http://localhost:5000/', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          "voterId": voterId,
          "selectedCandidate": selectedCandidate,
        })
      });

      // Update the UI to indicate that the vote was successful
      setVoteStatus('Vote submitted successfully!');
      setSubmitDisabled(true); // Disable further submissions to prevent multiple votes
    }
  }

  const onChainHandler = async function () {
    const temp = await fetch('http://localhost:5000/instance');
    const i = await temp.json();
    console.log(i);
  }

  const checkLead = async function () {
    const temp = await fetch('http://localhost:5000/checkLead');
    const result = await temp.json();
    console.log(result);
  }
  

  const addCandidate = () => {
    const newCandidate = prompt('Enter the name of the new candidate:');
    if (newCandidate) {
      setCandidates([...candidates, newCandidate]);
      // Add the new candidate to the server
      fetch('http://localhost:5000/addCandidate', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          "candidateName": newCandidate,
        })
      });
    }
  }

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="input-group my-3">
        <span className="input-group-text">Voter ID</span>
        <input type="text" className="form-control" value={voterId} onChange={(e) => setVoterId(e.target.value)} />
      </div>
      <div className="mb-3">
        {candidates.map((candidate, index) => (
          <div key={index} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="candidateRadio"
              id={`candidate${index}`}
              value={candidate}
              onChange={(e) => setSelectedCandidate(e.target.value)}
            />
            <label className="form-check-label" htmlFor={`candidate${index}`}>
              {candidate}
            </label>
          </div>
        ))}
      </div>
      <div>
        <button type="button" className="btn btn-primary mx-3" onClick={onSubmitHandler} >Submit</button>
        <button type="button" className="btn btn-primary" onClick={onChainHandler}>Check Chain</button>
        <button type="button" className="btn btn-primary" onClick={checkLead}>get Winner</button>
        <button type="button" className="btn btn-success" onClick={addCandidate}>Add Candidate</button>
      </div>
      {voteStatus && <p style={{ marginTop: '10px', color: 'green' }}>{voteStatus}</p>}
    </div>
  );
}

export default App;
