(function(global){
  'use strict';

  var Campaign=global.SemideusesMasterCampaign,Runtime=global.SemideusesMasterRuntime,Calculator=global.SemideusesEncounterCalculator;
  var FORMAT='semideuses-mestre-3e',LOCAL_KEY='semideuses.master.manualBackup.v1';
  if(!Campaign||!Runtime||!Calculator)return;

  function clone(value){return JSON.parse(JSON.stringify(value));}
  function payload(){return {format:FORMAT,edition:'3e',schemaVersion:1,exportedAt:new Date().toISOString(),campaign:Campaign.read(),encounters:Runtime.exportData(),calculator:Calculator.read()};}
  function parse(raw){var data=typeof raw==='string'?JSON.parse(raw):raw;if(!data||data.format!==FORMAT||data.edition!=='3e'||!data.campaign||!data.encounters||!data.calculator)throw new Error('Arquivo incompatível com os dados do Mestre de Semideuses RPG 3e.');return clone(data);}
  function restore(raw){var data=parse(raw);Campaign.write(data.campaign);Runtime.restoreData(data.encounters);Calculator.write(data.calculator);global.dispatchEvent(new CustomEvent('semideuses:master-backup-restored'));return {sessions:Campaign.read().sessions.length,history:Runtime.history().length,savedEncounters:Calculator.read().savedEncounters.length};}
  function download(){var data=payload(),blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='semideuses-mestre-backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(link);link.click();link.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);return data;}
  function manualBackup(){var data=payload();localStorage.setItem(LOCAL_KEY,JSON.stringify(data));return data;}
  function restoreManualBackup(){var raw=localStorage.getItem(LOCAL_KEY);if(!raw)throw new Error('Nenhum backup local do Mestre foi criado neste aparelho.');return restore(raw);}
  function readFile(file,callback){var reader=new FileReader();reader.onerror=function(){callback(new Error('Não foi possível ler o arquivo.'));};reader.onload=function(){callback(null,reader.result);};reader.readAsText(file,'utf-8');}

  global.SemideusesMasterBackup={version:'master-backup-0.1.0',format:FORMAT,localKey:LOCAL_KEY,payload:payload,parse:parse,restore:restore,download:download,manualBackup:manualBackup,restoreManualBackup:restoreManualBackup,readFile:readFile};
})(window);
