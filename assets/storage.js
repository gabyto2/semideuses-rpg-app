(function(){
'use strict';

var CURRENT_KEY='semideuses.characters.v4';
var LEGACY_KEYS=['semideuses.characters.v3','semideuses.characters.v2','semideuses.characters.v1'];
var BACKUP_KEY='semideuses.characters.backup.v1';
var originalGet=Storage.prototype.getItem;
var originalSet=Storage.prototype.setItem;
var originalRemove=Storage.prototype.removeItem;

function clone(value){return JSON.parse(JSON.stringify(value));}
function parseArray(raw){
  if(!raw)return [];
  var parsed=JSON.parse(raw);
  if(!Array.isArray(parsed))throw new Error('O armazenamento de personagens não contém uma lista válida.');
  return parsed;
}
function rawGet(key){return originalGet.call(localStorage,key);}
function rawSet(key,value){return originalSet.call(localStorage,key,value);}
function rawRemove(key){return originalRemove.call(localStorage,key);}
function findExistingRaw(){
  var current=rawGet(CURRENT_KEY);
  if(current)return current;
  for(var i=0;i<LEGACY_KEYS.length;i++){
    var legacy=rawGet(LEGACY_KEYS[i]);
    if(legacy)return legacy;
  }
  return null;
}
function migrate(){
  var current=rawGet(CURRENT_KEY);
  if(current){parseArray(current);return false;}
  var legacy=findExistingRaw();
  if(!legacy)return false;
  parseArray(legacy);
  rawSet(CURRENT_KEY,legacy);
  return true;
}
function readCharacters(){
  migrate();
  return clone(parseArray(rawGet(CURRENT_KEY)||'[]'));
}
function writeCharacters(characters){
  if(!Array.isArray(characters))throw new Error('Tentativa de salvar personagens em formato inválido.');
  var previous=rawGet(CURRENT_KEY);
  if(previous)rawSet(BACKUP_KEY,previous);
  rawSet(CURRENT_KEY,JSON.stringify(characters));
  window.dispatchEvent(new CustomEvent('semideuses:characters-saved',{detail:{count:characters.length}}));
  return true;
}
function restoreBackup(){
  var backup=rawGet(BACKUP_KEY);
  if(!backup)return false;
  parseArray(backup);
  rawSet(CURRENT_KEY,backup);
  return true;
}
function transaction(mutator){
  if(typeof mutator!=='function')throw new Error('A transação precisa receber uma função.');
  var list=readCharacters();
  var result=mutator(list);
  writeCharacters(list);
  return result;
}
function getById(id){return readCharacters().find(function(c){return c&&c.id===id;})||null;}
function upsert(character){
  if(!character||!character.id)throw new Error('Personagem sem identificador.');
  transaction(function(list){
    var index=list.findIndex(function(c){return c&&c.id===character.id;});
    if(index>=0)list[index]=clone(character);else list.unshift(clone(character));
  });
  return true;
}
function removeById(id){
  transaction(function(list){
    for(var i=list.length-1;i>=0;i--)if(list[i]&&list[i].id===id)list.splice(i,1);
  });
  return true;
}

window.SemideusesStorage={
  version:1,
  keys:{current:CURRENT_KEY,backup:BACKUP_KEY,legacy:LEGACY_KEYS.slice()},
  readCharacters:readCharacters,
  writeCharacters:writeCharacters,
  getById:getById,
  upsert:upsert,
  removeById:removeById,
  transaction:transaction,
  restoreBackup:restoreBackup,
  migrate:migrate
};

/* Ponte temporária: o app antigo continua usando localStorage, mas todas as
   gravações da chave de personagens passam pela validação e pelo backup único. */
Storage.prototype.getItem=function(key){
  if(this===localStorage&&key===CURRENT_KEY){
    try{migrate();}catch(error){console.error('[SemideusesStorage] Falha na migração:',error);}
  }
  return originalGet.call(this,key);
};
Storage.prototype.setItem=function(key,value){
  if(this===localStorage&&key===CURRENT_KEY){
    var parsed=parseArray(String(value));
    return writeCharacters(parsed);
  }
  return originalSet.call(this,key,value);
};
Storage.prototype.removeItem=function(key){
  return originalRemove.call(this,key);
};

try{migrate();}catch(error){console.error('[SemideusesStorage] Falha ao iniciar:',error);}
})();
