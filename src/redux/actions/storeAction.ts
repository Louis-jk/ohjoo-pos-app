import types from './types';

export function updateStore(store: any) {
  console.log("움직이는가?", store);
  return {
    type: types.UPDATE_STORE,
    storeUpdate: store,
  };
}

export function selectStore(id: string, mt_jumju_id: string, mt_jumju_code: string, mt_store: string, mt_addr: string) {
  return {
    type: types.SELECT_STORE,
    id: id,
    mt_jumju_id: mt_jumju_id,
    mt_jumju_code: mt_jumju_code,
    mt_store: mt_store,
    mt_addr: mt_addr,
  };
}