const fs=require('fs');
const path=require('path');
const assert=require('assert');
const {JSDOM}=require('jsdom');

const root=path.resolve(__dirname,'..');
const source=name=>fs.readFileSync(path.join(root,'assets',name),'utf8');
const clone=value=>JSON.parse(JSON.stringify(value));

function environment(){
  const dom=new JSDOM('<!doctype html><body></body>',{url:'https://example.test/',runScripts:'outside-only'});
  const window=dom.window;
  window.confirm=()=>true;
  window.alert=message=>{throw new Error('Alerta inesperado: '+message);};
  return {dom,window};
}

function campaignRules(){
  const {dom,window}=environment();
  window.eval(source('master-campaign.js'));
  const Campaign=window.SemideusesMasterCampaign;

  assert.equal(Campaign.read().name,'Minha campanha');
  assert.throws(()=>Campaign.add('sessions',{title:'  '}),/título da sessão/i);
  assert.throws(()=>Campaign.add('npcs',{name:''}),/nome do NPC/i);
  assert.throws(()=>Campaign.add('locations',{name:''}),/nome do local/i);
  assert.throws(()=>Campaign.add('threads',{title:''}),/título da pista/i);

  Campaign.setOverview({name:'Maré de Tífon',summary:'Uma guerra se aproxima.',privateNotes:'O oráculo mentiu.'});
  Campaign.addPartyMember({name:'Helena',pvMax:32,ca:15,notes:'Filha de Deméter'});
  Campaign.add('sessions',{title:'O primeiro presságio',date:'2026-08-10',summary:'O grupo encontrou uma moeda partida.'});
  Campaign.add('npcs',{name:'Íris',role:'Mensageira',status:'Aliado',notes:'Sabe mais do que revela.'});
  Campaign.add('locations',{name:'Templo Afundado',region:'Mar Egeu',status:'Inacessível',notes:'Abre na lua nova.'});
  Campaign.add('threads',{title:'A moeda partida',kind:'Profecia',status:'Revelada',notes:'Falta a segunda metade.'});
  let state=Campaign.read();
  assert.equal(state.sessions.length,1);
  assert.equal(state.party.length,1);
  assert.equal(state.party[0].pvCurrent,32,'Herói novo deve iniciar com PV completos.');
  assert.equal(state.npcs[0].status,'Aliado');
  assert.equal(state.locations[0].region,'Mar Egeu');
  assert.equal(state.threads[0].kind,'Profecia');

  Campaign.edit('npcs',state.npcs[0].id,{name:'Íris',role:'Aliada divina',status:'Desaparecido',notes:'Sem resposta.'});
  Campaign.editPartyMember(state.party[0].id,{pvCurrent:21,exhaustionLevel:2,conditions:['Abalado']});
  state=Campaign.read();
  assert.equal(state.npcs[0].status,'Desaparecido');
  assert.equal(state.party[0].pvCurrent,21);
  assert(state.party[0].conditions.includes('Exausto'),'Nível de Exaustão deve permanecer associado ao herói do grupo.');
  Campaign.remove('locations',state.locations[0].id);
  assert.equal(Campaign.read().locations.length,0);
  Campaign.addPartyMember({name:'Hana'});
  state=Campaign.read();
  assert.equal(state.party[1].trackVitals,false,'O cadastro do grupo deve aceitar apenas o nome do herói.');
  assert.equal(state.party[1].name,'Hana');
  assert(JSON.parse(window.localStorage.getItem(Campaign.storageKey)).threads.length===1,'A campanha deve persistir no navegador.');
  dom.window.close();
}

