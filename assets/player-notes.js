(function(global){
  'use strict';

  var App=global.SemideusesApp;
  var Service=global.SemideusesCharacterService;
  var Model=global.SemideusesCharacter;
  if(!App||!Service||!Model)return;

  var TYPES={
    session:{label:'Sessão',icon:'◷'},
    prophecy:{label:'Profecia',icon:'✦'},
    idea:{label:'Ideia',icon:'◇'},
    general:{label:'Geral',icon:'✎'}
  };
  var activeFilter='all';
  var editingId='';
  var formOpen=false;
  var scheduled=false;

  function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(character){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];});}
  function clone(value){return Model.clone?Model.clone(value):JSON.parse(JSON.stringify(value));}
  function text(value){return String(value==null?'':value).trim();}
  function localDate(){var now=new Date(),month=String(now.getMonth()+1).padStart(2,'0'),day=String(now.getDate()).padStart(2,'0');return now.getFullYear()+'-'+month+'-'+day;}
  function validDate(value){value=text(value);return /^\d{4}-\d{2}-\d{2}$/.test(value)?value:'';}
  function typeOf(value){return TYPES[value]?value:'general';}
  function generatedTitle(type,date){return TYPES[type].label+' · '+formatDate(date||localDate());}
  function formatDate(value){
    value=text(value);
    if(/^\d{4}-\d{2}-\d{2}$/.test(value)){
      var parts=value.split('-');
      return parts[2]+'/'+parts[1]+'/'+parts[0];
    }
    var parsed=new Date(value);
    return Number.isNaN(parsed.getTime())?'Sem data':parsed.toLocaleDateString('pt-BR');
  }
  function cleanEntry(raw){
    raw=raw&&typeof raw==='object'?raw:{};
    var type=typeOf(raw.type),date=validDate(raw.date),body=text(raw.text);
    return {
      id:text(raw.id)||Model.uid('note'),
      type:type,
      title:text(raw.title)||generatedTitle(type,date),
      text:body,
      date:date,
      createdAt:text(raw.createdAt)||new Date().toISOString(),
      updatedAt:text(raw.updatedAt)||text(raw.createdAt)||new Date().toISOString()
    };
  }
  function cleanEntries(source){
    if(!Array.isArray(source))return [];
    var seen={};
    return source.map(cleanEntry).filter(function(entry){
      if(!entry.text||seen[entry.id])return false;
      seen[entry.id]=true;
      return true;
    });
  }
  function sortEntries(entries){
    return entries.slice().sort(function(a,b){
      var left=a.date||a.updatedAt||a.createdAt,right=b.date||b.updatedAt||b.createdAt;
      return String(right).localeCompare(String(left));
    });
  }
  function legacyEntry(character){
    var legacy=typeof character.notes==='string'?text(character.notes):'';
    if(!legacy)return null;
    return {id:'legacy',type:'general',title:'Anotação antiga',text:legacy,date:'',createdAt:character.createdAt||'',updatedAt:character.updatedAt||'',legacy:true};
  }
  function character(){
    var editing=App.getEditing&&App.getEditing();
    return editing&&editing.id?Service.get(editing.id)||editing:null;
  }
  function listEntries(characterOrId){
    var current=typeof characterOrId==='string'?Service.get(characterOrId):characterOrId;
    if(!current)return [];
    var entries=cleanEntries(current.journalEntries),legacy=legacyEntry(current);
    if(legacy)entries.push(legacy);
    return sortEntries(entries);
  }
  function validatePayload(payload){
    payload=payload||{};
    var type=typeOf(payload.type),date=validDate(payload.date),body=text(payload.text),title=text(payload.title);
    if(!body)throw new Error('Escreva a anotação antes de salvar.');
    if(body.length>5000)throw new Error('A anotação pode ter no máximo 5.000 caracteres.');
    if(title.length>80)throw new Error('O título pode ter no máximo 80 caracteres.');
    return {type:type,date:date,title:title||generatedTitle(type,date),text:body};
  }
  function addEntry(id,payload){
    var clean=validatePayload(payload),timestamp=new Date().toISOString();
    return Service.update(id,function(current){
      current.journalEntries=cleanEntries(current.journalEntries);
      current.journalEntries.push(Object.assign({id:Model.uid('note'),createdAt:timestamp,updatedAt:timestamp},clean));
      return current;
    });
  }
  function updateEntry(id,entryId,payload){
    var clean=validatePayload(payload),timestamp=new Date().toISOString();
    return Service.update(id,function(current){
      current.journalEntries=cleanEntries(current.journalEntries);
      if(entryId==='legacy'){
        if(!legacyEntry(current))throw new Error('Anotação não encontrada.');
        current.notes='';
        current.journalEntries.push(Object.assign({id:Model.uid('note'),createdAt:timestamp,updatedAt:timestamp},clean));
        return current;
      }
      var entry=current.journalEntries.find(function(item){return item.id===entryId;});
      if(!entry)throw new Error('Anotação não encontrada.');
      Object.assign(entry,clean,{updatedAt:timestamp});
      return current;
    });
  }
  function removeEntry(id,entryId){
    return Service.update(id,function(current){
      if(entryId==='legacy')current.notes='';
      else current.journalEntries=cleanEntries(current.journalEntries).filter(function(entry){return entry.id!==entryId;});
      return current;
    });
  }

  Service.listJournalEntries=listEntries;
  Service.addJournalEntry=addEntry;
  Service.updateJournalEntry=updateEntry;
  Service.removeJournalEntry=removeEntry;

  function typeOptions(selected){
    return Object.keys(TYPES).map(function(id){return '<option value="'+id+'" '+(selected===id?'selected':'')+'>'+TYPES[id].label+'</option>';}).join('');
  }
  function form(entry){
    entry=entry||{type:'session',title:'',text:'',date:localDate()};
    return '<form class="journal-form" data-journal-form data-entry-id="'+esc(entry.id||'')+'">'+
      '<div class="journal-form-grid"><label>Tipo<select name="type">'+typeOptions(typeOf(entry.type))+'</select></label><label>Data<input name="date" type="date" value="'+esc(entry.date||localDate())+'"></label></div>'+
      '<label>Título <small>opcional</small><input name="title" maxlength="80" value="'+esc(entry.title||'')+'" placeholder="Ex.: A profecia do norte"></label>'+
      '<label>Anotação<textarea name="text" rows="6" maxlength="5000" required placeholder="Registre o que aconteceu, uma teoria, profecia ou ideia para depois.">'+esc(entry.text||'')+'</textarea></label>'+
      '<div class="journal-form-actions"><button type="button" class="secondary" data-journal-cancel>Cancelar</button><button type="submit" class="primary">Salvar anotação</button></div></form>';
  }
  function card(entry){
    var type=TYPES[entry.type]||TYPES.general;
    if(editingId===entry.id)return '<article class="journal-entry editing">'+form(entry)+'</article>';
    return '<article class="journal-entry type-'+entry.type+'" data-journal-entry="'+esc(entry.id)+'"><header><span class="journal-type">'+type.icon+' '+type.label+'</span><time>'+
      esc(entry.date?formatDate(entry.date):formatDate(entry.updatedAt||entry.createdAt))+'</time></header><h4>'+esc(entry.title)+'</h4><p>'+esc(entry.text)+'</p>'+
      (entry.legacy?'<small class="journal-legacy">Importada do campo antigo da ficha</small>':'')+
      '<footer><button type="button" class="secondary" data-journal-edit="'+esc(entry.id)+'">Editar</button><button type="button" class="danger-link" data-journal-remove="'+esc(entry.id)+'">Excluir</button></footer></article>';
  }
  function panel(current){
    var all=listEntries(current),visible=activeFilter==='all'?all:all.filter(function(entry){return entry.type===activeFilter;});
    var filters=[['all','Todas']].concat(Object.keys(TYPES).map(function(id){return [id,TYPES[id].label];}));
    return '<section class="panel player-journal" data-player-notes><div class="journal-heading"><div><span class="eyebrow">MEMÓRIA DO PERSONAGEM</span><h3>Anotações</h3><p>Profecias, ideias e o relato do jogador sobre cada sessão.</p></div><button type="button" class="primary" data-journal-new>+ Nova anotação</button></div>'+
      '<p class="journal-storage-note">Estas anotações ficam vinculadas a esta ficha e entram no backup/exportação dela.</p>'+
      (formOpen?form(null):'')+
      '<nav class="journal-filters" aria-label="Filtrar anotações">'+filters.map(function(filter){var count=filter[0]==='all'?all.length:all.filter(function(entry){return entry.type===filter[0];}).length;return '<button type="button" class="'+(activeFilter===filter[0]?'active':'')+'" data-journal-filter="'+filter[0]+'">'+filter[1]+' <b>'+count+'</b></button>';}).join('')+'</nav>'+
      '<div class="journal-list">'+(visible.length?visible.map(card).join(''):'<div class="journal-empty"><strong>Nenhuma anotação aqui.</strong><p>Use “Nova anotação” para guardar algo que não quer esquecer.</p></div>')+'</div></section>';
  }
  function progressPanel(){
    var headings=document.querySelectorAll('.panel h3');
    for(var index=0;index<headings.length;index++)if(headings[index].textContent.trim()==='Progressão')return headings[index].closest('.panel');
    return null;
  }
  function enhanceQuickNavigation(){
    var track=document.querySelector('.sheet-quick-nav-track');
    if(!track)return;
    var existing=track.querySelector('[data-sheet-jump="notes"]');
    if(existing){existing.setAttribute('data-player-notes-jump','');return;}
    var button='<button type="button" data-player-notes-jump data-sheet-jump="notes" aria-label="Ir para Anotações"><b aria-hidden="true">✎</b><span>Anotações</span></button>';
    var progress=track.querySelector('[data-sheet-jump="progress"]');
    if(progress)progress.insertAdjacentHTML('beforebegin',button);else track.insertAdjacentHTML('beforeend',button);
  }
  function render(){
    var current=character(),progress=progressPanel();
    if(!current||!progress)return;
    var old=document.querySelector('[data-player-notes]'),html=panel(current);
    if(old)old.outerHTML=html;else progress.insertAdjacentHTML('beforebegin',html);
    enhanceQuickNavigation();
  }
  function schedule(){if(scheduled)return;scheduled=true;setTimeout(function(){scheduled=false;render();},0);}
  function focusForm(){setTimeout(function(){var target=document.querySelector('[data-journal-form] textarea');if(target)target.focus();},0);}
  function refresh(message){
    if(App.refresh)App.refresh();else schedule();
    if(message&&App.notify)App.notify(message);
  }

  document.addEventListener('click',function(event){
    var current=character();
    if(!current)return;
    if(event.target.closest('[data-journal-new]')){formOpen=true;editingId='';render();focusForm();return;}
    if(event.target.closest('[data-journal-cancel]')){formOpen=false;editingId='';render();return;}
    var filter=event.target.closest('[data-journal-filter]');
    if(filter){activeFilter=filter.dataset.journalFilter;editingId='';render();return;}
    var edit=event.target.closest('[data-journal-edit]');
    if(edit){editingId=edit.dataset.journalEdit;formOpen=false;render();focusForm();return;}
    var remove=event.target.closest('[data-journal-remove]');
    if(remove){
      if(!confirm('Excluir esta anotação?'))return;
      try{Service.removeJournalEntry(current.id,remove.dataset.journalRemove);editingId='';formOpen=false;refresh('Anotação excluída.');}catch(error){alert(error.message);}
    }
  },true);

  document.addEventListener('submit',function(event){
    var formElement=event.target.closest('[data-journal-form]');
    if(!formElement)return;
    event.preventDefault();
    var current=character();if(!current)return;
    var payload={type:formElement.elements.type.value,date:formElement.elements.date.value,title:formElement.elements.title.value,text:formElement.elements.text.value};
    try{
      if(formElement.dataset.entryId)Service.updateJournalEntry(current.id,formElement.dataset.entryId,payload);
      else Service.addJournalEntry(current.id,payload);
      editingId='';formOpen=false;activeFilter='all';refresh('Anotação salva na ficha.');
    }catch(error){alert(error.message);}
  },true);

  global.addEventListener('semideuses:rendered',schedule);
  global.addEventListener('semideuses:character-updated',schedule);
  global.addEventListener('load',schedule);
  schedule();

  global.SemideusesPlayerNotes={version:'player-notes-0.2.0',types:clone(TYPES),render:render,list:listEntries};
})(window);
