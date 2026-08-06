(function(global){
  'use strict';
  var Service=global.SemideusesCharacterService;
  var StorageApi=global.SemideusesStorage;
  var Model=global.SemideusesCharacter;
  var App=global.SemideusesApp;
  if(!Service||!StorageApi||!Model)return;

  var FORMAT='semideuses-rpg-3e';
  var MANUAL_BACKUP_KEY='semideuses.characters.manualBackup.v1';
  function payload(characters){return {format:FORMAT,edition:'3e',schemaVersion:Model.schemaVersion||5,exportedAt:new Date().toISOString(),characters:characters.map(function(character){return Model.normalize(character);})};}
  function safeName(value){return String(value||'ficha').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-|-$/g,'').toLowerCase()||'ficha';}
  function download(name,data){var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);}
  function exportAll(){var list=Service.list();download('semideuses-backup-'+new Date().toISOString().slice(0,10)+'.json',payload(list));return list.length;}
  function exportCharacter(id){var character=Service.get(id);if(!character)throw new Error('Personagem não encontrado.');download(safeName(character.name)+'-nivel-'+character.level+'.json',payload([character]));return true;}
  function parse(raw){var data=typeof raw==='string'?JSON.parse(raw):raw;if(!data||data.format!==FORMAT||data.edition!=='3e'||!Array.isArray(data.characters))throw new Error('Arquivo incompatível com Semideuses RPG 3e.');return data.characters.map(function(character){return Model.normalize(character);});}
  function importData(raw,mode){var incoming=parse(raw),existing=Service.list(),map={};existing.forEach(function(character){map[character.id]=character;});incoming.forEach(function(character){if(mode!=='replace'&&map[character.id]){character.id=Model.uid();character.name=(character.name||'Personagem')+' — importado';}map[character.id]=character;});var finalList=mode==='replace'?incoming:Object.keys(map).map(function(id){return map[id];});StorageApi.writeCharacters(finalList);global.dispatchEvent(new CustomEvent('semideuses:characters-saved',{detail:{count:finalList.length}}));return incoming.length;}
  function manualBackup(){var data=payload(Service.list());localStorage.setItem(MANUAL_BACKUP_KEY,JSON.stringify(data));return data.characters.length;}
  function restoreManualBackup(){var raw=localStorage.getItem(MANUAL_BACKUP_KEY);if(!raw)throw new Error('Nenhum backup manual encontrado neste aparelho.');var list=parse(raw);StorageApi.writeCharacters(list);return list.length;}
  function readFile(file,callback){var reader=new FileReader();reader.onerror=function(){callback(new Error('Não foi possível ler o arquivo.'));};reader.onload=function(){try{callback(null,reader.result);}catch(error){callback(error);}};reader.readAsText(file,'utf-8');}

  function currentCharacter(){var editing=App&&App.getEditing&&App.getEditing();return editing&&editing.id?Service.get(editing.id)||editing:null;}
  function inject(){
    var listHeading=Array.prototype.find.call(document.querySelectorAll('.section-heading h2'),function(heading){return heading.textContent.trim()==='Personagens';});
    if(listHeading&&!document.querySelector('[data-portability-list]')){
      listHeading.closest('.section-heading').insertAdjacentHTML('afterend','<section class="panel portability-panel" data-portability-list><div><span class="eyebrow">SEGURANÇA DAS FICHAS</span><h3>Exportação e backup</h3><p>As fichas continuam salvas neste aparelho. Exporte um arquivo para não depender apenas dos dados do navegador.</p></div><div class="portability-actions"><button class="secondary" data-export-all>Exportar todas</button><button class="secondary" data-import-file>Importar arquivo</button><button class="secondary" data-manual-backup>Criar backup local</button><button class="secondary" data-restore-manual>Restaurar backup local</button></div><input type="file" accept="application/json,.json" data-import-input hidden></section>');
    }
    var edit=document.querySelector('[data-edit-current]'),c=currentCharacter();
    if(edit&&c&&!document.querySelector('[data-export-character]'))edit.parentElement.insertAdjacentHTML('beforeend','<button class="secondary" data-export-character="'+c.id+'">Exportar ficha</button>');
  }
  document.addEventListener('click',function(event){
    var exportOne=event.target.closest('[data-export-character]');if(exportOne){try{exportCharacter(exportOne.dataset.exportCharacter);}catch(error){alert(error.message);}return;}
    if(event.target.closest('[data-export-all]')){try{var count=exportAll();alert(count+' ficha(s) exportada(s).');}catch(error){alert(error.message);}return;}
    if(event.target.closest('[data-import-file]')){var input=document.querySelector('[data-import-input]');if(input)input.click();return;}
    if(event.target.closest('[data-manual-backup]')){try{alert(manualBackup()+' ficha(s) copiadas para o backup local.');}catch(error){alert(error.message);}return;}
    if(event.target.closest('[data-restore-manual]')){if(confirm('Substituir as fichas atuais pelo backup manual?'))try{alert(restoreManualBackup()+' ficha(s) restauradas. Recarregando…');location.reload();}catch(error){alert(error.message);}}
  });
  document.addEventListener('change',function(event){var input=event.target.closest('[data-import-input]');if(!input||!input.files||!input.files[0])return;readFile(input.files[0],function(error,raw){if(error){alert(error.message);return;}try{var mode=confirm('OK: mesclar com as fichas atuais.\nCancelar: substituir todas as fichas.')?'merge':'replace';var count=importData(raw,mode);alert(count+' ficha(s) importada(s). Recarregando…');location.reload();}catch(importError){alert(importError.message);}});});
  global.addEventListener('load',inject);new MutationObserver(inject).observe(document.documentElement,{childList:true,subtree:true});
  global.SemideusesPortability={version:'3e-portability-0.1.0',exportAll:exportAll,exportCharacter:exportCharacter,importData:importData,manualBackup:manualBackup,restoreManualBackup:restoreManualBackup};
})(window);