function backupAndUi(){
  const {dom,window}=environment();
  window.eval(source('master-campaign.js'));
  const Campaign=window.SemideusesMasterCampaign;
  Campaign.setOverview({name:'O Labirinto Vivo',summary:'Campanha de teste.',privateNotes:'Dédalo observa o grupo.'});
  Campaign.addPartyMember({name:'Orion',pvMax:38,ca:16});
  Campaign.add('sessions',{title:'Entrada no Labirinto',date:'2026-08-10',summary:'O grupo atravessou o primeiro portão.'});

  let restoredEncounters=null,restoredCalculator=null;
  const encounterData={current:{id:'atual',title:'Minotauro',status:'preparing',combatants:[]},history:[{id:'antigo',title:'Empusas',status:'ended'}]};
  const calculatorData={groupLevel:5,partySize:4,query:'',ndFilter:'all',catalogOpen:false,catalogPage:1,quantities:{},savedEncounters:[{id:'salvo',name:'Emboscada'}]};
  window.SemideusesMasterRuntime={
    exportData:()=>clone(encounterData),
    restoreData:data=>{restoredEncounters=clone(data);return data;},
    history:()=>restoredEncounters?clone(restoredEncounters.history):clone(encounterData.history)
  };
  window.SemideusesEncounterCalculator={
    read:()=>restoredCalculator?clone(restoredCalculator):clone(calculatorData),
    write:data=>{restoredCalculator=clone(data);return data;}
  };
  window.eval(source('master-backup.js'));
  const Backup=window.SemideusesMasterBackup;

  const saved=Backup.payload();
  assert.equal(saved.format,'semideuses-mestre-3e');
  assert.equal(saved.campaign.name,'O Labirinto Vivo');
  assert.equal(saved.campaign.party.length,1);
  assert.equal(saved.encounters.history.length,1);
  assert.equal(saved.calculator.savedEncounters.length,1);
  assert.throws(()=>Backup.parse({format:'outro'}),/incompatível/i);

  Campaign.setOverview({name:'Campanha substituída',summary:'',privateNotes:''});
  const result=Backup.restore(saved);
  assert.equal(Campaign.read().name,'O Labirinto Vivo');
  assert.equal(restoredEncounters.current.title,'Minotauro');
  assert.equal(restoredCalculator.groupLevel,5);
  assert.deepEqual(result,{party:1,sessions:1,history:1,savedEncounters:1});

  window.eval(source('master-campaign-ui.js'));
  const UI=window.SemideusesMasterCampaignUI;
  let notices=[];
  function render(){
    window.document.body.innerHTML=UI.view();
    UI.bind({refresh:render,notify:message=>notices.push(message)});
  }
  render();
  assert(window.document.querySelector('[data-master-campaign]'));
  assert.equal(window.document.querySelector('.campaign-shell').open,false,'O arquivo narrativo deve iniciar recolhido.');
  const shell=window.document.querySelector('.campaign-shell');shell.open=true;shell.ontoggle();
  const privateNotes=window.document.querySelector('[data-campaign-field="privateNotes"]');privateNotes.value='Rascunho salvo durante o turno.';privateNotes.oninput();
  render();
  assert.equal(Campaign.read().privateNotes,'Rascunho salvo durante o turno.','Visão da campanha deve salvar sem depender de botão.');
  assert.equal(window.document.querySelector('[data-campaign-field="privateNotes"]').value,'Rascunho salvo durante o turno.');
  const sessions=window.document.querySelector('[data-campaign-toggle="sessions"]');sessions.open=true;sessions.ontoggle();
  let form=window.document.querySelector('[data-campaign-new="sessions"]');
  form.querySelector('[data-campaign-field="title"]').value='A porta sem saída';
  form.querySelector('[data-campaign-field="date"]').value='2026-08-11';
  form.querySelector('[data-campaign-field="summary"]').value='Uma nova passagem foi descoberta.';
  form.querySelector('[data-campaign-field="summary"]').oninput();
  render();
  form=window.document.querySelector('[data-campaign-new="sessions"]');
  assert.equal(form.querySelector('[data-campaign-field="title"]').value,'A porta sem saída','Rascunho de novo registro deve sobreviver a outra ação da Mesa.');
  form.querySelector('[data-campaign-add="sessions"]').click();
  assert.equal(Campaign.read().sessions.length,2);
  assert(window.document.querySelector('.campaign-shell').open,'O painel deve continuar aberto depois de salvar.');
  assert(window.document.querySelector('[data-campaign-toggle="sessions"]').open,'A categoria deve continuar aberta depois de salvar.');

  window.document.querySelector('[data-master-local-backup]').click();
  assert(window.localStorage.getItem(Backup.localKey),'A cópia local deve ser registrada separadamente.');
  assert(notices.includes('Cópia local criada neste aparelho.'));
  dom.window.close();
}

campaignRules();backupAndUi();console.log('master-campaign.test: OK');
