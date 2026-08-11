(function(global){
  'use strict';
  var Service=global.SemideusesCharacterService;
  var StorageApi=global.SemideusesStorage;
  var Model=global.SemideusesCharacter;
  if(!Service||!StorageApi||!Model)return;

  var FORMAT='semideuses-rpg-3e';
  var MANUAL_BACKUP_KEY='semideuses.characters.manualBackup.v1';
  function safety(){return global.SemideusesReleaseSafety||null;}
  function app(){return global.SemideusesApp||null;}
  function notify(text){var current=app();if(current&&current.notify)current.notify(text);else alert(text);}
  function payload(characters){return {format:FORMAT,edition:'3e',schemaVersion:Model.schemaVersion||5,exportedAt:new Date().toISOString(),characters:characters.map(function(character){return Model.normalize(character);})};}
  function safeName(value){return String(value||'ficha').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-|-$/g,'').toLowerCase()||'ficha';}
  function download(name,data){var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);}
  function exportAll(){var list=Service.list();download('semideuses-backup-'+new Date().toISOString().slice(0,10)+'.json',payload(list));if(safety())safety().recordExternalBackup('characters-file',list.length);return list.length;}
  function exportCharacter(id){var character=Service.get(id);if(!character)throw new Error('Personagem não encontrado.');download(safeName(character.name)+'-nivel-'+character.level+'.json',payload([character]));if(safety())safety().recordExternalBackup('character-file',1);return true;}
  function parse(raw){var data=typeof raw==='string'?JSON.parse(raw):raw;if(!data||data.format!==FORMAT||data.edition!=='3e'||!Array.isArray(data.characters))throw new Error('Arquivo incompatível com Semideuses RPG 3e.');return data.characters.map(function(character){return Model.normalize(character);});}
  function importData(raw,mode){if(mode!=='merge'&&mode!=='replace')throw new Error('Escolha se deseja importar sem apagar ou substituir as fichas atuais.');var incoming=parse(raw),existing=Service.list(),map={};if(safety())safety().snapshot('antes de importar fichas');existing.forEach(function(character){map[character.id]=character;});incoming.forEach(function(character){if(mode==='merge'&&map[character.id]){character.id=Model.uid();character.name=(character.name||'Personagem')+' — importado';}map[character.id]=character;});var finalList=mode==='replace'?incoming:Object.keys(map).map(function(id){return map[id];});StorageApi.writeCharacters(finalList);global.dispatchEvent(new CustomEvent('semideuses:characters-saved',{detail:{count:finalList.length}}));return incoming.length;}
  function manualBackup(){var data=payload(Service.list());localStorage.setItem(MANUAL_BACKUP_KEY,JSON.stringify(data));return data.characters.length;}
  function restoreManualBackup(){var raw=localStorage.getItem(MANUAL_BACKUP_KEY);if(!raw)throw new Error('Nenhuma cópia local encontrada neste aparelho.');var list=parse(raw);if(safety())safety().snapshot('antes de restaurar a cópia local das fichas');StorageApi.writeCharacters(list);if(safety())safety().recommendBackup({kind:'characters-imported',count:list.length});return list.length;}
  function readFile(file,callback){var reader=new FileReader();reader.onerror=function(){callback(new Error('Não foi possível ler o arquivo.'));};reader.onload=function(){callback(null,reader.result);};reader.readAsText(file,'utf-8');}
  function currentCharacter(){var current=app(),editing=current&&current.getEditing&&current.getEditing();return editing&&editing.id?Service.get(editing.id)||editing:null;}
  function dateLabel(value){if(!value)return 'Nenhum arquivo baixado nesta versão.';try{return 'Último arquivo baixado: '+new Date(value).toLocaleString('pt-BR')+'.';}catch(error){return 'Já existe um arquivo baixado.';}}
  function statusCopy(){var current=safety(),status=current&&current.status?current.status():null,external=status&&status.externalBackup;return dateLabel(external&&external.at)+(localStorage.getItem(MANUAL_BACKUP_KEY)?' Há também uma cópia local neste aparelho.':'');}
  function panel(){return '<section class="panel portability-panel" data-portability-list><div><span class="eyebrow">SEGURANÇA DAS FICHAS</span><h3>Backup e importação</h3><p>As fichas ficam neste navegador. Baixe um arquivo para guardar fora do aparelho; a cópia local pode sumir se os dados do navegador forem apagados.</p><small class="portability-status" data-portability-status>'+statusCopy()+'</small></div><div class="portability-actions"><button class="secondary" data-export-all>Baixar backup de todas</button><button class="secondary" data-import-file="merge">Importar sem apagar</button><button class="danger" data-import-file="replace">Substituir por backup</button><button class="secondary" data-manual-backup>Criar cópia neste aparelho</button><button class="secondary" data-restore-manual>Restaurar cópia deste aparelho</button></div><input type="file" accept="application/json,.json" data-import-input hidden></section>';}
  function inject(){
    var listHeading=Array.prototype.find.call(document.querySelectorAll('.section-heading h2'),function(heading){return heading.textContent.trim()==='Personagens';});
    if(listHeading&&!document.querySelector('[data-portability-list]'))listHeading.closest('.section-heading').insertAdjacentHTML('afterend',panel());
    var edit=document.querySelector('[data-edit-current]'),character=currentCharacter();
    if(edit&&character&&!document.querySelector('[data-export-character]'))edit.parentElement.insertAdjacentHTML('beforeend','<button class="secondary" data-export-character="'+character.id+'">Baixar cópia da ficha</button>');
  }
  document.addEventListener('click',function(event){
    var exportOne=event.target.closest('[data-export-character]');if(exportOne){try{exportCharacter(exportOne.dataset.exportCharacter);notify('Cópia da ficha baixada.');}catch(error){alert(error.message);}return;}
    if(event.target.closest('[data-export-all]')){try{var count=exportAll();notify(count+' ficha(s) incluída(s) no arquivo.');}catch(error){alert(error.message);}return;}
    var importer=event.target.closest('[data-import-file]');if(importer){var input=document.querySelector('[data-import-input]');if(input){input.dataset.importMode=importer.dataset.importFile;input.value='';input.click();}return;}
    if(event.target.closest('[data-manual-backup]')){try{notify(manualBackup()+' ficha(s) copiadas neste aparelho.');inject();}catch(error){alert(error.message);}return;}
    if(event.target.closest('[data-restore-manual]')){if(confirm('Restaurar a cópia local e substituir todas as fichas atuais? Uma recuperação automática será criada antes.'))try{notify(restoreManualBackup()+' ficha(s) restauradas. Recarregando…');location.reload();}catch(error){alert(error.message);}return;}
  });
  document.addEventListener('change',function(event){var input=event.target.closest('[data-import-input]');if(!input||!input.files||!input.files[0])return;var mode=input.dataset.importMode;readFile(input.files[0],function(error,raw){if(error){alert(error.message);return;}try{var count=parse(raw).length,message=mode==='replace'?'Substituir todas as fichas atuais pelas '+count+' ficha(s) deste arquivo? Uma recuperação automática será criada antes.':'Importar '+count+' ficha(s) sem apagar as atuais?';if(!confirm(message))return;importData(raw,mode);if(safety())safety().recommendBackup({kind:'characters-imported',count:count});notify(count+' ficha(s) importada(s). Recarregando…');location.reload();}catch(importError){alert(importError.message);}});});
  global.addEventListener('semideuses:rendered',inject);
  global.addEventListener('load',inject);
  inject();
  global.SemideusesPortability={version:'3e-portability-0.2.0',format:FORMAT,manualBackupKey:MANUAL_BACKUP_KEY,payload:payload,parse:parse,exportAll:exportAll,exportCharacter:exportCharacter,importData:importData,manualBackup:manualBackup,restoreManualBackup:restoreManualBackup,inject:inject};
})(window);
