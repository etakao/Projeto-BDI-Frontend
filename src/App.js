import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Forms } from "./pages/Forms";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/forms" component={Forms} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
