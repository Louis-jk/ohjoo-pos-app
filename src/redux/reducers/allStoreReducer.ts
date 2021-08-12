import types from '../actions/types';

interface Init {
  [key: string]: string;
}

interface State {
  allStore: Init[];
  selectedStore: Init;
}

const defaultState = {
    allStore: [],
    selectedStore: {
      id: '',
      mt_jumju_id: '',
      mt_jumju_code: '',
      mt_store: '',
      mt_addr: ''
    },
    closedStore: []
  };


const store = (state: State = defaultState, action: any) => {
  
  switch (action.type) {
  case types.UPDATE_STORE:
    return {
      ...state,
      allStore: [...action.storeUpdate]
    };
  case types.SELECT_STORE:
    return {
      ...state,
      selectedStore: {
        id: action.id,
        mt_jumju_id: action.mt_jumju_id,
        mt_jumju_code: action.mt_jumju_code,
        mt_store: action.mt_store,
        mt_addr: action.mt_addr
      }
    };
    case types.CLOSED_STORE:
    return {
      ...state,
      closedStore: action.storeClosed
    };
  default:
    return state;
  }
};

export default store;