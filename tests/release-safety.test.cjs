const fs=require('fs');
const path=require('path');
const assert=require('assert');
const {JSDOM}=require('jsdom');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

function dom(){return new JSDOM('<!doctype html><body></body>',{url:'https://example.test/',runScripts:'outside-only'});}

async function run(){
  const broken=dom(),bw=broken.window;
  bw.console.error=function(){};
  bw.localStorage.setItem('semideuses.characters.v4','{arquivo-quebrado');
  bw.localStorage.setItem('semideuses.characters.backup.v1',JSON.stringify([{id:'segura',name:'Ficha segura'}]));
  bw.eval(read('assets/storage.js'));
  assert.deepEqual(bw.SemideusesStorage.readCharacters(),[{id:'segura',name:'Ficha segura'}],'Uma ficha corrompida deve voltar para a última cópia válida.');
  assert.equal(bw.localStorage.getItem('semideuses.characters.corrupt.v1'),'{arquivo-quebrado');
  assert(JSON.parse(bw.localStorage.getItem('semideuses.characters.recovery.v1')).at,'A recuperação deve deixar um registro verificável.');
  broken.window.close();

  const migrated=dom(),mw=migrated.window;
  mw.localStorage.setItem('semideuses.characters.v3',JSON.stringify([{id:'antiga',name:'Helena',schemaVersion:3}]));
  mw.localStorage.setItem('semideuses.preference.test','original');
  mw.SemideusesCharacter={schemaVersion:5,normalize:function(character){return Object.assign({},character,{schemaVersion:5,migrated:true});}};
  mw.eval(read('assets/storage.js'));
  mw.eval(read('assets/release-safety.js'));
  const status=mw.SemideusesReleaseSafety.status(),current=mw.SemideusesStorage.readCharacters();
  assert.equal(status.version,'1.0.0-rc.1');
  assert.equal(status.migration.status,'migrated');
  assert.equal(current[0].schemaVersion,5,'A atualização deve normalizar a ficha no schema atual.');
  assert(status.snapshot&&status.snapshot.createdAt,'A migração deve criar uma cópia antes de alterar dados existentes.');
  mw.localStorage.setItem('semideuses.preference.test','alterada');
  mw.SemideusesReleaseSafety.restoreSnapshot();
  assert.equal(mw.localStorage.getItem('semideuses.preference.test'),'original','A cópia de recuperação deve conseguir restaurar o estado anterior.');

  let exported=0;
  mw.SemideusesPortability={exportCharacter:function(){exported+=1;mw.SemideusesReleaseSafety.recordExternalBackup('character-file',1);}};
  mw.SemideusesReleaseSafety.recommendBackup({kind:'character-created',characterId:'antiga',name:'Helena'});
  await new Promise(resolve=>setTimeout(resolve,10));
  const reminder=mw.document.querySelector('[data-release-backup-reminder]');
  assert(reminder&&reminder.textContent.includes('Sua ficha foi criada'),'Uma ficha nova deve receber um lembrete contextual de backup.');
  reminder.querySelector('[data-release-backup-now]').click();
  assert.equal(exported,1);
  assert.equal(mw.SemideusesReleaseSafety.status().pending,null,'O lembrete deve ser concluído após baixar a cópia.');
  migrated.window.close();
  console.log('release-safety.test: OK');
}

run().catch(error=>{console.error(error);process.exitCode=1;});
