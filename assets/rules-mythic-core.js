(function(global){
  'use strict';
  var db=global.SemideusesRulesDatabase;if(!db)return;
  function clone(v){return JSON.parse(JSON.stringify(v));}
  db.mythicItems=db.mythicItems||{};
  db.registerMythicItems=function(items){(items||[]).forEach(function(item){db.mythicItems[item.id]=item;});};
  db.getMythicItem=function(idOrName){
    var all=db.mythicItems||{},found=all[idOrName]||Object.keys(all).map(function(k){return all[k];}).find(function(item){return item.name===idOrName;});
    return found?clone(found):null;
  };
  db.listMythicItems=function(tier){
    var all=Object.keys(db.mythicItems||{}).map(function(k){return db.mythicItems[k];});
    if(tier)all=all.filter(function(item){return item.tier===tier;});
    return all.map(clone);
  };
  db.listConsumables=function(){return db.listMythicItems('Consumível');};
  db.listPanoplies=function(){return db.listMythicItems('Panóplia');};
  db.listRelics=function(){return db.listMythicItems('Relíquia');};
  db.listArtifacts=function(){return db.listMythicItems('Artefato');};
  db.mythicTierRules={
    Consumível:'Uso único ou em doses; não pesa no orçamento do Mestre.',
    Panóplia:'Uma por personagem, ligada à alma; desperta nos níveis 5, 11 e 17 e não pesa no ND.',
    Relíquia:'Equipamento excepcional acima do mundano, normalmente com passiva e/ou ativa com recarga. É recompensa narrativa, não item de loja.',
    Artefato:'Peça de mito que pode definir a campanha. O grupo carregando 2 ou mais Artefatos conta como 1 nível acima no orçamento de encontro.'
  };
  db.version='3e-rules-db-0.39.0';
})(window);
