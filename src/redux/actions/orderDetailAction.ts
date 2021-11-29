import types from './types';

export function updateOrderDetail(data: string) {
  const args = JSON.parse(data);
  console.log('order detail args', args);

  return {
    type: types.UPDATE_ORDER_DETAIL,
    order: args.order,
    product: args.orderDetail,
    store: args.store,
  };
}
