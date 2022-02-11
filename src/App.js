import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Forms } from "./pages/Forms";
import { Login } from './pages/Login';
import { Maps } from './pages/Maps';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/forms"  component={Forms} />
        <Route path="/login"  component={Login}/>
        <Route exact path="/" component={Maps} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
