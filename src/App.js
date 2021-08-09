import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Forms } from "./pages/Forms";
import { Maps } from './pages/Maps';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/forms" component={Forms} />
        <Route exact path="/" component={Maps} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
