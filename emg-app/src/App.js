import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import RegisterPatient from './RegisterPatient';
import AccessHistory from './AccessHistory';
import StartTest from './StartTest';
import HistoryResults from './HistoryResults'; // Import HistoryResults component

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/register-patient" component={RegisterPatient} />
          <Route path="/access-history" component={AccessHistory} />
          <Route path="/start-test" component={StartTest} />
          <Route path="/history-results" component={HistoryResults} /> 
        </Switch>
      </div>
    </Router>
  );
}

export default App;
