// datetime.js
export let rangedateset1 = null;
export let rangedateset2 = null;

export let btn_id = null;

export function setDateRange1(val) {
  rangedateset1 = val;
}
export function setDateRange2(val) {
  rangedateset2 = val;
}
export function getDateRange1() {
  return rangedateset1;
}
export function getDateRange2() {
  return rangedateset2;
}

export function set_btn_id(val) {
  btn_id = val;
}

export function get_btn_id() {
  if (btn_id === null) {
    return 'top-center'
  } else {
    return btn_id;
  }
}