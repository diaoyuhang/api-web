export default function getRouterParams(){

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const routerParams = {};
  urlParams.forEach((value, key) => {
    routerParams[key] = value;
  });

  return routerParams;
}
