/*
 * Lampa Winter Royale
 * Version: 1.0.0 | 2026-11-05
 * Premium red-and-gold winter theme for Lampa 3.4.4.
 * ES5-compatible; no analytics, ads, trackers or third-party scripts.
 * Decorative artwork: Font Awesome Free 7.3.1 (CC BY 4.0).
 * Code: MIT License.
 */
(function () {
  'use strict';

  var PREFIX = 'wr_';
  var READY_FLAG = 'plugin_lampa_winter_royale_ready';
  var ROOT_CLASS = 'wr-on';
  var STYLE_ID = 'wr-styles';
  var SCENE_ID = 'wr-scene';
  var settingsRegistered = false;
  var script = document.currentScript;
  var scriptUrl = script && script.src ? script.src : '';
  var assetBase = scriptUrl ? scriptUrl.replace(/[^\/]+(?:\?.*)?$/, '') + 'assets/' : 'assets/';

  function get(name, fallback) {
    try {
      if (window.Lampa && Lampa.Storage && Lampa.Storage.get) {
        return Lampa.Storage.get(PREFIX + name, fallback);
      }
    } catch (ignore) {}
    return fallback;
  }

  function enabled(name, fallback) {
    var value = get(name, fallback);
    return value === true || value === 'true' || value === 1 || value === '1';
  }

  function icon(name, className, alt) {
    return '<img class="' + className + '" src="' + assetBase + name + '.svg" alt="' + (alt || '') + '" aria-hidden="true">';
  }

  var css = [
    'html.wr-on{--wr-bg:#100405;--wr-bg2:#230809;--wr-panel:rgba(44,8,11,.92);--wr-panel2:rgba(73,14,16,.88);--wr-red:#b41120;--wr-red2:#e32b32;--wr-gold:#e4b858;--wr-champagne:#fff0be;--wr-border:rgba(232,190,91,.42);--wr-glow:rgba(221,167,55,.28);--wr-snow:rgba(255,250,235,.92)}',
    'html.wr-on[data-wr-palette="emerald"]{--wr-bg:#02100c;--wr-bg2:#06251a;--wr-panel:rgba(4,37,27,.93);--wr-panel2:rgba(8,66,45,.88);--wr-red:#0d7652;--wr-red2:#19a46f;--wr-gold:#e1b960;--wr-border:rgba(228,190,101,.4);--wr-glow:rgba(210,166,61,.25)}',
    'html.wr-on body{background-color:var(--wr-bg)!important;background-image:radial-gradient(ellipse at 88% 10%,rgba(164,20,31,.24),transparent 40%),radial-gradient(ellipse at 7% 92%,rgba(112,11,19,.18),transparent 38%),linear-gradient(145deg,var(--wr-bg),var(--wr-bg2))!important;color:#fffaf0}',
    'html.wr-on .head{background:linear-gradient(180deg,rgba(21,4,6,.94),rgba(25,5,7,.76))!important;border-bottom:1px solid var(--wr-border)!important;box-shadow:0 .35em 1.5em rgba(0,0,0,.26)!important}',
    'html.wr-on .menu{background:linear-gradient(155deg,var(--wr-panel2),var(--wr-panel))!important;border-right:1px solid var(--wr-border)!important;box-shadow:1.3em 0 3em rgba(0,0,0,.35)!important;color:#fff8e9!important}',
    'html.wr-on .menu__list{background:transparent!important}',
    'html.wr-on .menu__item{color:#fff5e5!important;border-radius:.6em}',
    'html.wr-on .menu__item.focus,html.wr-on .menu__item.active,html.wr-on .menu__item.traverse{color:#fff!important;background:linear-gradient(90deg,rgba(180,17,32,.78),rgba(112,8,18,.48))!important;box-shadow:inset .2em 0 var(--wr-gold),0 0 1.1em var(--wr-glow)!important}',
    'html.wr-on .menu__item.focus .menu__text,html.wr-on .menu__item.active .menu__text{color:var(--wr-champagne)!important}',
    'html.wr-on .settings__content{background:linear-gradient(155deg,var(--wr-panel2),var(--wr-panel))!important;border-left:1px solid var(--wr-border)!important;box-shadow:-1.4em 0 3.5em rgba(0,0,0,.44)!important;color:#fff7e8!important}',
    'html.wr-on .settings__body,html.wr-on .settings__head,html.wr-on .settings__body .scroll,html.wr-on .settings__body .scroll__body{background:transparent!important;color:#fff7e8!important}',
    'html.wr-on .settings__title{color:var(--wr-champagne)!important;text-shadow:0 0 .9em var(--wr-glow)}',
    'html.wr-on .settings-folder__name,html.wr-on .settings-param__name{color:#fff5e3!important}',
    'html.wr-on .settings-param__value{color:var(--wr-gold)!important}',
    'html.wr-on .settings-param__descr{color:#d8cbb6!important;opacity:.9!important}',
    'html.wr-on .settings-folder,html.wr-on .settings-param{border-radius:.65em;border-color:rgba(232,190,91,.2)}',
    'html.wr-on .settings-folder.focus,html.wr-on .settings-param.focus{background:linear-gradient(90deg,rgba(180,17,32,.72),rgba(91,7,14,.45))!important;box-shadow:inset .2em 0 var(--wr-gold),0 0 1em var(--wr-glow)!important}',
    'html.wr-on .settings-folder.focus .settings-folder__name,html.wr-on .settings-param.focus .settings-param__name{color:var(--wr-champagne)!important}',
    'html.wr-on .modal__content,html.wr-on .modal__body,html.wr-on .selectbox__content{background:linear-gradient(145deg,var(--wr-panel2),var(--wr-panel))!important;border:1px solid var(--wr-border)!important;color:#fff9ec!important}',
    'html.wr-on .button,html.wr-on .simple-button{border-radius:.62em}',
    'html.wr-on .button.focus,html.wr-on .button.selector.focus,html.wr-on .simple-button.focus,html.wr-on .full-start__button.focus{border-color:var(--wr-gold)!important;box-shadow:0 0 0 .14em var(--wr-gold),0 0 1.2em var(--wr-glow)!important;background-color:var(--wr-red)!important;color:#fff!important}',
    'html.wr-on .card__view,html.wr-on .card__img,html.wr-on .card__image{border-radius:.68em!important}',
    'html.wr-on .card__view{position:relative;overflow:hidden;box-shadow:0 .45em 1.5em rgba(0,0,0,.34);transition:transform .18s ease,box-shadow .18s ease}',
    'html.wr-on .card.focus .card__view,html.wr-on .card.traverse .card__view{box-shadow:0 0 0 .15em var(--wr-gold),0 0 1.25em var(--wr-glow),0 .6em 1.5em rgba(0,0,0,.42)!important}',
    'html.wr-on .card__title,html.wr-on .full-start__title{color:#fff8e9!important;text-shadow:0 0 .75em rgba(165,20,30,.2)}',
    'html.wr-on .card__vote,html.wr-on .full-start__rating{color:var(--wr-champagne)!important;background-color:rgba(60,8,11,.84)!important;border:1px solid rgba(229,187,88,.32)}',
    'html.wr-on.wr-poster-snow .card__view:after{content:"";position:absolute;z-index:4;left:-2%;right:-2%;top:-.05em;height:.42em;pointer-events:none;background:radial-gradient(ellipse at 8% 0,var(--wr-snow) 0 42%,transparent 45%),radial-gradient(ellipse at 28% 0,rgba(255,255,248,.96) 0 52%,transparent 55%),radial-gradient(ellipse at 53% 0,var(--wr-snow) 0 44%,transparent 47%),radial-gradient(ellipse at 78% 0,rgba(255,255,248,.94) 0 50%,transparent 53%),linear-gradient(180deg,#fffdf2,rgba(226,238,239,.88));filter:drop-shadow(0 .11em .1em rgba(93,142,155,.25))}',
    '#wr-scene,#wr-scene *{pointer-events:none!important;user-select:none!important}',
    '#wr-scene{display:none;position:fixed;inset:0;z-index:2;overflow:hidden}',
    'html.wr-on #wr-scene{display:block}',
    '#wr-garland{position:absolute;left:8vw;right:8vw;top:0;height:2.2em;opacity:.92;filter:drop-shadow(0 .15em .35em rgba(222,170,58,.28))}',
    '#wr-garland:before{content:"";position:absolute;left:0;right:0;top:.16em;height:.11em;background:linear-gradient(90deg,transparent,var(--wr-gold) 8%,#fff0aa 50%,var(--wr-gold) 92%,transparent);border-radius:50%;box-shadow:0 0 .5em rgba(237,191,79,.5)}',
    '#wr-garland .wr-ornament{position:absolute;top:.18em;width:1.4em;height:1.4em;opacity:.92;filter:brightness(0) saturate(100%) invert(77%) sepia(58%) saturate(657%) hue-rotate(357deg) brightness(94%) contrast(88%) drop-shadow(0 0 .23em rgba(255,215,104,.48))}',
    '#wr-garland .wr-o1{left:12%}#wr-garland .wr-o2{left:31%;filter:brightness(0) saturate(100%) invert(24%) sepia(93%) saturate(2825%) hue-rotate(341deg) brightness(91%) contrast(88%)}#wr-garland .wr-o3{left:49%}#wr-garland .wr-o4{left:68%;filter:brightness(0) saturate(100%) invert(24%) sepia(93%) saturate(2825%) hue-rotate(341deg) brightness(91%) contrast(88%)}#wr-garland .wr-o5{left:86%}',
    '#wr-garland .wr-bell{width:1.05em;height:1.05em}',
    '#wr-tree{position:absolute;right:-.9em;bottom:-.2em;width:10em;height:17em;max-width:16vw;max-height:36vh;opacity:.88;filter:drop-shadow(0 0 1.1em rgba(226,180,65,.34))}',
    '#wr-tree .wr-tree-icon{width:100%;height:100%;filter:brightness(0) saturate(100%) invert(67%) sepia(69%) saturate(473%) hue-rotate(359deg) brightness(91%) contrast(88%)}',
    '#wr-tree .wr-tree-star{position:absolute;left:42%;top:-.1em;width:1.5em;height:1.5em;filter:brightness(0) saturate(100%) invert(88%) sepia(45%) saturate(744%) hue-rotate(345deg) brightness(105%) contrast(101%) drop-shadow(0 0 .45em rgba(255,218,114,.8))}',
    '#wr-tree .wr-tree-gift{position:absolute;bottom:.35em;width:2.15em;height:2.15em;filter:brightness(0) saturate(100%) invert(22%) sepia(90%) saturate(2858%) hue-rotate(342deg) brightness(93%) contrast(91%) drop-shadow(0 .2em .35em rgba(0,0,0,.35))}',
    '#wr-tree .wr-gift-left{left:8%}#wr-tree .wr-gift-right{right:5%;width:1.75em;height:1.75em;filter:brightness(0) saturate(100%) invert(82%) sepia(42%) saturate(819%) hue-rotate(352deg) brightness(97%) contrast(88%) drop-shadow(0 .2em .35em rgba(0,0,0,.35))}',
    '#wr-tree:before,#wr-tree:after{content:"";position:absolute;border-radius:50%;background:#d5212d;box-shadow:0 0 .7em rgba(247,52,58,.7)}',
    '#wr-tree:before{width:.55em;height:.55em;left:34%;top:38%}#wr-tree:after{width:.42em;height:.42em;left:61%;top:56%;background:#f0c96a}',
    '#wr-santa{position:absolute;top:2.8em;left:-13em;width:10em;height:3.2em;opacity:.18;filter:drop-shadow(0 0 .45em rgba(231,183,69,.35))}',
    '#wr-santa .wr-sleigh-icon{width:100%;height:100%;filter:brightness(0) saturate(100%) invert(77%) sepia(58%) saturate(657%) hue-rotate(357deg) brightness(94%) contrast(88%)}',
    'html.wr-on.wr-motion:not(.wr-eco) #wr-santa{animation:wr-santa-fly 46s linear infinite}',
    '@keyframes wr-santa-fly{0%,72%{transform:translateX(-15vw);opacity:0}75%{opacity:.16}94%{opacity:.16}98%,100%{transform:translateX(125vw);opacity:0}}',
    '#wr-snow{position:absolute;inset:0;z-index:0}',
    '#wr-snow .wr-flake{position:absolute;top:-7vh;width:.75em;height:.75em;color:rgba(255,255,250,.72);opacity:.65}',
    '#wr-snow .wr-flake img{width:100%;height:100%;filter:brightness(0) invert(1)}',
    'html.wr-on.wr-motion:not(.wr-eco) #wr-snow .wr-flake{animation:wr-snow-fall var(--wr-duration) linear infinite;animation-delay:var(--wr-delay)}',
    '@keyframes wr-snow-fall{0%{transform:translate3d(0,-8vh,0) rotate(0deg)}100%{transform:translate3d(var(--wr-drift),112vh,0) rotate(320deg)}}',
    'html.wr-on.wr-eco #wr-snow .wr-flake{display:none}',
    'html.wr-on.wr-balanced #wr-snow .wr-extra{display:none}',
    'html.wr-on:not(.wr-garland) #wr-garland,html.wr-on:not(.wr-tree) #wr-tree,html.wr-on:not(.wr-santa) #wr-santa,html.wr-on:not(.wr-snow) #wr-snow{display:none}',
    'body.settings--open #wr-scene,body.selectbox--open #wr-scene,body.modal--open #wr-scene,body.player--open #wr-scene,body.video--open #wr-scene{display:none!important}',
    '@media(max-width:900px){#wr-garland{left:14vw;right:5vw;opacity:.75}#wr-tree{width:7em;height:11em;opacity:.72}#wr-santa{display:none}}',
    '@media(max-width:640px){#wr-tree{display:none}#wr-garland .wr-o2,#wr-garland .wr-o4{display:none}}',
    '@media(prefers-reduced-motion:reduce){html.wr-on #wr-santa,html.wr-on #wr-snow .wr-flake{animation:none!important}html.wr-on .card__view{transition:none!important}}'
  ].join('\n');

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.type = 'text/css';
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function snowMarkup() {
    var out = [];
    var positions = [4,11,18,27,34,42,51,59,67,74,82,89,96,7,23,47,63,78,91,15,38,56,72,86];
    var i;
    for (i = 0; i < positions.length; i++) {
      out.push('<span class="wr-flake ' + (i > 11 ? 'wr-extra' : '') + '" style="left:' + positions[i] + '%;--wr-duration:' + (15 + (i % 8) * 2) + 's;--wr-delay:-' + (i * 1.7).toFixed(1) + 's;--wr-drift:' + ((i % 2 ? 1 : -1) * (16 + (i % 4) * 5)) + 'px">' + icon('snowflake', 'wr-snow-icon', '') + '</span>');
    }
    return out.join('');
  }

  function injectScene() {
    if (!document.body || document.getElementById(SCENE_ID)) return;
    var scene = document.createElement('div');
    scene.id = SCENE_ID;
    scene.setAttribute('aria-hidden', 'true');
    scene.innerHTML = '' +
      '<div id="wr-snow">' + snowMarkup() + '</div>' +
      '<div id="wr-garland">' +
        icon('bell', 'wr-ornament wr-bell wr-o1', '') +
        icon('candy-cane', 'wr-ornament wr-o2', '') +
        icon('gift', 'wr-ornament wr-o3', '') +
        icon('candy-cane', 'wr-ornament wr-o4', '') +
        icon('bell', 'wr-ornament wr-bell wr-o5', '') +
      '</div>' +
      '<div id="wr-santa">' + icon('sleigh', 'wr-sleigh-icon', '') + '</div>' +
      '<div id="wr-tree">' + icon('tree', 'wr-tree-icon', '') + icon('star', 'wr-tree-star', '') + icon('gift', 'wr-tree-gift wr-gift-left', '') + icon('gift', 'wr-tree-gift wr-gift-right', '') + '</div>';
    document.body.appendChild(scene);
  }

  function apply() {
    var root = document.documentElement;
    var on = enabled('enabled', true);
    var palette = get('palette', 'royal');
    var performance = get('performance', 'balanced');
    if (palette !== 'emerald') palette = 'royal';
    if (performance !== 'eco' && performance !== 'full') performance = 'balanced';
    root.classList.toggle(ROOT_CLASS, on);
    root.setAttribute('data-wr-palette', palette);
    root.classList.toggle('wr-snow', on && enabled('snow', true));
    root.classList.toggle('wr-garland', on && enabled('garland', true));
    root.classList.toggle('wr-tree', on && enabled('tree', true));
    root.classList.toggle('wr-santa', on && enabled('santa', true));
    root.classList.toggle('wr-poster-snow', on && enabled('poster_snow', true));
    root.classList.toggle('wr-windows', on && enabled('windows', true));
    root.classList.toggle('wr-motion', on && performance !== 'eco');
    root.classList.toggle('wr-eco', performance === 'eco');
    root.classList.toggle('wr-balanced', performance === 'balanced');
    root.classList.toggle('wr-full', performance === 'full');
    if (on) {
      injectStyle();
      injectScene();
    }
  }

  function changed() {
    setTimeout(apply, 0);
  }

  function addSetting(param, field) {
    Lampa.SettingsApi.addParam({
      component: 'winter_royale',
      param: param,
      field: field,
      onChange: changed
    });
  }

  function registerSettings() {
    if (settingsRegistered || !Lampa.SettingsApi || !Lampa.SettingsApi.addComponent || !Lampa.SettingsApi.addParam) return;
    settingsRegistered = true;
    try {
      Lampa.SettingsApi.addComponent({
        component: 'winter_royale',
        name: 'Winter Royale',
        icon: icon('snowflake', 'wr-settings-icon', '')
      });
      addSetting({name:PREFIX+'enabled',type:'trigger','default':true},{name:'Включить Winter Royale',description:'Главный переключатель темы.'});
      addSetting({name:PREFIX+'palette',type:'select',values:{royal:'Королевский красный и золото',emerald:'Изумруд и золото'},'default':'royal'},{name:'Цветовая палитра',description:'Красно-золотая палитра используется по умолчанию.'});
      addSetting({name:PREFIX+'snow',type:'trigger','default':true},{name:'Падающий снег',description:'Лёгкий снег позади интерфейса.'});
      addSetting({name:PREFIX+'poster_snow',type:'trigger','default':true},{name:'Снег на постерах',description:'Тонкая снежная кромка, не закрывающая изображение и рейтинг.'});
      addSetting({name:PREFIX+'garland',type:'trigger','default':true},{name:'Гирлянда и колокольчики',description:'Свободная верхняя кромка без перехвата навигации.'});
      addSetting({name:PREFIX+'tree',type:'trigger','default':true},{name:'Золотая ёлка',description:'Ёлка у нижнего правого края; скрывается поверх окон.'});
      addSetting({name:PREFIX+'santa',type:'trigger','default':true},{name:'Сани Деда Мороза',description:'Редкое спокойное появление в верхнем фоне.'});
      addSetting({name:PREFIX+'windows',type:'trigger','default':true},{name:'Праздничные окна',description:'Единая красно-золотая стилизация настроек и диалогов.'});
      addSetting({name:PREFIX+'performance',type:'select',values:{eco:'Экономный',balanced:'Сбалансированный (TV)',full:'Максимальный'},'default':'balanced'},{name:'Производительность',description:'Экономный режим отключает движение. Максимальный показывает больше снежинок.'});
    } catch (error) {
      if (window.console && console.warn) console.warn('[Winter Royale] Settings API:', error);
    }
  }

  function start() {
    if (window[READY_FLAG] || !window.Lampa || !document.documentElement || !document.body) return;
    window[READY_FLAG] = true;
    injectStyle();
    injectScene();
    registerSettings();
    apply();
    if (window.console && console.log) console.log('[Winter Royale] 1.0.0 ready');
  }

  function bootstrap() {
    if (window.appready && window.Lampa) {
      start();
    } else if (window.Lampa && Lampa.Listener && Lampa.Listener.follow) {
      Lampa.Listener.follow('app', function (event) {
        if (event && event.type === 'ready') start();
      });
    } else if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }

  bootstrap();
})();
