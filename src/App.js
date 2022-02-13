import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { UserContextProvider } from './contexts/user';
import { isAuthenticated } from './services/auth';

import { Forms } from "./pages/Forms";
import { Login } from './pages/Login';
import { Maps } from './pages/Maps';

function App() {
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
      isAuthenticated() ?
        <Component {...props} />
        :
        <Redirect to='/login' />
    )} />
  );

  return (
    <BrowserRouter>
      <Switch>
        <UserContextProvider>
          <PrivateRoute path="/forms" component={Forms} />
          <Route path="/login" component={Login} />
          <Route exact path="/" component={Maps} />
        </UserContextProvider>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
