
const TOKEN_KEY="api_token";

function getToken(){
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(token){
  return localStorage.setItem(TOKEN_KEY,token);
}

function removeToken(){
  localStorage.removeItem(TOKEN_KEY);
}

export {setToken,getToken,removeToken}
