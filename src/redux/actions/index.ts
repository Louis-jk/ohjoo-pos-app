import * as loginAction from './loginAction';
import * as orderAction from './orderAction';
import * as orderDetailAction from './orderDetailAction';
import * as storeAction from './storeAction';
// import * as idxAction from './idxAction';
// import * as gpsAction from './gpsAction';
// import * as sconfAction from './sconfAction';
// import * as couponAction from './couponAction';
// import * as regularHolidayAction from './regularHolidayAction';
// import * as storeTimeAction from './storeTimeAction';
// import * as closedDayAction from './closedDayAction';

const ActionCreators = Object.assign(
  {},
  loginAction,
  orderAction,
  orderDetailAction,
  storeAction,
  // idxAction,
  // gpsAction,
  // sconfAction,
  // couponAction,
  // regularHolidayAction,
  // storeTimeAction,
  // closedDayAction,
);

export default ActionCreators;
