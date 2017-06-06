/*
The MIT License (MIT)
 Copyright (c) 2017 Adrian Paul Nutiu <nutiuadrianpaul@gmail.com>
 http://adrianpaulnutiu.me/
*/
// ==UserScript==
// @name         kartwars.io Bot
// @namespace    https://github.com/kmataru/kartwars.io-bot/raw/pre-release/src/DracoolaArt.Bot.Kartwars/
// @version      0.7.475
// @description  kartwars.io Bot
// @author       Adrian Paul Nutiu
// @match        http://kartwars.io/
// @icon         https://assets-cdn.github.com/images/icons/emoji/unicode/1f697.png
// @updateURL    https://github.com/kmataru/kartwars.io-bot/raw/pre-release/src/DracoolaArt.Bot.Kartwars/bot.user.js
// @downloadURL  https://github.com/kmataru/kartwars.io-bot/raw/pre-release/src/DracoolaArt.Bot.Kartwars/bot.user.js
// @supportURL   https://github.com/kmataru/kartwars.io-bot/issues
// @require      https://gist.githubusercontent.com/eligrey/384583/raw/96dd5cd2fd6b752aa3ec0630a003e7a920313d1a/object-watch.js
// @require      https://cdn.rawgit.com/stacktracejs/stacktrace.js/master/dist/stacktrace.min.js
// @grant        none
// ==/UserScript==
/// <reference path="lib/_references.ts" />
// tslint:disable-next-line:no-unused-expression
!function (window, document) {
    var baseURL = 'http://scripts.local.com/';
    var baseScriptPath = baseURL + "lib/";
    var baseStylePath = baseURL + "style/";
    window.botSettings = {
        LOAD_DEBUG_SCRIPTS: false,
        LOAD_GIT_SCRIPTS: true,
    };
    window.GM_info = GM_info;
    function initLoader(baseURL, baseScriptPath) {
        var remoteScript = document.createElement('script');
        remoteScript.src = baseScriptPath + "Loader.js?time=" + (+new Date());
        remoteScript.onload = function () {
            setTimeout(function () {
                (new DracoolaArt.KartwarsBot.Loader(baseURL, baseScriptPath)).boot();
            }, 0);
        };
        document.body.appendChild(remoteScript);
    }
    function loadStylesheet(fileURL) {
        fileURL += "?time=" + (+new Date());
        var remoteLink = document.createElement('link');
        remoteLink.href = fileURL;
        remoteLink.type = 'text/css';
        remoteLink.rel = 'stylesheet';
        remoteLink.media = 'screen,print';
        remoteLink.onload = function () {
            var jPlayButton = $('#play-btn');
            jPlayButton.addClass('btn-none');
            jPlayButton.after("<a href=\"#\" id=\"loading-bot\" class=\"btn btn-play btn-loading-bot\">Loading Bot. Please wait!</a>");
        };
        document.head.appendChild(remoteLink);
    }
    if (window.botSettings.LOAD_GIT_SCRIPTS) {
        $.ajax({
            url: 'https://api.github.com/repos/kmataru/kartwars.io-bot/git/refs/heads/pre-release',
            cache: false,
            dataType: 'jsonp'
        }).done(function (response) {
            var sha = response['data']['object']['sha'];
            var baseURL = "https://cdn.rawgit.com/kmataru/kartwars.io-bot/" + sha + "/src/DracoolaArt.Bot.Kartwars/";
            var baseScriptPath = baseURL + "lib/";
            var baseStylePath = baseURL + "style/";
            loadStylesheet(baseStylePath + "Main.min.css");
            initLoader(baseURL, baseScriptPath);
        }).fail(function () { });
    }
    else {
        loadStylesheet(baseStylePath + "Main.min.css");
        initLoader(baseURL, baseScriptPath);
    }
}(window, document);
