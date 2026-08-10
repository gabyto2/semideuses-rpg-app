(function(global){
  'use strict';

  var KEY='semideuses.master.campaign.v1',VERSION=1,TYPES=['sessions','npcs','locations','threads'];

  function clone(value){return JSON.parse(JSON.stringify(value));}
  function text(value,max){return String(value==null?'':value).trim().slice(0,max||2000);}
  function uid(type){return type+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);}
  function option(value,allowed,fallback){value=String(value||'');return allowed.indexOf(value)>=0?value:fallback;}
  function empty(){return {version:VERSION,name:'Minha campanha',summary:'',privateNotes:'',sessions:[],npcs:[],locations:[],threads:[],updatedAt:new Date().toISOString()};}
  function normalizeEntry(type,raw){
    raw=raw&&typeof raw==='object'?raw:{};var base={id:text(raw.id,100)||uid(type),createdAt:text(raw.createdAt,40)||new Date().toISOString(),updatedAt:text(raw.updatedAt,40)||new Date().toISOString()};
    if(type==='sessions')return Object.assign(base,{title:text(raw.title,100)||'Sessão sem título',date:text(raw.date,10),summary:text(raw.summary,6000)});
    if(type==='npcs')return Object.assign(base,{name:text(raw.name,100)||'NPC sem nome',role:text(raw.role,120),status:option(raw.status,['Ativo','Aliado','Neutro','Inimigo','Desaparecido','Morto','Desconhecido'],'Ativo'),notes:text(raw.notes,4000)});
    if(type==='locations')return Object.assign(base,{name:text(raw.name,120)||'Local sem nome',region:text(raw.region,120),status:option(raw.status,['Disponível','Inacessível','Perdido','Destruído','Desconhecido'],'Disponível'),notes:text(raw.notes,4000)});
    return Object.assign(base,{title:text(raw.title,120)||'Fio sem título',kind:option(raw.kind,['Pista','Profecia','Mistério','Missão'],'Pista'),status:option(raw.status,['Aberta','Revelada','Resolvida','Falhou','Arquivada'],'Aberta'),notes:text(raw.notes,4000)});
  }
  function normalize(raw){
    raw=raw&&typeof raw==='object'?raw:{};var state=empty();
    state.name=text(raw.name,100)||state.name;state.summary=text(raw.summary,2000);state.privateNotes=text(raw.privateNotes,12000);state.updatedAt=text(raw.updatedAt,40)||state.updatedAt;
    TYPES.forEach(function(type){state[type]=(Array.isArray(raw[type])?raw[type]:[]).map(function(item){return normalizeEntry(type,item);}).slice(0,200);});
    return state;
  }
  function read(){try{return normalize(JSON.parse(localStorage.getItem(KEY)||'null'));}catch(error){return empty();}}
  function write(raw){var saved=normalize(raw);saved.updatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(saved));global.dispatchEvent(new CustomEvent('semideuses:campaign-updated',{detail:{campaign:clone(saved)}}));return clone(saved);}
  function update(mutator){var state=read(),result=mutator(clone(state))||state;return write(result);}
  function validate(type,payload){var field=type==='sessions'||type==='threads'?'title':'name';if(!text(payload&&payload[field],120))throw new Error(type==='sessions'?'Informe o título da sessão.':type==='npcs'?'Informe o nome do NPC.':type==='locations'?'Informe o nome do local.':'Informe o título da pista, profecia, mistério ou missão.');}
  function setOverview(payload){payload=payload||{};return update(function(state){state.name=payload.name;state.summary=payload.summary;state.privateNotes=payload.privateNotes;return state;});}
  function add(type,payload){if(TYPES.indexOf(type)<0)throw new Error('Tipo de registro inválido.');validate(type,payload);return update(function(state){var entry=normalizeEntry(type,Object.assign({},payload,{id:uid(type),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}));state[type].unshift(entry);return state;});}
  function edit(type,id,payload){if(TYPES.indexOf(type)<0)throw new Error('Tipo de registro inválido.');validate(type,payload);return update(function(state){var index=state[type].findIndex(function(item){return item.id===id;});if(index<0)throw new Error('Registro não encontrado.');state[type][index]=normalizeEntry(type,Object.assign({},state[type][index],payload,{id:id,updatedAt:new Date().toISOString()}));return state;});}
  function remove(type,id){if(TYPES.indexOf(type)<0)throw new Error('Tipo de registro inválido.');return update(function(state){state[type]=state[type].filter(function(item){return item.id!==id;});return state;});}

  global.SemideusesMasterCampaign={version:'master-campaign-0.1.0',storageKey:KEY,types:TYPES.slice(),read:read,write:write,setOverview:setOverview,add:add,edit:edit,remove:remove};
})(window);
