(function(global){
  'use strict';

  var VERSION='1.0.0-rc.1';
  var META_KEY='semideuses.release.meta.v1';
  var SNAPSHOT_KEY='semideuses.release.snapshot.v1';
  var ROLLBACK_KEY='semideuses.release.rollback.v1';
  var PENDING_KEY='semideuses.release.backupPending.v1';
  var EXTERNAL_KEY='semideuses.release.externalBackup.v1';
  var StorageApi=global.SemideusesStorage,Model=global.SemideusesCharacter;
  var host=null,migrationResult={status:'pending',version:VERSION};

  function clone(value){return JSON.parse(JSON.stringify(value));}
  function readJson(key,fallback){try{var value=JSON.parse(localStorage.getItem(key)||'null');return value==null?fallback:value;}catch(error){return fallback;}}
  function writeJson(key,value){localStorage.setItem(key,JSON.stringify(value));return value;}
  function protectedKey(key){return key===SNAPSHOT_KEY||key===ROLLBACK_KEY||key===PENDING_KEY||key===EXTERNAL_KEY||key===META_KEY;}
  function collect(){
    var values={};
    for(var index=0;index<localStorage.length;index++){
      var key=localStorage.key(index);
      if(key&&key.indexOf('semideuses.')===0&&!protectedKey(key))values[key]=localStorage.getItem(key);
    }
    return values;
  }
  function snapshot(reason,key){
    var values=collect(),names=Object.keys(values);
    if(!names.length)return null;
    var data={format:'semideuses-recovery-snapshot',version:1,appVersion:VERSION,createdAt:new Date().toISOString(),reason:String(reason||'manual'),values:values};
    try{writeJson(key||SNAPSHOT_KEY,data);return clone(data);}catch(error){return null;}
  }
  function parseSnapshot(raw){
    var data=typeof raw==='string'?JSON.parse(raw):raw;
    if(!data||data.format!=='semideuses-recovery-snapshot'||!data.values||typeof data.values!=='object')throw new Error('Cópia de recuperação inválida.');
    return data;
  }
  function restoreSnapshot(raw){
    var data=parseSnapshot(raw||readJson(SNAPSHOT_KEY,null));
    snapshot('antes de restaurar uma cópia anterior',ROLLBACK_KEY);
    var current=collect();Object.keys(current).forEach(function(key){localStorage.removeItem(key);});
    Object.keys(data.values).forEach(function(key){localStorage.setItem(key,data.values[key]);});
    writeJson(META_KEY,{appVersion:VERSION,characterSchema:Number(Model&&Model.schemaVersion||0),restoredAt:new Date().toISOString(),restoredSnapshotAt:data.createdAt});
    return clone(data);
  }
  function hasData(){return Object.keys(collect()).length>0;}
  function migrate(){
    if(!StorageApi||!Model){migrationResult={status:'unavailable',version:VERSION};return migrationResult;}
    var previous=readJson(META_KEY,{}),schema=Number(Model.schemaVersion||0);
    if(previous.appVersion===VERSION&&Number(previous.characterSchema||0)===schema){migrationResult={status:'current',version:VERSION,characterSchema:schema};return migrationResult;}
    var safetyCopy=hasData()?snapshot('antes da atualização para '+VERSION):null;
    try{
      StorageApi.migrate();
      var current=StorageApi.readCharacters(),normalized=current.map(function(character){return Model.normalize(character);});
      if(JSON.stringify(current)!==JSON.stringify(normalized)){
        if(hasData()&&!safetyCopy)throw new Error('Não há espaço para criar a cópia de segurança da atualização. Exporte as fichas antes de continuar.');
        StorageApi.writeCharacters(normalized);
      }
      if(global.SemideusesMasterCampaign)global.SemideusesMasterCampaign.read();
      if(global.SemideusesMasterRuntime)global.SemideusesMasterRuntime.exportData();
      if(global.SemideusesEncounterCalculator)global.SemideusesEncounterCalculator.read();
      writeJson(META_KEY,{appVersion:VERSION,characterSchema:schema,migratedAt:new Date().toISOString(),previousVersion:previous.appVersion||'',snapshotAt:safetyCopy&&safetyCopy.createdAt||''});
      migrationResult={status:'migrated',version:VERSION,characterSchema:schema,snapshot:!!safetyCopy};
    }catch(error){
      migrationResult={status:'failed',version:VERSION,error:error.message};
      try{global.dispatchEvent(new CustomEvent('semideuses:migration-failed',{detail:clone(migrationResult)}));}catch(ignore){}
    }
    return clone(migrationResult);
  }
  function pending(){return readJson(PENDING_KEY,null);}
  function clearPending(){localStorage.removeItem(PENDING_KEY);removeReminder();}
  function recordExternalBackup(kind,count){
    var record={kind:String(kind||'arquivo'),count:Number(count||0),at:new Date().toISOString(),appVersion:VERSION};
    writeJson(EXTERNAL_KEY,record);localStorage.removeItem(PENDING_KEY);removeReminder();
    try{global.dispatchEvent(new CustomEvent('semideuses:backup-recorded',{detail:clone(record)}));}catch(error){}
    return record;
  }
  function recommendBackup(payload){
    payload=Object.assign({kind:'characters-updated',at:new Date().toISOString()},payload||{});writeJson(PENDING_KEY,payload);scheduleReminder();return clone(payload);
  }
  function removeReminder(){if(host&&host.parentNode)host.parentNode.removeChild(host);host=null;}
  function reminderCopy(item){
    if(item.kind==='character-created')return {title:'Sua ficha foi criada',text:'Ela está salva neste navegador. Baixe uma cópia agora para não depender somente deste aparelho.',button:'Baixar cópia da ficha'};
    if(item.kind==='master-imported')return {title:'Campanha restaurada',text:'Os dados do Mestre foram substituídos. Baixe uma cópia atualizada para guardar fora do navegador.',button:'Baixar backup do Mestre'};
    return {title:'Fichas importadas',text:'A importação terminou. Baixe uma cópia atualizada para ter um ponto seguro de recuperação.',button:'Baixar backup atualizado'};
  }
  function exportPending(item){
    try{
      if(item.kind==='master-imported'&&global.SemideusesMasterBackup){global.SemideusesMasterBackup.download();return;}
      if(!global.SemideusesPortability)throw new Error('A exportação ainda não está disponível.');
      if(item.kind==='character-created'&&item.characterId)global.SemideusesPortability.exportCharacter(item.characterId);
      else global.SemideusesPortability.exportAll();
    }catch(error){alert(error.message);}
  }
  function mountReminder(){
    var item=pending();if(!item||host||!document.body)return;
    var copy=reminderCopy(item);host=document.createElement('aside');host.className='release-backup-reminder';host.setAttribute('data-release-backup-reminder','');host.setAttribute('role','region');host.setAttribute('aria-label','Proteção dos dados');
    host.innerHTML='<div><span class="eyebrow">PROTEÇÃO DOS DADOS</span><strong>'+copy.title+'</strong><p>'+copy.text+'</p></div><div><button type="button" class="primary" data-release-backup-now>'+copy.button+'</button><button type="button" class="secondary" data-release-backup-later>Fazer depois</button></div>';
    document.body.appendChild(host);
    host.querySelector('[data-release-backup-now]').onclick=function(){exportPending(item);};
    host.querySelector('[data-release-backup-later]').onclick=clearPending;
  }
  function scheduleReminder(){setTimeout(mountReminder,0);}
  function status(){return {version:VERSION,migration:clone(migrationResult),snapshot:readJson(SNAPSHOT_KEY,null),externalBackup:readJson(EXTERNAL_KEY,null),pending:pending()};}

  global.SemideusesReleaseSafety={version:VERSION,keys:{meta:META_KEY,snapshot:SNAPSHOT_KEY,rollback:ROLLBACK_KEY,pending:PENDING_KEY,external:EXTERNAL_KEY},collect:collect,snapshot:snapshot,restoreSnapshot:restoreSnapshot,migrate:migrate,recommendBackup:recommendBackup,recordExternalBackup:recordExternalBackup,clearPending:clearPending,status:status};
  global.addEventListener('semideuses:rendered',scheduleReminder);
  global.addEventListener('load',scheduleReminder);
  migrationResult=migrate();scheduleReminder();
})(window);
