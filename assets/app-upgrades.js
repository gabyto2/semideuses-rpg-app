(function(){
  'use strict';

  var officialMarks = [
    {
      id: 'Ataque Extra',
      title: 'Ataque Extra',
      text: 'Ao usar a ação Atacar no seu turno, você realiza dois ataques com arma em vez de um.'
    },
    {
      id: 'Bônus de Conjuração',
      title: 'Bônus de Conjuração',
      text: 'Habilidades de Rank C custam 1 MP a menos e, uma vez por turno, você pode conjurar uma habilidade de Rank E junto da sua Ação, pagando o MP dela.'
    }
  ];

  function escapeHtml(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(character){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];
    });
  }

  function fixHeroMarkButtons(){
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-mark]'));
    if(!buttons.length) return;

    var heading = document.querySelector('.wizard-card h3');
    if(!heading || heading.textContent.indexOf('Marca do Herói') === -1) return;

    var list = buttons[0].parentElement;
    if(!list) return;

    var selected = buttons.find(function(button){ return button.classList.contains('selected'); });
    var selectedValue = selected ? selected.getAttribute('data-mark') : '';

    list.innerHTML = officialMarks.map(function(mark){
      var isSelected = selectedValue === mark.id;
      return '<button class="choice '+(isSelected?'selected':'')+'" data-mark="'+escapeHtml(mark.id)+'">'+
        '<strong>'+escapeHtml(mark.title)+'</strong><small>'+escapeHtml(mark.text)+'</small></button>';
    }).join('');

    Array.prototype.forEach.call(list.querySelectorAll('[data-mark]'), function(button){
      button.addEventListener('click', function(){
        var value = button.getAttribute('data-mark');
        var oldButton = buttons[0];
        if(oldButton && typeof oldButton.onclick === 'function'){
          oldButton.setAttribute('data-mark', value);
          oldButton.onclick.call(oldButton);
        }
      });
    });
  }

  function renderCompendium(data){
    var app = document.getElementById('app');
    if(!app) return;

    var progression = (data.progression || []).map(function(entry){
      return '<div class="review-grid"><div><span>Nível</span><strong>'+entry.level+'</strong></div><div><span>Desbloqueios</span><strong>'+escapeHtml(entry.unlocks.join(' · '))+'</strong></div></div>';
    }).join('');

    app.innerHTML = '<div class="app-shell">'+
      '<header class="topbar"><div><span class="eyebrow">COMPÊNDIO OFICIAL</span><h1>'+escapeHtml(data.name)+'</h1></div><div class="brand-mark">'+escapeHtml(data.symbol)+'</div></header>'+
      '<main class="content">'+
        '<section class="hero"><span class="eyebrow">FILIAÇÃO 3E</span><h2>'+escapeHtml(data.symbol+' '+data.name)+'</h2><p>'+escapeHtml(data.overview)+'</p></section>'+
        '<section class="panel"><h3>Informações centrais</h3><div class="review-grid">'+
          '<div><span>Domínio</span><strong>'+escapeHtml(data.domain)+'</strong></div>'+
          '<div><span>Perfil de jogo</span><strong>'+escapeHtml(data.gameProfile)+'</strong></div>'+
          '<div><span>Conjuração</span><strong>'+escapeHtml(data.castingAttribute)+'</strong></div>'+
          '<div><span>Dado de Vida</span><strong>d'+escapeHtml(data.hitDie)+'</strong></div>'+
          '<div><span>Testes de Resistência</span><strong>'+escapeHtml(data.savingThrows.join(' e '))+'</strong></div>'+
          '<div><span>Estado do cadastro</span><strong>Núcleo confirmado</strong></div>'+
        '</div></section>'+
        '<section class="panel"><h3>Progressão oficial</h3>'+progression+'</section>'+
        '<section class="panel"><h3>Conteúdo em catalogação</h3><p>As habilidades, proficiências e Caminhos de Deméter serão transcritos diretamente da 3ª edição. Nenhuma regra da 2ª edição será usada para preencher lacunas.</p></section>'+
        '<section class="panel"><button class="primary" id="return-to-app">Voltar ao aplicativo</button></section>'+
      '</main></div>';

    var back = document.getElementById('return-to-app');
    if(back) back.onclick = function(){ window.location.reload(); };
  }

  function openDemeterCompendium(){
    fetch('/database/affiliations/demeter.json', {cache:'no-store'})
      .then(function(response){
        if(!response.ok) throw new Error('Não foi possível carregar o banco de Deméter.');
        return response.json();
      })
      .then(renderCompendium)
      .catch(function(error){ alert(error.message || error); });
  }

  document.addEventListener('click', function(event){
    var target = event.target.closest('[data-go="compendio"]');
    if(target){
      event.preventDefault();
      event.stopImmediatePropagation();
      openDemeterCompendium();
    }
  }, true);

  var observer = new MutationObserver(function(){ fixHeroMarkButtons(); });
  observer.observe(document.documentElement, {childList:true, subtree:true});
  fixHeroMarkButtons();
})();
