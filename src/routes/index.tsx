import React from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';

import Check from '../screens/Check';
import Login from '../screens/Login';
import Main from '../screens/Main';
import OrderNew from '../screens/OrderNew';
import OrderCheck from '../screens/OrderCheck';
import OrderDelivery from '../screens/OrderDelivery';
import OrderDone from '../screens/OrderDone';
import SetStoreTime from '../screens/SetStoreTime';


export default function Routes() {
  return (
    <HashRouter>
      <Switch>
        <Route path='/' component={Check} exact />
        <Route path='/login' component={Login} />
        <Route path='/main' component={Main} />
        <Route path='/order_new' component={OrderNew} />
        <Route path='/order_check' component={OrderCheck} />
        <Route path='/order_delivery' component={OrderDelivery} />
        <Route path='/order_done' component={OrderDone} />
        <Route path='/set_storetime' component={SetStoreTime} />
        <Route render={({ location }) => (
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ color: 'red' }}>존재하지 않는 페이지입니다.</h2>
            <p>{location.pathname}</p>
          </div>
        )}
        />
      </Switch>
    </HashRouter>
  )
}