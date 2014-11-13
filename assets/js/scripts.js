window.addEventListener("load", function() {
    if (document.getElementsByTagName && !document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")) {
        var imgs = document.getElementsByTagName("img");

        for (var i = 0, svg; i < imgs.length; i++)
            if (svg = /^(.*?img\/)([^.]+)\.svg$/.exec(imgs[i].src))
                imgs[i].src = svg[1] + "generated/" + svg[2] + ".png";
        }

    // If there's no ecmascript 5 support, don't try to initialize
    if (!Object.create || !window.JSON) return;

    var sandboxHint = null;
    if (window.chapNum && window.chapNum < 20 && window.localStorage && !localStorage.getItem("usedSandbox")) {
        var pres = document.getElementsByTagName("pre");
        for (var i = 0; i < pres.length; i++) {
            var pre = pres[i];
            if (!/^(text\/)?(javascript|html)$/.test(pre.getAttribute("data-language")) || chapNum == 1 && !/console\.log/.test(pre.textContent))
                continue;

            sandboxHint = elt("div", {"class": "sandboxhint"}, "edit & run code by clicking it");
            pre.insertBefore(sandboxHint, pre.firstChild);
            break;
        }
    }

    document.body.addEventListener("click", function(e) {
        for (var n = e.target; n; n = n.parentNode) {
            if (n.className == "c_ident")
                return;

            var lang = n.nodeName == "PRE" && n.getAttribute("data-language");
            if (/^(text\/)?(javascript|html)$/.test(lang))
                return activateCode(n, e, lang);

            if (n.nodeName == "DIV" && n.className == "solution")
                n.className = "solution open";
        }
    });

    function elt(type, attrs) {
        var firstChild = 1;
        var node = document.createElement(type);
        if (attrs && typeof attrs == "object" && attrs.nodeType == null) {
            for (var attr in attrs) if (attrs.hasOwnProperty(attr)) {
                if (attr == "css") node.style.cssText = attrs[attr];
                    else node.setAttribute(attr, attrs[attr]);
            }

            firstChild = 2;
        }
        for (var i = firstChild; i < arguments.length; ++i) {
            var child = arguments[i];
            if (typeof child == "string")
                child = document.createTextNode(child);

            node.appendChild(child);
        }

        return node;
    }

    CodeMirror.commands[CodeMirror.keyMap.default.Down = "lineDownEscape"] = function(cm) {
        var cur = cm.getCursor();

        if (cur.line == cm.lastLine()) {
            document.activeElement.blur();
            return CodeMirror.Pass;
        } else {
            cm.moveV(1, "line");
        }
    };

    CodeMirror.commands[CodeMirror.keyMap.default.Up = "lineUpEscape"] = function(cm) {
        var cur = cm.getCursor();

        if (cur.line == cm.firstLine()) {
            document.activeElement.blur();
            return CodeMirror.Pass;
        } else {
            cm.moveV(-1, "line");
        }
    };

    var keyMap = {
        Esc: function(cm) { cm.display.input.blur(); },
        "Ctrl-Enter": function(cm) { runCode(cm.state.context); },
        "Ctrl-D": function(cm) { closeCode(cm.state.context); },
        "Ctrl-Q": resetSandbox
    };

    var nextID = 0;
    var article = document.getElementsByTagName("article")[0];

    function activateCode(node, e, lang) {
        if (sandboxHint) {
            sandboxHint.parentNode.removeChild(sandboxHint);
            sandboxHint = null;
            localStorage.setItem("usedSandbox", "true");
        }

        var code = node.textContent;
        var wrap = node.parentNode.insertBefore(elt("div", {"class": "editor-wrap"}), node);
        var editor = CodeMirror(function(div) {wrap.insertBefore(div, wrap.firstChild)}, {
            value: code,
            mode: lang,
            extraKeys: keyMap,
            matchBrackets: true,
            lineNumbers: true
        });

        wrap.style.marginLeft = wrap.style.marginRight = -Math.min(article.offsetLeft, 100) + "px";
        setTimeout(function() { editor.refresh(); }, 600);

        if (e) {
            editor.setCursor(editor.coordsChar({left: e.clientX, top: e.clientY}, "client"));
            editor.focus();
        }

        var out = wrap.appendChild(elt("div", {"class": "sandbox-output"}));
        var menu = wrap.appendChild(elt("div", {"class": "sandbox-menu", title: "Sandbox menu..."}));
        var sandbox = node.getAttribute("data-sandbox");

        if (lang == "text/html" && !sandbox) {
            sandbox = "html" + nextID++;
            node.setAttribute("data-sandbox", sandbox);
            sandboxSnippets[sandbox] = node;
        }

        node.style.display = "none";

        var data = editor.state.context = {
            editor: editor,
            wrap: wrap,
            orig: node,
            isHTML: lang == "text/html",
            sandbox: sandbox
        };

        data.output = new SandBox.Output(out);

        menu.addEventListener('click', function() {
            openMenu(data, menu);
        });
    }

    function openMenu(data, node) {
        var menu = elt("div", {"class": "sandbox-open-menu"});
        var items = [["Rodar código (ctrl-enter)", function() { runCode(data); }],
                 ["Voltar ao código original", function() { revertCode(data); }],
                 ["Resetar Código (ctrl-q)", function() { resetSandbox(data.sandbox); }]];

        if (!data.isHTML || !data.sandbox)
            items.push(["Desativar editor (ctrl-d)", function() { closeCode(data); }]);

        items.forEach(function(choice) {
            menu.appendChild(elt("div", choice[0]));
        });

        function click(e) {
            var target = e.target;

            if (e.target.parentNode == menu) {
                for (var i = 0; i < menu.childNodes.length; ++i)
                    if (target == menu.childNodes[i])
                        items[i][1]();
            }

            menu.parentNode.removeChild(menu);
            window.removeEventListener("click", click);
        }


        setTimeout(function() {
            window.addEventListener("click", click);
        }, 20);

        node.offsetParent.appendChild(menu);
    }

    function runCode(data) {
        data.output.clear();
        var val = data.editor.getValue();
        var sb = data.sandbox;

        getSandbox(data.sandbox, data.isHTML, function(box) {
            if (data.isHTML)
                box.setHTML(val, data.output, function() {
                if (data.orig.getAttribute("data-focus"))
                    box.win.focus();
                });
            else
                box.run(val, data.output);
        });
    }

    function closeCode(data) {
        if (data.isHTML && data.sandbox)
            return;

        data.wrap.parentNode.removeChild(data.wrap);
        data.orig.style.display = "";
    }

    function revertCode(data) {
        data.editor.setValue(data.orig.textContent);
    }

    var sandboxSnippets = function() {
        var result = {};
        var snippets = document.getElementsByClassName("snippet");

        for (var i = 0; i < snippets.length; i++) {
            var snippet = snippets[i];
            if (snippet.getAttribute("data-language") == "text/html" && snippet.getAttribute("data-sandbox"))
                result[snippet.getAttribute("data-sandbox")] = snippet;
        }

        return result;
    }();

    var sandboxes = {};
    function getSandbox(name, forHTML, callback) {
        name = name || "null";
        if (sandboxes.hasOwnProperty(name))
            return callback(sandboxes[name]);

        var options = {loadFiles: window.sandboxLoadFiles}, html;

        if (sandboxSnippets.hasOwnProperty(name)) {
            var snippet = sandboxSnippets[name];
            options.place = function(node) { placeFrame(node, snippet); };

            if (!forHTML)
                html = snippet.textContent;
        }

        new SandBox(options, function(box) {
            if (html != null)
                box.win.document.documentElement.innerHTML = html;

            sandboxes[name] = box;
            callback(box);
        });
    }

    function resetSandbox(name) {
        name = name || "null";
        if (!sandboxes.hasOwnProperty(name))
            return;

        var frame = sandboxes[name].frame;
        frame.parentNode.removeChild(frame);
        delete sandboxes[name];
    }

    function placeFrame(frame, snippet) {
        var wrap = snippet.previousSibling;
        if (!wrap || wrap.className != "editor-wrap") {
            var bot = snippet.getBoundingClientRect().bottom;
            activateCode(snippet, null, "text/html");
            wrap = snippet.previousSibling;
        } else {
            bot = wrap.getBoundingClientRect().bottom;
        }

        wrap.insertBefore(frame, wrap.childNodes[1]);

        if (bot < 50) {
            var newBot = wrap.getBoundingClientRect().bottom;
            window.scrollBy(0, newBot - bot);
        }
    }
});
