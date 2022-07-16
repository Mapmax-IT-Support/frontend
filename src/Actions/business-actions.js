export const UPDATE_BUSINESS_TYPE = 'business_type:updateBusinessType';

export function updateBusinessType(type) {
    return {
      type: UPDATE_BUSINESS_TYPE,
      payload: {
        business_type: type
      }
    }
}
