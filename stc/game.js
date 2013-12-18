var hex_size = 35;
var hex_width = (Math.cos(Math.PI / 6) * hex_size * 2);
var hex_height = Math.sin(Math.PI / 6) * hex_size + hex_size;

function hexCenter(row, col) {
    var x_offset = row % 2 ? hex_width / 2 : 0;
    var x = 5 + hex_size + col * hex_width + x_offset,
        y = 5 + hex_size + row * hex_height;
    return [x, y];
}

var colors = {
    red: '#e04040',
    green: '#40a040',
    yellow: '#e0e040',
    brown: '#a06040',
    blue: '#2080f0',
    black: '#000000',
    white: '#ffffff',
    gray: '#808080',
    orange: '#f0c040',
    player: '#c0c0c0',
    activeUI: '#8f8'
};

var bgcolors = {
    red: '#f08080',
    green: '#80f080',
    yellow: '#f0f080',
    blue: '#60c0f0',
    black: '#404040',
    white: '#ffffff',
    gray: '#c0c0c0',
    brown: '#b08040',
    player: '#404040'
};

var cult_bgcolor = {
    FIRE: "#f88",
    WATER: "#ccf",
    EARTH: "#b84",
    AIR: "#f0f0f0"
};

function drawText(ctx, text, x, y, font) {
    ctx.save();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = 0.1;
    ctx.font = font;
    ctx.fillText(text, x, y);
    ctx.strokeText(text, x, y);            
    ctx.restore();    
}

function makeHexPath(ctx, x, y, size) {
    var angle = 0;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (var i = 0; i < 6; i++) {
        ctx.lineTo(x, y); 
        angle += Math.PI / 3;
        x += Math.sin(angle) * size;
        y += Math.cos(angle) * size;        
    }
    ctx.closePath();
}

function makeMapHexPath(ctx, hex, size) {
    size = size || hex_size;
    var loc = hexCenter(hex.row, hex.col);
    var x = loc[0] - Math.cos(Math.PI / 6) * size;
    var y = loc[1] + Math.sin(Math.PI / 6) * size;
    makeHexPath(ctx, x, y, size);
}

function fillBuilding(ctx, hex) {
    ctx.fillStyle = colors[hex.color];
    ctx.fill();

    if (hex.color == "black") {
        ctx.strokeStyle = '#808080';
    } else {
        ctx.strokeStyle = '#000';
    }
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawDwelling(ctx, hex) {
    var loc = hexCenter(hex.row, hex.col);

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(loc[0], loc[1] - 10);
    ctx.lineTo(loc[0] + 10, loc[1]);
    ctx.lineTo(loc[0] + 10, loc[1] + 10);
    ctx.lineTo(loc[0] - 10, loc[1] + 10);
    ctx.lineTo(loc[0] - 10, loc[1]);
    ctx.closePath();

    fillBuilding(ctx, hex);

    ctx.restore();
}

function drawTradingPost(ctx, hex) {
    var loc = hexCenter(hex.row, hex.col);

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(loc[0], loc[1] - 20);
    ctx.lineTo(loc[0] + 10, loc[1] - 10);
    ctx.lineTo(loc[0] + 10, loc[1] - 3);
    ctx.lineTo(loc[0] + 20, loc[1] - 3);
    ctx.lineTo(loc[0] + 20, loc[1] + 10);
    ctx.lineTo(loc[0] - 10, loc[1] + 10);
    ctx.lineTo(loc[0] - 10, loc[1]);
    ctx.lineTo(loc[0] - 10, loc[1] - 10);
    ctx.closePath();

    fillBuilding(ctx, hex);

    ctx.restore();
}

function drawTemple(ctx, hex) {
    var loc = hexCenter(hex.row, hex.col);
    loc[1] -= 5;

    ctx.save();

    ctx.beginPath();
    ctx.arc(loc[0], loc[1], 14, 0.001, Math.PI*2, false);

    fillBuilding(ctx, hex);

    ctx.restore();
}


function drawStronghold(ctx, hex) {
    var loc = hexCenter(hex.row, hex.col);
    loc[1] -= 5;
    var size = 15;
    var bend = 10;

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(loc[0] - size, loc[1] - size);
    ctx.quadraticCurveTo(loc[0] - bend, loc[1],
                         loc[0] - size, loc[1] + size);
    ctx.quadraticCurveTo(loc[0], loc[1] + bend,
                         loc[0] + size, loc[1] + size);
    ctx.quadraticCurveTo(loc[0] + bend, loc[1],
                         loc[0] + size, loc[1] - size);
    ctx.quadraticCurveTo(loc[0], loc[1] - bend,
                         loc[0] - size, loc[1] - size);

    fillBuilding(ctx, hex);

    ctx.restore();
}

function drawSanctuary(ctx, hex) {
    var loc = hexCenter(hex.row, hex.col);
    var size = 7;
    loc[1] -= 5;

    ctx.save();

    ctx.beginPath();
    ctx.arc(loc[0] - size, loc[1], 12, Math.PI / 2, -Math.PI / 2, false);
    ctx.arc(loc[0] + size, loc[1], 12, -Math.PI / 2, Math.PI / 2, false);
    ctx.closePath();
    
    fillBuilding(ctx, hex);

    ctx.restore();
}

function drawHex(ctx, elem) {
    if (elem == null) {
        return;
    }

    var hex = elem.value;
    var id = elem.key;

    if (hex.row == null) {
        return;
    }

    var loc = hexCenter(hex.row, hex.col);

    if (hex.color == 'white') {
        if (hex.town || hex.possible_town) {
            var loc = hexCenter(hex.row, hex.col);
            ctx.save();
            var scale = hex.town ? 2 : 2.5;
            makeMapHexPath(ctx, hex, hex_size / scale);

            if (hex.town) {
                ctx.fillStyle = "#def";
                ctx.fill();

                ctx.strokeStyle = "#456";
            } else {
                ctx.strokeStyle = "#bbb";
            }
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.restore();
        }

        if (hex.possible_town) {
            drawText(ctx, id, loc[0] - 9, loc[1] + 25,
                     "12px Verdana");
        }

        return;
    }

    makeMapHexPath(ctx, hex);

    ctx.save();
    ctx.fillStyle = bgcolors[hex.color];
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    makeMapHexPath(ctx, hex);
    ctx.stroke();
    ctx.restore();

    if (hex.building == 'D') {
        drawDwelling(ctx, hex);
    } else if (hex.building == 'TP' || hex.building == 'TH') {
        drawTradingPost(ctx, hex);
    } else if (hex.building == 'TE') {
        drawTemple(ctx, hex);
    } else if (hex.building == 'SH') {
        drawStronghold(ctx, hex);
    } else if (hex.building == 'SA') {
        drawSanctuary(ctx, hex);
    }

    ctx.save();
    if (hex.color == "black") {
        ctx.strokeStyle = "#c0c0c0";
    } else {
        ctx.strokeStyle = "#000";
    }
    drawText(ctx, id, loc[0] - 9, loc[1] + 25,
             hex.town ? "bold 12px Verdana" : "12px Verdana");
    ctx.restore();
}

function drawBridge(ctx, from, to, color) {
    var from_loc = hexCenter(state.map[from].row, state.map[from].col);
    var to_loc = hexCenter(state.map[to].row, state.map[to].col);

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(from_loc[0], from_loc[1]);
    ctx.lineTo(to_loc[0], to_loc[1]);

    ctx.strokeStyle = '#222';
    ctx.lineWidth = 10;
    ctx.stroke();
    
    ctx.strokeStyle = colors[color];
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.restore();
}

    
function drawActiveHexBorder(hex) {
    var canvas = $("map");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        makeMapHexPath(ctx, hex);

        ctx.save();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 4;
        makeMapHexPath(ctx, hex);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = colors.activeUI;
        ctx.lineWidth = 3;
        makeMapHexPath(ctx, hex);
        ctx.stroke();
        ctx.restore();
    }
}

function drawMap() {
    var canvas = $("map");
    if (canvas.getContext) {
        canvas.width = canvas.width;
        var ctx = canvas.getContext("2d");

        state.bridges.each(function(bridge, index) {
            drawBridge(ctx, bridge.from, bridge.to, bridge.color);
        });

        $H(state.map).each(function(hex, index) { drawHex(ctx, hex) });
    }
}

function hexClickHandler(fun) {
    return function (event) {
        $("menu").hide();
        var position = $("map").getBoundingClientRect();
        var x = event.clientX - position.left;
        var y = event.clientY - position.top;
        var best_dist = null;
        var best_loc = null;
        for (var r = 0; r < 9; ++r) {
            for (var c = 0; c < 13; ++c) {
                var center = hexCenter(r, c);
                var xd = (x - center[0]);
                var yd = (y - center[1]);
                var dist = xd*xd + yd*yd;
                if (best_dist == null || dist < best_dist) {
                    best_loc = [r, c];
                    best_dist = dist;
                }
            }
        }
        var hex_id = null;
        $H(state.map).each(function(elem) {
            var hex = elem.value;
            if (hex.row == best_loc[0] &&
                hex.col == best_loc[1]) {
                hex_id = elem.key;
            }
        });
        if (hex_id != null && fun != null) {
            fun(hex_id, event);
        }
    };
}

var cults = ["FIRE", "WATER", "EARTH", "AIR"];
var cult_width = 250 / 4;

function drawCults() {
    var canvas = $("cults");
    if (canvas.getContext) {
        canvas.width = canvas.width;
        var ctx = canvas.getContext("2d");

        var x_offset = 0;

        var width = cult_width;
        var height = 500;

        for (var j = 0; j < 4; ++j) {
            var cult = cults[j];

            ctx.save();

            ctx.translate(width * j, 0);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, height);
            ctx.lineTo(width, height);
            ctx.lineTo(width, 0);
            ctx.closePath();
            ctx.fillStyle = cult_bgcolor[cult];
            ctx.fill();

            drawText(ctx, cult, 5, 15, "15px Verdana");

            ctx.translate(0, 20);

            var seen10 = false;

            for (var i = 10; i >= 0; --i) {
                ctx.save();
                ctx.translate(0, ((10 - i) * 40 + 20));

                drawText(ctx, i, 5, 0, "15px Verdana");

                state.order.each(function(name, index) {
                    var faction = state.factions[name];
                    if (faction[cult] != i) {
                        return;
                    }

                    ctx.translate(12, 0);

                    drawCultMarker(ctx, faction.color, name,
                                   !seen10 && (i == 10 || faction.KEY > 0));
                    if (i == 10) {
                        seen10 = true;
                    }
                });

                ctx.restore();
            }

            ctx.save();
            ctx.translate(8, 470);
            ctx.font = "15px Verdana";
            ctx.lineWidth = 0.2;

            for (var i = 1; i < 5; ++i) {
                var text = (i == 1 ? 3 : 2);
                ctx.fillStyle = "#000";
                ctx.strokeStyle = "#000";

                var slot = state.map[cult + i];

                if (slot.building) {
                    text = "p";
                    ctx.fillStyle = colors[slot.color];
                    ctx.strokeStyle = colors[slot.color];
                }
                ctx.fillText(text, 0, 0);
                ctx.strokeText(text, 0, 0);

                ctx.translate(12, 0);
            }
            ctx.restore();

            ctx.restore();
        };

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.translate(0, 60.5);
        ctx.moveTo(0, 0); ctx.lineTo(250, 0);
        ctx.moveTo(0, 3); ctx.lineTo(250, 3);
        ctx.moveTo(0, 6); ctx.lineTo(250, 6);

        ctx.translate(0, 120);
        ctx.moveTo(0, 0); ctx.lineTo(250, 0);
        ctx.moveTo(0, 3); ctx.lineTo(250, 3);

        ctx.translate(0, 80);
        ctx.moveTo(0, 0); ctx.lineTo(250, 0);
        ctx.moveTo(0, 3); ctx.lineTo(250, 3);

        ctx.translate(0, 80);
        ctx.moveTo(0, 0); ctx.lineTo(250, 0);

        ctx.stroke();
        ctx.restore();
    }
}

function drawActiveCultBorder(cult) {
    var canvas = $("cults");
    var cult_index = cults.indexOf(cult);

    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        path = function() {
            ctx.translate(4 + cult_width * cult_index, 495);
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -20);
            ctx.lineTo(cult_width - 4*2, -20);
            ctx.lineTo(cult_width - 4*2, 0);
            ctx.lineTo(0, 0);
        }

        ctx.beginPath();

        ctx.save();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 4;
        path();
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = colors.activeUI;
        ctx.lineWidth = 3;
        path();
        ctx.stroke();
        ctx.restore();
    }
}

function cultClickHandler(fun) {
    return function (event) {
        $("menu").hide();
        var position = $("cults").getBoundingClientRect();
        var x = event.clientX - position.left;
        var y = event.clientY - position.top;
        if (y < 470) { return }
        for (var i = 0; i < 4; ++i) {
            if (x < (i+1) * cult_width) {
                return fun(cults[i], event);
            }
        }
    };
}

function drawCultMarker(ctx, color, name, hex) {
    ctx.save();
    ctx.beginPath();

    if (hex) {
        strokeCultMarkerHex(ctx);
    } else {
        strokeCultMarkerArc(ctx);
    }

    ctx.fillStyle = colors[color];
    ctx.fill();
    ctx.stroke()
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = (color == 'black' ? '#ccc' : '#000');
    ctx.textAlign = 'center';
    var l = name[0].toUpperCase();
    if (name == 'cultists') { l  = 'c' }
    drawText(ctx, l, -2, 14,
             "bold 10px Verdana");
    ctx.restore();
}

function strokeCultMarkerArc(ctx) {
    ctx.arc(0, 10, 8, 0.001, Math.PI * 2, false);
}

function strokeCultMarkerHex(ctx) {
    ctx.save();
    makeHexPath(ctx, -8, 14, 8.5);
    ctx.restore();
}

function renderAction(canvas, name, key, border_color) {
    if (!canvas.getContext) {
        return;
    }

    var ctx = canvas.getContext("2d");

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(2, 2);

    if (state.map[key] && state.map[key].blocked) {
        ctx.fillStyle = '#ccc';
    } else {
        ctx.fillStyle = colors.orange;
    }
    ctx.strokeStyle = '#000';

    var edge = 13;
    ctx.translate(0.5, 0.5);
    ctx.moveTo(0, 1*edge);
    ctx.lineTo(1*edge, 0);
    ctx.lineTo(2*edge, 0);
    ctx.lineTo(3*edge, 1*edge);
    ctx.lineTo(3*edge, 2*edge);
    ctx.lineTo(2*edge, 3*edge);
    ctx.lineTo(1*edge, 3*edge);
    ctx.lineTo(0, 2*edge);
    ctx.lineTo(0, 1*edge);
    ctx.closePath();

    ctx.fill();

    if (border_color != '#000') {
        ctx.save();
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
    }

    ctx.save();
    ctx.strokeStyle = border_color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
 
    var font = "12px Verdana";
    if (!name.startsWith("FAV") && !name.startsWith("BON")) {
        drawText(ctx, name, 5, 52, font);
    }

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    var center = 19;
    var bottom = 60;

    var data = {
        "ACT1": function() {
            drawText(ctx, "br", center, center, font);
            drawText(ctx, "-3PW", center, 60, font);
        },
        "ACT2": function() {
            drawText(ctx, "P", center, center, font);
            drawText(ctx, "-3PW", center, 60, font);
        },
        "ACT3": function() {
            drawText(ctx, "2W", center, center, font);
            drawText(ctx, "-4PW", center, 60, font);
        },
        "ACT4": function() {
            drawText(ctx, "7C", center, center, font);
            drawText(ctx, "-4PW", center, 60, font);
        },
        "ACT5": function() {
            drawText(ctx, "spd", center, center, font);
            drawText(ctx, "-4PW", center, 60, font);
        },
        "ACT6": function() {
            drawText(ctx, "2 spd", center, center, font);
            drawText(ctx, "-6PW", center, 60, font);
        },
        "ACTA": function() {
            drawText(ctx, "2cult", center, center, font);
        },
        "ACTN": function() {
            drawText(ctx, "tf", center, center, font);
        },
        "ACTS": function() {
            drawText(ctx, "TP", center, center, font);
        },
        "ACTW": function() {
            drawText(ctx, "D", center, center, font);
        },
        "BON1": function() {
            drawText(ctx, "spd", center, center, font);
        },
        "BON2": function() {
            drawText(ctx, "cult", center, center, font);
        },
        "FAV6": function() {
            drawText(ctx, "cult", center, center, font);
        }
    };

    if (data[name]) {
        data[name]();
    }

    ctx.restore();

    ctx.restore();
}

function cultStyle(name) {
    if (cult_bgcolor[name]) {
        return "style='background-color:" + cult_bgcolor[name] + "'";
    }

    return "";
}

function insertAction(parent, name, key) {
    parent.insert(new Element('canvas', {
        'id': 'action/' + key, 'class': 'action', 'width': 50, 'height': 70}));
    var canvas = parent.childElements().last();
    renderAction(canvas, name, key, '#000');
}

function renderTile(div, name, record, faction, count) {
    div.insert(name);
    if (state.map[name] && state.map[name].C) {
        div.insert(" [#{C}c]".interpolate(state.map[name]));
    }
    if (count > 1) {
        div.insert("(x" + count + ")");
    }
    div.insert("<hr>");

    if (!record) {
        return;
    }

    $H(record.gain).each(function (elem, index) {
        elem.style = cultStyle(elem.key);
        div.insert("<div><span #{style}>#{value} #{key}</span></div>".interpolate(elem));
    });
    $H(record.vp).each(function (elem, index) {
        div.insert("<div>#{key} &gt;&gt; #{value} vp</div>".interpolate(elem));
    });
    $H(record.pass_vp).each(function (elem, index) {
        elem.value = passVpString(elem.value);
        div.insert("<div>pass-vp:#{key}#{value}</div>".interpolate(elem));
    });
    if (record.action) {
        insertAction(div, name, name + "/" + faction);
    }
    $H(record.income).each(function (elem, index) {
        div.insert("<div>+#{value} #{key}</div>".interpolate(elem));
    });
    $H(record.special).each(function (elem, index) {
        div.insert("<div>#{value} #{key}</div>".interpolate(elem));
    });
}

function passVpString(vps) {
    var stride = vps[1] - vps[0];
    for (var i = 1; i < vps.length; ++i) {
        if (vps[i-1] + stride != vps[i]) {
            stride = null;
            break;
        }
    }
    
    if (stride) {
        return "*" + stride;
    } else {
        return" [" + vps + "]";
    }
}

function renderBonus(div, name, faction) {
    renderTile(div, name, state.bonus_tiles[name], faction, 1);
}

function renderFavor(div, name, faction, count) {
    renderTile(div, name, state.favors[name], faction, count);
}

function renderTown(div, name, faction, count) {
    if (count != 1) {
        div.insert(name + " (x" + count + ")");
    } else {
        div.insert(name);
    }

    var head = "#{VP} vp".interpolate(state.towns[name].gain);
    if (state.towns[name].gain.KEY != 1) {
        head += ", #{KEY} keys".interpolate(state.towns[name].gain);
    } 
    div.insert(new Element("div").update(head));
    $H(state.towns[name].gain).each(function(elem, index) {
        var key = elem.key;
        var value = elem.value;
        elem.style = cultStyle(key);

        if (key != "VP" && key != "KEY") {
            div.insert("<div><span #{style}>#{value} #{key}</span></div>".interpolate(elem));
        }
    });
}

function naturalSortKey(val) {
    var components = val.key.match(/(\d+|\D+)/g);
    var key = [];

    components.each(function(elem) {
        if (elem.match(/\d/)) {
            key.push(parseInt(elem) + 1e6);
        } else {
            key.push(elem);
        }
    });

    return key;
}

function renderTreasuryTile(board, faction, name, count) {
    if (count < 1) {
        return;
    }

    if (name.startsWith("ACT")) {
        insertAction(board, name, name);
        return;
    } else if (name.startsWith("BON")) {
        board.insert(new Element('div', {
            'class': 'bonus'}));
        var div = board.childElements().last();
        renderBonus(div, name, faction);            
    } else if (name.startsWith("FAV")) {
        board.insert(new Element('div', {
            'class': 'favor'}));
        var div = board.childElements().last();
        renderFavor(div, name, faction, count);
        return;
    } else if (name.startsWith("TW")) {
        board.insert(new Element('div', {
            'class': 'town'}));
        var div = board.childElements().last();
        renderTown(div, name, faction, count);
        return;
    }
}


function renderTreasury(board, treasury, faction, filter) {
    $H(treasury).sortBy(naturalSortKey).each(function(elem, index) {
        var name = elem.key;
        var value = elem.value;

        if (!filter || filter(name)) {
            renderTreasuryTile(board, faction, name, value);
        }
    });
}

function makeBoard(color, name, klass, style) {
    var board = new Element('div', {
        'class': klass,
        'style': style
    });
    board.insert(new Element('div', {
        'style': 'padding: 1px 1px 1px 5px; background-color: ' + colors[color] + '; color: ' +
            (color == 'black' ? '#ccc' : '#000')
    }).update(name));

    return board;
}

var cycle = [ "red", "yellow", "brown", "black", "blue", "green", "gray" ]; 

function renderColorCycle(parent, startColor) {
    parent.insert(new Element('canvas', {
        'class': 'colorcycle', 'width': 90, 'height': 80}));
    var canvas = parent.childElements().last();

    if (!canvas.getContext) {
        return;
    }

    var ctx = canvas.getContext("2d");

    ctx.save()
    ctx.translate(40, 41);

    var base = cycle.indexOf(startColor);

    for (var i = 0; i < 7; ++i) {
        ctx.save()
        ctx.beginPath();
        ctx.arc(0, -30, 10, Math.PI * 2, 0, false);

        ctx.fillStyle = bgcolors[cycle[(base + i) % 7]];
        ctx.fill();
    
        ctx.stroke();
        ctx.restore();
        ctx.rotate(Math.PI * 2 / 7);
    }

    ctx.restore();
}

function rowFromArray(array, style) {
    var tr = new Element("tr", {'style': style});
    array.each(function(elem) {
        tr.insert(new Element("td").update(elem));
    });

    return tr;
}

function toggleIncome(id) {
    var table = $(id);

    table.childElements().each(function (elem, index) {
        if (index != 0) {
            elem.style.display = (elem.style.display == 'none' ? '' : 'none');
        }
    });
}

function toggleBuildings(id) {
    var table = $(id);

    table.childElements().each(function (elem, index) {
        if (index > 1) {
            elem.style.display = (elem.style.display == 'none' ? '' : 'none');
        }
    });
}

function toggleVP(id) {
    $(id).style.display = ($(id).style.display == 'none' ? '' : 'none');
}

function commentAnchor(string) {
    return string.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
}

function drawFactions() {
    $("factions").innerHTML = "";

    var order = state.order.concat([]);
    for (var i = order.size(); i < state.players.size(); ++i) {
        var pseudo_faction = "player" + (i+1);
        order.push(pseudo_faction);
        state.factions[pseudo_faction] = {
            display: "Player " + (i+1),
            username: state.players[i].username,
            player: state.players[i].displayname,
            color: 'player',
            placeholder: true,
            start_player: i == 0,
            registered: state.players[i].username != null
        };
    }

    if (currentFaction && order.indexOf(currentFaction) >= 0) {
        while (order[0] != currentFaction) {
            order.push(order.shift());
        }
    }

    order.each(function(name) {
        drawFaction(name);
    });

   
    var pool = makeBoard("orange", "Pool", 'pool');
    renderTreasury(pool, state.pool, 'pool',
                   function (tile) { return !tile.match(/^ACT/) } );
    $("shared-actions").update("");
    renderTreasury($("shared-actions"), state.pool, '',
                   function (tile) { return tile.match(/^ACT/) } );
    $("factions").insert(pool);
}

function drawFaction(name) {
    var faction = state.factions[name];
    var color = faction.color;
    var title = factionDisplayName(faction);

    var style ='float: left; margin-right: 20px; ';
    if (faction.passed) {
        style += 'opacity: 0.5';
        title += ", passed";
    }

    if (faction.start_player) {
        title += ", start player";
    }

    var container = new Element('div', { 'class': 'faction-board' });
    var board = makeBoard(color, title, '', style);
    container.insert(board);

    if (!faction.placeholder) {
        drawRealFaction(faction, board);
    }

    renderColorCycle(container, faction.color);
    renderTreasury(container, faction, name);
    
    $("factions").insert(container);
}

function drawRealFaction(faction, board) {
    var info = new Element('div', {'class': 'faction-info' });
    board.insert(info);

    if (faction.vp_source) {
        var vp_id = faction.name + "/vp";
        var vp_breakdown = new Element('table', {'id': vp_id,
                                                 'style': 'display: none',
                                                 'class': 'vp-breakdown'});
        board.insert(vp_breakdown);
        vp_breakdown.insert("<tr><td colspan=2><b>VP breakdown</b></td></tr>")
        $H(faction.vp_source).sortBy(function(a) { return -a.value}).each(function(record) {
            vp_breakdown.insert("<tr><td>#{key}<td>#{value}</tr>".interpolate(record));
        });
    }

    faction.vp_id = vp_id;
    info.insert(new Element('div').update(
        "#{C} c, #{W} w, #{P}<span style='color:#888'>/#{MAX_P}</span> p, <a href='javascript:toggleVP(\"#{name}/vp\")'>#{VP} vp</a>, #{P1}/#{P2}/#{P3} pw".interpolate(faction)));
    if (faction.BON4 > 0) {
        faction.ship_bonus = " (+1)";
    }

    var levels = [];

    if (faction.dig.max_level > 0) {
        var dig = "dig level #{dig.level}<span style='color:#888'>/#{dig.max_level}</span>".interpolate(faction);
        levels.push(dig);
    }

    if (faction.teleport) {
        levels.push("range " + faction[faction.teleport.type + "_range"] + "/" + faction[faction.teleport.type + "_max_range"]);
    }

    if (faction.ship.max_level > 0) {
        var ship = "ship level #{ship.level}<span style='color:#888'>/#{ship.max_level}</span>".interpolate(faction);
        if (faction.BON4 > 0) {
            ship += " (+1)";
        }
        levels.push(ship);
    }

    info.insert(new Element('div').update(levels.join(", ")));

    info.insert("<div></div>");

    var buildings_id = "buildings-" + name;
    var buildings = new Element('table', {'class': 'building-table', 'id': buildings_id});
    info.insert(buildings);

    var b = ['D', 'TP', 'TE', 'SH', 'SA'];
    var count = [];
    var cost = [];
    var income = [];

    b.each(function(key) {
        record = faction.buildings[key];
        record.key = key;
        var text = "#{level}/#{max_level}".interpolate(record);
        if (record.level == record.max_level && record.max_level > 3) {
            text = "<span style='color: red'>" + text + "</span>";
        }
        count.push(text);
        cost.push("#{advance_cost.C}c,&#160;#{advance_cost.W}w".interpolate(record));
        if (record.level == record.max_level) {
            income.push("");
        } else {
            var income_delta = [];
            ["C", "W", "P", "PW"].each(function(type) {
                var type_income = record.income[type];
                if (!type_income) { return; }
                var delta = type_income[record.level + 1] - type_income[record.level];
                if (delta > 0) {
                    income_delta.push(delta + type.toLowerCase());
                }
            });
            if (income_delta.size() > 0) {
                income.push("+" + income_delta.join(",&#160;"));
            } else {
                income.push("");
            }
        }
    });

    buildings.insert(rowFromArray(b, '').insert("<td><a href='javascript:toggleBuildings(\"" + buildings_id + "\")'>+</a>"));
    buildings.insert(rowFromArray(count, ''));
    buildings.insert(rowFromArray(cost, 'display: none'));
    buildings.insert(rowFromArray(income, 'display: none'));

    var income_id = "income-" + name;
    var income = new Element('table', {'class': 'income-table', 'id': income_id});
    info.insert(income);

    if (faction.income) {
	var row = new Element('tr');
        if (faction.income.P > faction.MAX_P - faction.P) {
            faction.income.P_style = "style='color: #f00'";
        }
        if (faction.income.PW > faction.P1 * 2 + faction.P2) {
            faction.income.PW_style = "style='color: #f00'";
        }

	row.update("<td>Income:<td>total<td>#{C}c<td>#{W}w<td #{P_style}>#{P}p<td #{PW_style}>#{PW}pw".interpolate(faction.income));
	row.insert(new Element('td').update("<a href='javascript:toggleIncome(\"" + income_id + "\")'>+</a>"));
        income.insert(row);
    }

    if (faction.income_breakdown) {
        income.insert(Element('tr', {'style': 'display: none'}).update("<td colspan=6><hr>"));
        $H(faction.income_breakdown).each(function(elem, ind) {
            if (!elem.value) {
                return;
            }

            elem.value.key = elem.key;
            var row = new Element('tr', {'style': 'display: none'});
            income.insert(row.update("<td><td>#{key}<td>#{C}<td>#{W}<td>#{P}<td>#{PW}".interpolate(elem.value)));
        });
    }

    if (faction.vp_projection) {
        var vp_proj_id = "vp-projection-" + name;
        var vp_proj = new Element('table', {'class': 'income-table', 'id': vp_proj_id});
        info.insert(vp_proj);
        {
	    var row = new Element('tr');
	    row.update("<td>VP projection:<td>total<td>#{total}".interpolate(faction.vp_projection));
	    row.insert(new Element('td').update("<a href='javascript:toggleIncome(\"" + vp_proj_id + "\")'>+</a>"));
            vp_proj.insert(row);
        }

        vp_proj.insert(Element('tr', {'style': 'display: none'}).update("<td colspan=3><hr>"));
        $H(faction.vp_projection).each(function(elem, ind) {
            if (!elem.value || elem.key == "total") {
                return;
            }

            var row = new Element('tr', {'style': 'display: none'});
            vp_proj.insert(row.update("<td><td>#{key}<td style='white-space: nowrap'>#{value}</nobr>".interpolate(elem)));
        });            
    }
}

function drawLedger() {
    var ledger = $("ledger");
    ledger.innerHTML = "";
    if ($("recent_moves")) {
        $("recent_moves").update("");
    }

    state.ledger.each(function(record, index) {
        if (record.comment) {
            ledger.insert("<tr id='" + commentAnchor(record.comment) + "'>" +
                          "<td><td colspan=13><b>" + 
                          record.comment.escapeHTML() +
                          "</b>" +
                          "<td><a href='" + showHistory(index + 1) +
                          "'>show history</a></tr>");

            var move_entry = new Element("tr");
            move_entry.insert(new Element("td", {"colspan": 2, "style": "font-weight: bold"}).update(
                record.comment.escapeHTML()));
        } else {
            record.bg = colors[state.factions[record.faction].color];
            record.fg = (record.bg == '#000000' ? '#ccc' : '#000');
            record.commands = record.commands.escapeHTML();

            if ($("recent_moves")) {
                if (record.faction == currentFaction &&
                    !/^(leech|decline)/i.match(record.commands)) {
                    $("recent_moves").update("");
                }

                var move_entry = new Element("tr");
                move_entry.insert(new Element("td").insert(
                    coloredFactionSpan(record.faction)));
                move_entry.insert(new Element("td").insert(
                    record.commands));
                $("recent_moves").insert(move_entry);
            }

            var row = "<tr><td style='background-color:#{bg}; color: #{fg}'>#{faction}".interpolate(record);
            ["VP", "C", "W", "P", "PW", "CULT"].each(function(key) {
                var elem = record[key];
                if (key != "CULT") { elem.type = key };
                if (!elem.delta) {
                    elem.delta = '';
                } else if (elem.delta > 0) {
                    elem.delta = "+" + elem.delta;
                }
                row += "<td class='ledger-delta'>#{delta}<td class='ledger-value'>#{value}&#160;#{type}</span>".
                    interpolate(elem);
            });

            var leech = "";
            $H(record.leech).each(function (elem, index) {
                if (elem.key == "black") {
                    elem.color = "#aaa";
                } else {
                    elem.color = "#000";
                }
                elem.key = colors[elem.key];
                leech += "<span style='color: #{color}; background-color: #{key}'>#{value}</span>&#160;".interpolate(elem);
            });
            row += "<td class='ledger-delta'>" + leech;

            row += "<td class='ledger-delta'>#{commands}</tr>".interpolate(record);
            ledger.insert(row);
            if (record.warning) {
                ledger.insert("<tr><td colspan=14><td><span class='warning'>" + 
                              record.warning.escapeHTML() +
                              "</span></tr>")
            }
        }
    });
}

function showHistory(row) {
    var loc = document.location.href;
    loc = loc.replace(/\/max-row=.*/, '');
    return "/game/" + params.game + "/max-row=" + row;
}

function drawScoringTiles() {
    var container = $("scoring");
    container.innerHTML = "";

    state.score_tiles.each(function(record, index) {
        var style = '';
        if (record.active) {
            style = 'background-color: #d0ffd0';
        } else if (record.old) {
            style = 'opacity: 0.5';
        }
        var tile = new Element('div', {'class': 'scoring', 'style': style});
        tile.insert(new Element('div', {'style': 'float: right; border-style: solid; border-width: 1px; '}).update("r" + (index + 1)));
        tile.insert(new Element('div').update(
            "<div class='scoring-head'>vp:</div><div>#{vp_display}</div>".interpolate(record)));
	if (record.income_display) {
            record.style = cultStyle(record.cult);
            tile.insert(new Element('div').update(
                "<div class='scoring-head'>income:</div><div><span #{style}>#{income_display}</span></div>".interpolate(record)));
	}
        container.insert(tile);
    });
}

function coloredFactionSpan(faction_name) {
    record = {};
    if (state.factions[faction_name]) {
        record.bg = colors[state.factions[faction_name].color];
        record.fg = (record.bg == '#000000' ? '#ccc' : '#000');
        record.display = factionDisplayName(state.factions[faction_name]);
    } else {
        var players = {};
        state.players.each(function (value, index) {
            players["player" + (index + 1)] = value.name.escapeHTML();
        });
        if (players[faction_name]) {
            return faction_name + " (" + players[faction_name] + ")"
        } else {
            return faction_name;
        }
    }

    return "<span style='background-color:#{bg}; color: #{fg}'>#{display}</span>".interpolate(record);
}

function factionDisplayName(faction, fg) {
    if (faction.registered) {
        faction.player_escaped = faction.player.escapeHTML();
        return "#{display} (<a style='color: inherit' href='/player/#{username}'>#{player_escaped}</a>)".interpolate(faction);
    } else {
        return "#{display} (#{player})".interpolate(faction);
    }
}

var allowSaving = false;
var map_click_handlers = {};
var cult_click_handlers = {};

function menuClickHandler(title, loc, funs) {
    funs = $H(funs);
    var select = function(loc, event) {
        var menu = $("menu");
        menu.hide();
        menu.update("");
        var head = new Element("div", {"style": "width: 100%"});
        head.insert(new Element("div", {"style": "white-space: nowrap"}).update(loc + ": " + title));
        menu.insert(head);


        $H(funs).each(function (elem) {
            var type = elem.key;
            var fun = elem.value.fun;
            var label = elem.value.label;

            var button = new Element("button").update(type);
            button.onclick = function() {
                menu.hide();
                fun(loc, type);
            }
            menu.insert(new Element("div", {"class": "menu-item"}).insert(button).insert(" ").insert(label));
        });


        var cancel = new Element("button").update("Cancel");
        menu.insert(new Element("div", {"class": "menu-item"}).insert(cancel));
        cancel.onclick = function () { menu.hide(); }

        menu.style.left = (event.pageX + 10) + "px";
        menu.style.top = event.pageY + 15 + "px";

        menu.show();
    }

    return select;
}

function addMapClickHandler(title, loc, funs) {
    if (false && funs.size() == 1) {
        var elem = funs.entries()[0];
        map_click_handlers[loc] = function(loc, event) {
            elem[1](loc, elem[0]);
        };
    } else {
        map_click_handlers[loc] = menuClickHandler(title, loc, funs);
    }
    drawActiveHexBorder(state.map[loc]);
}

function addCultClickHandler(title, cult, funs) {
    cult_click_handlers[cult] = menuClickHandler(title, cult, funs);
    drawActiveCultBorder(cult);
}

function drawActionRequired() {
    var parent = $("action_required");

    if (!parent) {
        return;
    }

    parent.innerHTML = "";

    var needMoveEntry = false;

    allowSaving = true;

    map_click_handlers = {};
    cult_click_handlers = {};

    $("map").onclick = hexClickHandler(function(hex, event) {
        if (map_click_handlers[hex] && moveEntryEnabled()) {
            map_click_handlers[hex](hex, event);
        }
    });

    $("cults").onclick = cultClickHandler(function(cult, event) {
        if (cult_click_handlers[cult] && moveEntryEnabled()) {
            cult_click_handlers[cult](cult, event);
        }
    });

    state.action_required.each(function(record, index) {
        if (record.type == 'full') {
            record.pretty = 'should take an action';
        } else if (record.type == 'leech') {
            record.from_faction_span = coloredFactionSpan(record.from_faction);
            record.pretty = 'may gain #{amount} power from #{from_faction_span}'.interpolate(record);
            if (record.actual != record.amount) {
                record.pretty += " (actually #{actual} power)".interpolate(record);
            }
        } else if (record.type == 'transform') {
            if (record.amount == 1) {
                record.pretty = 'may use a spade (click on map to transform)'.interpolate(record);
            } else if (record.amount == null) {
                record.pretty = 'may transform a space for free (click on map)'.interpolate(record);
            } else {
                record.pretty = 'may use #{amount} spades (click on map to transform)'.interpolate(record);
            }
        } else if (record.type == 'cult') {
            if (record.amount == 1) {
                record.pretty = 'may advance 1 step on a cult track'.interpolate(record);
            } else {
                record.pretty = 'may advance #{amount} steps on cult tracks'.interpolate(record);
            }
        } else if (record.type == 'town') {
            if (record.amount == 1) {
                record.pretty = 'may form a town'.interpolate(record);
            } else {
                record.pretty = 'may form #{amount} towns'.interpolate(record);
            }
        } else if (record.type == 'bridge') {
            record.pretty = 'may place a bridge'.interpolate(record);
        } else if (record.type == 'favor') {
            if (record.amount == 1) {
                record.pretty = 'must take a favor tile'.interpolate(record);
            } else {
                record.pretty = 'must take #{amount} favor tiles'.interpolate(record);
            }
        } else if (record.type == 'dwelling') {
            record.pretty = 'should place a dwelling (choose option or click on map)';
        } else if (record.type == 'upgrade') {
            record.pretty = 'may place a free #{to_building} upgrade (choose option or click on map)'.interpolate(record);
        } else if (record.type == 'bonus') {
            record.pretty = 'should pick a bonus tile';
        } else if (record.type == 'gameover') {
            if (state.metadata) {
                var age = seconds_to_pretty_time(state.metadata.time_since_update);
                record.pretty = "<span>The game is over (finished " + age + " ago)\n</span>";
            } else {
                record.pretty = "<span>The game is over</span>";
            }
            var table = "";
            $H(state.factions).sortBy(function(a) { return -a.value.VP }).each(function(elem) {
                elem.faction_span = coloredFactionSpan(elem.key);
                table += "<tr><td>#{faction_span}<td> #{value.VP}</tr>\n".interpolate(elem);
            });
            record.pretty += "<table>" + table + "</table>";
        } else if (record.type == 'faction') {
            record.pretty = '#{player} should pick a faction'.interpolate(record);
        } else if (record.type == 'not-started') {
            record.pretty = "Game hasn't started yet, #{player_count}/#{wanted_player_count} players have joined.".interpolate(record);
        } else if (record.type == 'planning') {
            record.pretty = 'are planning';
        } else {
            record.pretty = '?';
        }

	if (record.faction) {
            record.faction_span = coloredFactionSpan(record.faction);
	} else {
	    record.faction_span = "";
	}

        var row = new Element("div", {'style': 'margin: 3px'}).update("#{faction_span} #{pretty}</div>".interpolate(record));
        parent.insert(row);

        if (currentFaction &&
            (record.faction == currentFaction ||
             record.player_index == currentFaction)) {
            addFactionInput(parent, record, index);
            needMoveEntry = true;
            allowSaving = false;
        }
    });

    if (state.history_view) {
        return;
    }

    if (currentFaction && $("data_entry").innerHTML == "") {
        $("data_entry").insert("<div id='data_entry_tabs'></div>");
        $("data_entry_tabs").insert("<button onclick='dataEntrySelect(\"move\"); updateMovePicker();' id='data_entry_tab_move' class='tab' accesskey='m'>Moves</button>");
        $("data_entry_tabs").insert("<button onclick='initPlanIfNeeded(); dataEntrySelect(\"planning\")' id='data_entry_tab_planning' class='tab' accesskey='p'>Planning</button>");
        $("data_entry_tabs").insert("<button onclick='dataEntrySelect(\"recent\")' id='data_entry_tab_recent' class='tab' accesskey='r'>Recent Moves</button>");
        if (state.options["email-notify"]) {
            var style = "";
            if (newChatMessages()) {
                style = "color: red"
            }
            var chat_button = new Element("button", {"onclick": "initChatIfNeeded(); dataEntrySelect('chat')", "id": 'data_entry_tab_chat', "class":'tab', "style": style, "accesskey":  'c'});
            var label = "Chat";
            if (state.chat_unread_message_count > 0) {
                label += " [#{chat_unread_message_count} unread]".interpolate(state);
            } else if (state.chat_message_count > 0) {
                label += " [#{chat_message_count}]".interpolate(state);
            }
            chat_button.updateText(label);
            $("data_entry_tabs").insert(chat_button);
        }
        $("data_entry").insert("<div id='move_entry' class='tab_content'></div>");
        $("data_entry").insert("<div id='planning_entry' class='tab_content'></div>");
        $("data_entry").insert("<div id='recent_entry' class='tab_content'></div>");
        $("data_entry").insert("<div id='chat_entry' class='tab_content'></div>");
        dataEntrySelect("move");
    }

    if ($("planning_entry") && $("planning_entry").innerHTML == "") {
        var input = new Element("textarea", {"id": "planning_entry_input",
                                             "style": "font-family: monospace; width: 60ex; height: 12em;" } );
        $("planning_entry").insert(input);
        $("planning_entry").insert("<div style='padding-left: 2em'><button id='planning_entry_action' onclick='javascript:previewPlan()'>Show Result</button><button id='planning_entry_action' onclick='javascript:savePlan()'>Save Plan</button><br><div id='planning_entry_explanation'>Use this entry box to leave notes for yourself, or to plan your coming moves using the same input format as for normal play. View the effects of the plan with 'show result' or save the plan / notes for later with 'save plan'.</div></div>");
    }

    if ($("recent_entry") && $("recent_entry").innerHTML == "") {
        var recent = new Element("table", { "id": "recent_moves" });
        $("recent_entry").insert(recent);
    }

    if (state.options["email-notify"] &&
        $("chat_entry") && $("chat_entry").innerHTML == "") {
        $("chat_entry").insert(new Element("table", {"id": "chat_messages" }));
        var input = new Element("textarea", {"id": "chat_entry_input",
                                             "style": "font-family: monospace; width: 60ex; height: 5em;" } );
        $("chat_entry").insert(input);
        $("chat_entry").insert(new Element("br"));
        $("chat_entry").insert(new Element("button", {"id": "chat_entry_submit", "onclick": "javascript:sendChat()"}).update("Send"));
    }

    if (needMoveEntry && $("move_entry").innerHTML == "") {
        var table = new Element("table");
        $("move_entry").insert(table);
        var row = new Element("tr");
        table.insert(row);
        
        var entry_cell = new Element("td", {"valign": "top",
                                            "style": "width: 40ex"});
        row.insert(entry_cell);
        var input = new Element("textarea", {"id": "move_entry_input",
                                             "onInput": "javascript:moveEntryInputChanged()",
                                             "style": "font-family: monospace; height: 6em; width: 100%" } );
        $(entry_cell).insert(input);
        $(entry_cell).insert("<div style='padding-left: 2em'><button id='move_entry_action' onclick='javascript:preview()'>Preview</button><br><div id='move_entry_explanation'></div>");

        var picker_cell = new Element("td", {"valign": "top",
                                             "style": "padding-left: 3em"});
        row.insert(picker_cell);
        $(picker_cell).insert(new Element("div", { 'id': 'move_picker' }));
    }

    updateMovePicker();
}

function dataEntrySelect(select) {
    $$("#data_entry_tabs button.tab").each(function(tab) {
        if (tab.id == "data_entry_tab_" + select) {
            tab.style.fontWeight = "bold";
        } else {
            tab.style.fontWeight = "normal";
        }
    });

    $$("#data_entry div.tab_content").each(function(tab) {
        if (tab.id == select + "_entry") {
            tab.style.display = "block";
        } else {
            tab.style.display = "none";
        }
    });

    moveEntryInputChanged();
}

function addTakeTileButtons(parent, index, prefix, id) {
    var div = new Element("div", { "id": "leech-" + index + "-" + id,
                                   "style": "padding-left: 2em" });
    var count = 0;
    $H(state.pool).sortBy(naturalSortKey).each(function(tile) {
        if (tile.value < 1 || !tile.key.startsWith(prefix)) {
            return;
        }

        if (prefix == "FAV" && state.factions[currentFaction][tile.key] > 0) {
            return;
        }

        var container = new Element("div", {"style": "display: inline-block"});

        var button = new Element("button").update(tile.key);
        button.onclick = function() {
            gainResource(index, '', tile.key, id);
        };
        container.insert(button);
        container.insert(new Element("br"));

        renderTreasuryTile(container, currentFaction,
                           tile.key, state.pool[tile.key]);
        
        div.insert(container);
        ++count;
    });
    if (prefix == "FAV" && count == 0) {
        var container = new Element("div", {"style": "display: inline-block"});
        div.insert(container);
        container.insert(makeDeclineButton("GAIN_FAVOR", 1));
    }
    parent.insert(div);
}

function makeDeclineButton(resource, amount) {
    var button = new Element("button").update("Decline");
    button.onclick = function() {
        if (amount == 1) {
            appendCommand("-" + resource);
        } else if (amount > 1) {
            appendCommand("-" + amount + resource);
        }
    };
    return button;
}

function addDeclineButton(parent, index, resource, amount) {
    var div = new Element("div", { "id": "leech-" + index + "-0",
                                   "style": "padding-left: 2em" });
    div.insert(makeDeclineButton(resource, amount));
    parent.insert(div);
}

function addFactionInput(parent, record, index) {
    var faction = state.factions[currentFaction];
    if (record.type == "leech") {
        parent.insert("<div id='leech-" + index + "' style='padding-left: 2em'><button onclick='javascript:acceptLeech(" + index + ")'>Accept</button> <button onclick='javascript:declineLeech(" + index + ")'>Decline</button></div>")
    }
    if (record.type == "cult") {
        var amount = record.amount;
        var div = new Element("div", { "id": "leech-" + index + "-0",
                                       "style": "padding-left: 2em" });
        cults.each(function(cult) {
            var button = new Element("button").update(cult.capitalize());
            button.onclick = function() {
                gainResource(index, amount == 1 ? '' : amount, cult, 0);
            };
            div.insert(button);                                               
        });
        parent.insert(div);
    }
    if (record.type == "town") {
        addTakeTileButtons(parent, index, "TW");
    }
    if (record.type == "favor") {
        for (var i = 0; i < record.amount; ++i) {
            addTakeTileButtons(parent, index, "FAV", i);
        }
    }
    if (record.type == "bonus") {
        addTakeTileButtons(parent, index, "BON", 0);
    }
    if (record.type == "transform") {
        if (faction.SPADE > 0) {
            addDeclineButton(parent, index, "SPADE", faction.SPADE);
        }
        if (faction.FREE_TF > 0) {
            addDeclineButton(parent, index, "FREE_TF", faction.FREE_TF);
        }
        faction.reachable_tf_locations.each(function (tf) {
            var menu = {};
            if (canAfford(faction, [tf.cost])) {
                var cost_str = effectString([tf.cost], [tf.gain])
                menu["to " + tf.to_color] = {
                    "fun": function (loc) {
                        appendAndPreview("transform " + loc);
                    },
                    "label": cost_str
                };
            }
            if (tf.to_color == faction.color &&
                !(faction.SPADE - tf.cost.SPADE) &&
                faction.allowed_sub_actions.build &&
                faction.buildings.D.level < faction.buildings.D.max_level) {
                var dwelling_cost = faction.buildings["D"].advance_cost;
                var dwelling_gain = computeBuildingEffect(faction, 'D');
                var can_afford = canAfford(faction, 
                                           [tf.cost, dwelling_cost]);
                if (can_afford) {
                    cost_str = effectString([tf.cost, dwelling_cost],
                                            [tf.gain].concat(dwelling_gain));
                    menu["build"] = {
                        "fun": function (loc) {
                            appendAndPreview("build " + loc);
                        },
                        "label": cost_str
                    };
                }
            }
            if ($H(menu).size() > 0) {
                addMapClickHandler("Transform", tf.hex, menu);
            }
        })
    }
    if (record.type == "faction") {
        var div = new Element("div", { "id": "leech-" + index + "-0",
                                       "style": "padding-left: 2em" });
        var boards = { "green": ["witches", "auren"],
                       "blue": ["mermaids", "swarmlings" ],
                       "black": ["darklings", "alchemists"],
                       "brown": ["halflings", "cultists"], 
                       "yellow": ["nomads", "fakirs"],
                       "red": ["giants", "chaosmagicians"],
                       "gray": ["dwarves", "engineers"] 
                     };

        $H(state.factions).each(function(used_faction) {
            delete boards[used_faction.value.color];
        });

        $H(boards).each(function(board) {
            board.value.sort().each(function(free_faction) {
                var button = new Element("button").update(free_faction);
                button.onclick = function() {
                    appendCommand("setup " + free_faction + "\n");
                };
                div.insert(button);
            });
            div.insert("<br>");
        });
        parent.insert(div);
    }
    if (record.type == "dwelling") {
        var div = new Element("div", { "id": "leech-" + index,
                                       "style": "padding-left: 2em" });
        $H(state.map).sortBy(naturalSortKey).each(function(elem) {
            var hex = elem.value;

            if (hex.row == null) {
                return;
            }

            if (hex.color != faction.color) {
                return;
            }

            if (hex.building) {
                return;
            }

            var button = new Element("button").update(elem.key);
            button.onclick = function() {
                $("leech-" + index).style.display = "none";
                appendCommand("build #{key}\n".interpolate(elem));
            };
            addMapClickHandler("Build", elem.key, {
                "D": {
                    "fun": function (loc) {
                        appendAndPreview("build " + loc);
                    },
                    "label": "free"
                }
            });
            div.insert(button);
        });

        if (faction.FREE_D > 0) {
            div.insert(makeDeclineButton("FREE_D", faction.FREE_D));
        }

        parent.insert(div);
    }
    if (record.type == "upgrade") {
        var div = new Element("div", { "id": "leech-" + index,
                                       "style": "padding-left: 2em" });
        $H(state.map).sortBy(naturalSortKey).each(function(elem) {
            var hex = elem.value;
            
            if (hex.row == null) {
                return;
            }

            if (hex.color != faction.color) {
                return;
            }

            if (hex.building != record.from_building) {
                return;
            }

            var button = new Element("button").update(elem.key);
            button.onclick = function() {
                $("leech-" + index).style.display = "none";
                appendCommand("Upgrade " + elem.key + " to #{to_building}\n".interpolate(record));
            };
            div.insert(button);                                               

            addMapClickHandler("Upgrade", elem.key, {
                "TP": {
                    "fun": function (loc) {
                        appendCommand("Upgrade " + loc + " to #{to_building}\n".interpolate(record));
                    },
                    "label": "free"
                }
            });
        });

        if (faction.FREE_TP > 0) {
            div.insert(makeDeclineButton("FREE_TP", faction.FREE_TP));
        }
        parent.insert(div);
    }
    if (record.type == "bridge") {
        var div = new Element("div", { "id": "leech-" + index,
                                       "style": "padding-left: 2em" });
        var already_added = {};

        $H(state.map).sortBy(naturalSortKey).each(function(elem) {
            var hex = elem.value;

            if (hex.row == null) {
                return;
            }

            if (hex.color != faction.color) {
                return;
            }

            if (!hex.building) {
                return;
            }

            $H(hex.bridgable).each(function(to) {
                var br = [elem.key, to.key].sort().join(":");
                if (already_added[br]) {
                    return;
                }
                already_added[br] = true;
                var button = new Element("button").update(br);
                button.onclick = function() {
                    $("leech-" + index).style.display = "none";
                    appendCommand("bridge " + br);
                };
                div.insert(button);
            });
        });

        if (faction.BRIDGE > 0) {
            div.insert(makeDeclineButton("BRIDGE", faction.BRIDGE));
        }

        parent.insert(div);
    }
}

function appendCommand(cmd) {
    appendAndPreview(cmd);
}

function acceptLeech(index) {
    var record = state.action_required[index];
    $("leech-" + index).style.display = "none";
    appendCommand("Leech #{amount} from #{from_faction}\n".interpolate(record));
}

function declineLeech(index) {
    var record = state.action_required[index];
    $("leech-" + index).style.display = "none";
    appendCommand("Decline #{amount} from #{from_faction}\n".interpolate(record));
}

function gainResource(index, amount, resource, id) {
    var record = state.action_required[index];
    record.amount_pretty = amount;
    record.resource = resource;
    $("leech-" + index + "-" + id).style.display = "none";
    if (resource.startsWith("BON")) {
        appendCommand("Pass #{resource}\n".interpolate(record));
    } else {
        appendCommand("+#{amount_pretty}#{resource}".interpolate(record));
    }
}

function moveEntryInputChanged() {
    if (!$("move_entry_input")) {
        return;
    }

    $("move_entry_input").oninput = null;
    $("move_entry_action").innerHTML = "Preview";
    $("move_entry_action").onclick = preview;
    $("move_entry_action").enable();
    $("move_entry_explanation").innerHTML = "";
} 

function dataEntrySetStatus(disabled) {
    $("data_entry").descendants().each(function (elem) {
        elem.disabled = disabled;
    });
}

function moveEntryEnabled() {
    return !$("move_entry_input").disabled && $("move_entry").visible();
}

function moveEntryAfterPreview() {
    if ($("move_entry_action")) {
        $("move_entry_explanation").innerHTML = "";
        $("move_entry_action").innerHTML = "Preview";
        $("move_entry_action").onclick = preview;

        if ($("move_entry_input").value != "") {
            if ($("error").innerHTML != "") {
                $("move_entry_explanation").innerHTML = "Can't save yet - input had errors";
            } else if (!allowSaving) {
                $("move_entry_explanation").innerHTML = "Can't save yet - it's still your turn to move. (Also see the 'wait' command).";
            } else {
                $("move_entry_action").innerHTML = "Save";
                $("move_entry_action").onclick = save;
            }
        }
    }
    if ($("move_entry_input")) {
        $("move_entry_input").oninput = moveEntryInputChanged;
    }
    dataEntrySetStatus(false);
    updateMovePicker();
    // Disable preview until something changes, but don't disable a save
    if ($("move_entry_action") &&
        $("move_entry_action").innerHTML == "Preview") {
        $("move_entry_action").disable();
    }
}

function updateMovePicker() {
    var picker = $('move_picker');
    var faction = state.factions[currentFaction];
    if (!picker || !faction || faction.placeholder) {
        return;
    }

    var undo = addUndoToMovePicker(picker, faction);
    var pass = addPassToMovePicker(picker, faction);
    var action = addActionToMovePicker(picker, faction);
    var build = addBuildToMovePicker(picker, faction);
    var upgrade = addUpgradeToMovePicker(picker, faction);
    var burn = addBurnToMovePicker(picker, faction);
    var convert = addConvertToMovePicker(picker, faction);
    var dig = addDigToMovePicker(picker, faction);
    var send = addSendToMovePicker(picker, faction);
    var advance = addAdvanceToMovePicker(picker, faction);
    var connect = addConnectToMovePicker(picker, faction);
}

function makeSelectWithOptions(options) {
    var select = new Element("select");
    options.each(function (elem) {
        select.insert(new Element("option").update(elem));
    });
    return select;
}

function ensureMoveEntryNewRow() {
    var input = $("move_entry_input").value;
    if (input.length > 0 &&
        input[input.length - 1] != "\n") {
        $("move_entry_input").value += "\n";
    }
}

function appendAndPreview(command) {
    ensureMoveEntryNewRow();
    $("move_entry_input").value += command;
    preview();
}

function insertOrClearPickerRow(picker, id) {
    var row = $(id);
    if (!row) {
        row = new Element("div", {"id": id});
        picker.insert(row);
    } else {
        row.update("");
    }

    return row;
}

function addUndoToMovePicker(picker, faction) {
    var validate = function() {
        if ($("move_entry_input").value == "") {
            undo.disable();
            done.disable();
            return;
        }
        undo.enable();

        // "Done" only makes sense when this is the only faction that has
        // not yet passed.
        var active_count = 0;
        var passed_count = 0;
        $H(state.factions).each(function (elem) {
            if (elem.value.passed) {
                passed_count++;
            } else {
                active_count++;
            }
        });
        if (active_count == 1 &&
            !faction.passed &&
            faction.allowed_actions) {
            done.enable();
        } else {
            done.disable();
        }
    };
    var execute_undo = function() {
        var value = $("move_entry_input").value;
        var rows = value.split(/\n/);
        // Remove all trailing empty lines
        while (rows.length && rows[rows.length - 1] == "") {
            rows.pop();
        }
        // The remove the last real line
        rows.pop();
        $("move_entry_input").value = rows.join("\n");
        preview();
    };
    var execute_done = function() {
        appendAndPreview("done");
    }
        
    var row = insertOrClearPickerRow(picker, "move_picker_undo");
    var undo = new Element("button").update("Undo");
    undo.onclick = execute_undo;
    undo.disable();

    var done = new Element("button").update("Done");
    done.onclick = execute_done;
    done.disable();

    row.insert(undo);
    row.insert(" /  ");
    row.insert(done);
    
    validate();
    row.show();

    return row;
}

function addPassToMovePicker(picker, faction) {
    var validate = function() {
        if (state.round < 6 &&
            bonus_tiles.value == "-") {
            button.disable();
        } else {
            button.enable();
        }
    };
    var execute = function() {
        var command = "pass";
        if (state.round != 6) {
            command += " " + bonus_tiles.value;
        }
        appendAndPreview(command);
    };

    var row = insertOrClearPickerRow(picker, "move_picker_pass");
    var button = new Element("button").update("Pass");
    button.onclick = execute;
    button.disable();
    row.insert(button);

    var bonus_tiles = makeSelectWithOptions(["-"]);
    bonus_tiles.onchange = validate;
    if (state.round < 6) {
        row.insert(" and take tile ");
        $H(state.pool).sortBy(naturalSortKey).each(function (tile) {
            if (tile.key.startsWith("BON") && tile.value > 0) {
                addAnnotatedOptionToSelect(bonus_tiles, tile.key,
                                        state.bonus_tiles[tile.key])
            }
        });
        row.insert(bonus_tiles);
    }

    validate();
    
    if (faction.allowed_actions) {
        row.show();
    } else {
        row.hide();
    }

    return row;
}

function markActionAsPossible(canvas, name, key) {
    renderAction(canvas, name, key, colors.activeUI);
}

function addActionToMovePicker(picker, faction) {
    var validate = function() {
        if (action.value == "-") {
            button.disable();
        } else {
            button.enable();
        }
    };
    var execute = function() {
        var command = "action " + action.value;
        var pw_cost = state.actions[action.value].cost.PW;
        if (burn.checked && pw_cost > faction.P3) {
            command = "burn " + (pw_cost - faction.P3) + ". " + command;
        }
        appendAndPreview(command);
    };

    var row = insertOrClearPickerRow(picker, "move_picker_action");
    var button = new Element("button").update("Action");
    button.onclick = execute;
    button.disable();
    row.insert(button);

    var possible_actions = [];
    var action = makeSelectWithOptions([]);
    var action_count = 0;

    var generate = function () {
        action.update("");
        action.insert(new Element("option").update("-"));
        action.onchange = validate;
        var pw = faction.P3;
        var max_pw = pw + faction.P2 / 2;
        if (burn.checked) { pw += max_pw; }
        $H(state.pool).sortBy(naturalSortKey).each(function (elem) {
            var key = elem.key;
            if (!key.startsWith("ACT")) { return; }
            var action_canvas = $("action/" + key);
            action_canvas.onclick = function() { };
            var pw_cost = state.actions[key].cost.PW;
            if (!(state.map[key] && state.map[key].blocked) &&
                max_pw >= pw_cost) {
                if (pw >= pw_cost) {
                    var burn = "";
                    if (pw_cost > faction.P3) {
                        burn = " (burn " + (pw_cost - faction.P3) + ")";
                    }
                    possible_actions.push({
                        "key": key,
                        "name": elem.key,
                        "cost": effectString([state.actions[key].cost], []) + burn,
                        "canvas": action_canvas,
                    });
                }
                action_count++;
            }
        });
        $H(faction).sortBy(naturalSortKey).each(function (elem) {
            var key = elem.key;
            var fkey = elem.key;
            if (!key.startsWith("ACT")) {
                fkey += "/" + faction.name;
            }
            if (!state.actions[key] ||
                !elem.value) {
                return;
            }

            var action_canvas = $("action/" + fkey);
            action_canvas.onclick = function() {};

            if (!(state.map[fkey] && state.map[fkey].blocked)) {
                possible_actions.push({
                    "key": key,
                    "name": elem.key,
                    "cost": "free",
                    "canvas": action_canvas,
                });
                action_count++;
            }
        });
    }
    var burn = new Element("input", {"id": "move_picker_action_burn",
                                     "checked": true,
                                     "type": "checkbox"});
    burn.onchange = generate;

    generate();

    row.insert(action);
    row.insert(new Element("label", {'for':'move_picker_action_burn'}).
               update(", burn power if needed"));
    row.insert(burn);
    
    if (faction.allowed_actions && action_count > 0) {
        possible_actions.each(function (possible_action) {
            var key = possible_action.key;
            var name = possible_action.name;
            var canvas = possible_action.canvas;

            addAnnotatedOptionToSelect(action, key, state.actions[key]);
            
            var menu_items = {
                "Take": {
                    "fun": function() {
                        if (moveEntryEnabled()) {
                            action.value = key;
                            execute();
                        }
                    },
                    "label": possible_action.cost
                }
            };
            var menuHandler = 
                menuClickHandler("Action",
                                 "",
                                 menu_items);
            canvas.onclick = function (event) {
                menuHandler(name, event);
            };
            markActionAsPossible(canvas, name, key);
        });
        row.show();
    } else {
        row.hide();
    }

    return row;
}

function addAnnotatedOptionToSelect(select, name, record) {
    var label = "";

    if (name.match(/BON/)) {
        label = tileLabel(record);
    } else {
        label = actionLabel(record)
    }

    if (label) {
        label = ": " + label;
    }
    var bonus_coins = ""
    if (record.bonus_coins && record.bonus_coins.C > 0) {
        bonus_coins = " [" + record.bonus_coins.C + "c]";
    }
    label = name + bonus_coins + label;

    select.insert(new Element("option", {"value": name}).update(label));
}

function tileLabel(record) {
    var label = [];

    var income = record.income;
    var pass_vp = record.pass_vp;
    var action = record.action;
    var special = record.special;
    var gain = record.gain;

    if (pass_vp) {
        var vp_strs = [];
        $H(pass_vp).each(function (elem) {
            elem.value = passVpString(elem.value);
            vp_strs.push("#{key}#{value}".interpolate(elem));
        });
        if (vp_strs) {
            label.push("pass-vp " + vp_strs.join(" "))
        }
    }
    if (income) {
        var income_strs = [];
        $H(income).each(function (elem) {
            income_strs.push("+#{value}#{key}".interpolate(elem));
        });
        if (income_strs) {
            label.push("income " + income_strs.join(" "))
        }
    }
    if (action) {
        label.push("action " + actionLabel(record.action));
    }
    if (special) {
        var special_strs = [];
        $H(special).each(function (elem, index) {
            special_strs.push("#{value} #{key}".interpolate(elem));
        });
        if (special_strs) {
            label.push("special " + special_strs.join(" "));
        }
    }
    if (gain) {
        var gain_strs = [];
        $H(gain).each(function (elem) {
            if (elem.value == 1) {
                gain_strs.push(elem.key);
            } else {
                gain_strs.push("#{value}#{key}".interpolate(elem));
            }
        });
        if (gain_strs) {
            label.push(" &#8594; " + gain_strs.join(", "));
        }
    }    

    return label.join(", ");
}

function actionLabel(record) {
    var label = "";

    var cost = record.cost;
    var gain = record.gain;

    if (cost) {
        var cost_strs = [];
        $H(cost).each(function (elem) {
            cost_strs.push("#{value}#{key}".interpolate(elem));
        });
        label += cost_strs.join(", ");
    }

    if (gain) {
        var gain_strs = [];
        $H(gain).each(function (elem) {
            if (elem.value == 1) {
                gain_strs.push(elem.key);
            } else {
                gain_strs.push("#{value}#{key}".interpolate(elem));
            }
        });
        if (gain_strs) {
            label += " &#8594; " + gain_strs.join(", ");
        }
    }    

    return label;
}

function effectString(costs, gains) {
    var non_zero = [];
    ["C", "W", "P", "PW", "VP"].each(function(type) {
        var delta = 0;
        gains.each(function (gain) { if (gain[type]) { delta += gain[type] } });
        costs.each(function (cost) { if (cost[type]) { delta -= cost[type] } });
        if (!delta) { return; }
        non_zero.push(delta + type.toLowerCase());
    });

    return non_zero.join(", ");
}

function canAfford(faction, costs) {
    var can_afford = true;
    var non_zero = [];
    ["C", "W", "P", "PW", "VP"].each(function(type) {
        var total_cost = 0;
        costs.each(function (cost) {
            if (cost[type]) {
                total_cost += cost[type]
            }
        });
        if (faction[type] < total_cost) {
            return can_afford = false;
        }
    });

    return can_afford;
}

function addBuildToMovePicker(picker, faction) {
    var validate = function() {
        if (location.value == "-") {
            button.disable();
        } else {
            button.enable();
        }
    };
    var execute = function() {
        var command = "build " + location.value;
        appendAndPreview(command);
    };

    var dwelling_costs = faction.buildings["D"].advance_cost;

    var row = insertOrClearPickerRow(picker, "move_picker_build");
    var button = new Element("button").update("Build");
    button.onclick = execute;

    var location = makeSelectWithOptions([]);
    location.onchange = validate;
    var possible_builds = [];
    var gains = computeBuildingEffect(faction, 'D');

    if (faction.allowed_sub_actions.build) {
        var can_afford_build = canAfford(faction, [dwelling_costs]);
        var cost_str = effectString([dwelling_costs], gains);
        if (can_afford_build) {
            $H(faction.allowed_build_locations).each(function (elem) {
                var loc = elem.key;
                possible_builds.push([loc, cost_str]);
            });
        }
    } else if (faction.allowed_actions) {
        location.insert(new Element("option").update("-"));
        var resources = ["C", "W", "P"];
        faction.reachable_build_locations.each(function (elem) {
            var loc = elem.hex;
            var loc_cost = elem.extra_cost;
            var can_afford_build = canAfford(faction,
                                             [dwelling_costs, loc_cost]);
            var cost_str = effectString([dwelling_costs, loc_cost],
                                        gains);
            if (can_afford_build) {
                possible_builds.push([loc, cost_str]);
            }
        });
    }

    row.insert(button);
    row.insert(" in ");
    row.insert(location);

    validate();
    
    if (faction.buildings.D.level < faction.buildings.D.max_level &&
        !faction.SPADE &&
        (faction.allowed_actions ||
         faction.allowed_sub_actions.build) &&
        possible_builds.size() > 0) {
        possible_builds.each(function (elem) {
            var loc = elem[0];
            var cost = elem[1];
            location.insert(new Element("option").update(loc));
            addMapClickHandler("Build", loc, {
                "D": {
                    "fun": function (loc) {
                        appendAndPreview("build " + loc);
                    },
                    "label": cost
                }
            });
        });
        row.show();
    } else {
        row.hide();
    }

    return row;
}

function computeBuildingEffect(faction, type) {
    var res = [];

    $H(faction).each(function (elem) {
        var name = elem.key;
        if (!elem.value) {
            return;
        }
        if (name.match(/^FAV/)) {
            var effect = state.favors[name].vp;
            if (effect && effect[type]) {
                res.push({ "VP": effect[type] })
            }
        }
    });

    var building_record = faction.buildings[type];
    if (building_record.advance_gain &&
        building_record.level < building_record.max_level) {
        res.push(building_record.advance_gain[building_record.level]);
    }

    if (state.round > 0) {
        var score = state.score_tiles[state.round - 1];
        if (score.vp[type]) {
            res.push({ "VP": score.vp[type] })            
        }
    }

    return res;
}

function addUpgradeToMovePicker(picker, faction) {
    var validate = function() {
        if (upgrade.value == "-") {
            button.disable();
        } else {
            button.enable();
        }
    };
    var execute = function() {
        var command = "upgrade " + upgrade.value;
        appendAndPreview(command);
    };

    var row = insertOrClearPickerRow(picker, "move_picker_upgrade");
    var button = new Element("button").update("Upgrade");
    button.onclick = execute;
    button.disable();
    row.insert(button);

    var upgrade = makeSelectWithOptions(["-"]);
    var upgrade_count = 0;
    var upgrade_locations = {};
    upgrade.onchange = validate;

    var upgrade_types = $H({ 'TP': 'D',
                             'TE': 'TP',
                             'SA': 'TE',
                             'SH': 'TP' });
    var upgrade_gains = $H({ 'TP': computeBuildingEffect(faction, 'TP'),
                             'TE': computeBuildingEffect(faction, 'TE'),
                             'SA': computeBuildingEffect(faction, 'SA'),
                             'SH': computeBuildingEffect(faction, 'SH') });

    $H(state.map).sortBy(naturalSortKey).each(function (elem) {
        var hex = elem.value;
        var id = elem.key;
        if (hex.row == null || 
            hex.color != faction.color) {
            return
        }
        upgrade_types.each(function (type_elem) {
            var wanted_new = type_elem.key;
            var wanted_old = type_elem.value;
            if (hex.building != wanted_old) {
                return;
            }
            if (faction.buildings[wanted_new].level >=
                faction.buildings[wanted_new].max_level) {
                return;
            }
            var cost = faction.buildings[wanted_new].advance_cost;
            var lonely_cost = {}
            if (wanted_new == "TP" && !hex.has_neighbors) {
                lonely_cost = { "C": cost.C * 2 };
            }
            var can_afford = canAfford(faction, [cost, lonely_cost]);
            var cost_str = effectString([cost, lonely_cost],
                                        upgrade_gains.get(wanted_new));
            if (can_afford) {
                upgrade.insert(new Element("option").update(
                    id + " to " + wanted_new));
                if (!upgrade_locations[id]) {
                    upgrade_locations[id] = [];
                }
                upgrade_locations[id].push([wanted_new, cost_str]);
                upgrade_count++;
            }
        });
    });
    row.insert(upgrade);
    
    if (faction.allowed_actions && upgrade_count > 0) {
        $H(upgrade_locations).each(function (elem) {
            var loc = elem.key;
            var types = elem.value;
            var execute = function(loc, type) {
                appendAndPreview("upgrade " + loc + " to " + type);
            }
            var funs = {};
            types.each(function (record) {
                var type = record[0];
                var cost = record[1];
                funs[type] = {
                    "fun": execute,
                    "label": cost,
                }
            });
            addMapClickHandler("Upgrade", loc, funs);
        });
        row.show();
    } else {
        row.hide();
    }

    return row;
}

function addBurnToMovePicker(picker, faction) {
    var validate = function() {
        if (amount.value == '-') {
            button.disable()
            return;
        }
        button.enable()
    };
    var execute = function() {
        var command = "burn " + amount.value;
        appendAndPreview(command);
    };

    var row = insertOrClearPickerRow(picker, "move_picker_burn");

    var button = new Element("button").update("Burn");
    button.onclick = execute;
    button.disable();

    var amounts = ['-'];
    for (var i = 0; i <= faction.P2 / 2; ++i) {
        amounts.push(i);
    }
    var amount = makeSelectWithOptions(amounts);
    amount.onchange = validate;

    row.insert(button);
    row.insert(amount);
    row.insert(" power");

    if (faction.P2 > 1 &&
        (faction.allowed_actions > 0||
         faction.allowed_sub_actions.burn > 0)) {
        row.show();
    } else {
        row.hide();
    }

    return row;
}

function addConvertToMovePicker(picker, faction) {
    var validate = function() {
        if (amount.value == '-') {
            button.disable()
            return;
        }
        button.enable()
    };
    var execute = function() {
        var types = type.value.split(/,/);
        var from_type = types[0];
        var to_type = types[1];
        var rate = faction.exchange_rates[from_type][to_type];
        var from = rate * amount.value + from_type;
        var to = amount.value + to_type;
        var command = "convert " + from + " to " + to;
        appendAndPreview(command);
    };
    faction.PW = faction.P3;
    if (faction.CONVERT_W_TO_P) {
        faction.exchange_rates["W"]["P"] = 1;
    }
    var convert_possible = false;

    var generate = function () {
        amount.update("");
        if (type.value == '-') {
            amount.insert(new Element("option").update("-"));
        } else {
            var types = type.value.split(/,/);
            var from_type = types[0];
            var to_type = types[1];
            var rate = faction.exchange_rates[from_type][to_type];
            for (var i = 1; rate * i <= faction[from_type]; i++) {
                amount.insert(new Element("option").update(i));
            }
        }
    };

    var row = insertOrClearPickerRow(picker, "move_picker_convert");

    var button = new Element("button").update("Convert");
    button.onclick = execute;
    button.disable();

    var type = makeSelectWithOptions([]);
    type.onchange = function() {
        generate();
        validate();
    };

    var rates = $H(faction.exchange_rates);
    rates.sortBy(naturalSortKey).reverse().each(function (elem) {
        var from = elem.key;
        var to = $H(elem.value);
        var need_label = false;
        to.sortBy(naturalSortKey).reverse().each(function (to_elem) {
            var to_type = to_elem.key;
            var rate = to_elem.value;

            if (faction[from] >= rate) {
                var label = from + " to " + to_type;
                if (rate > 1) {
                    label = rate + " " +label;
                }
                type.insert({"top": new Element("option",
                                                { "value": from + "," + to_type }).update("&nbsp;&nbsp;" + label)});
                convert_possible = true;
                need_label = true;
            }
        });
        if (need_label) {
            type.insert({"top": new Element("option", {"value": "-"}).update(from)});
        }
    });

    type.insert({"top": new Element("option", {"value": "-"}).update("-")});

    var amount = makeSelectWithOptions(["-"]);

    row.insert(button);
    row.insert(type);
    row.insert(amount);
    row.insert(" times");
 
    if (convert_possible &&
        (faction.allowed_actions > 0 ||
         faction.allowed_sub_actions.burn > 0)) {
        row.show();
    } else {
        row.hide();
    }

    return row;
}

function addDigToMovePicker(picker, faction) {
    var validate = function() {
        if (amount.value == '-') {
            button.disable()
            return;
        }
        button.enable()
    };
    var execute = function() {
        var command = "dig " + amount.value;
        appendAndPreview(command);
    };

    var row = insertOrClearPickerRow(picker, "move_picker_dig");

    var button = new Element("button").update("Dig");
    button.onclick = execute;
    button.disable();

    var amount = makeSelectWithOptions(["-"]);
    var amount_count = 0;
    amount.onchange = validate;

    var cost = faction.dig.cost[faction.dig.level];
    for (var i = 1; i <= 7; ++i) {
        var can_afford = canAfford(faction, [cost]);
        if (can_afford) {
            amount_count++;
            amount.insert(new Element("option").update(i));
        }
    }

    row.insert(button);
    row.insert(amount);
    row.insert(" times");
 
    if ((faction.allowed_actions || faction.allowed_sub_actions.dig) &&
        amount_count > 0) {
        row.show();
    } else {
        row.hide();
    }

    return row;
}

function addSendToMovePicker(picker, faction) {
    var validate = function() {
        var cult = cult_selection.value.toUpperCase();
        if (cult == "-") {
            button.disable()
            return;
        }
        button.enable()
    };
    var execute = function() {
        var command = "send p to " + cult_selection.value;
        if (amount.value != 'max') {
            command += " amount " + amount.value;
        }
        appendAndPreview(command);
    };

    var row = insertOrClearPickerRow(picker, "move_picker_send");

    var button = new Element("button").update("Send");
    button.onclick = execute;
    button.disable();
    var cult_selection = makeSelectWithOptions(["-", "Fire", "Water", "Earth", "Air"]);
    cult_selection.onchange = validate;
    var amount = makeSelectWithOptions(["max", "3", "2", "1"]);
    amount.onchange = validate;

    row.insert(button);
    row.insert("priest to ");
    row.insert(cult_selection);
    row.insert(" for ");
    row.insert(amount);

    if (faction.P > 0 && faction.allowed_actions) {
        cults.each(function (cult) {
            addCultClickHandler("Send Priest", cult, {
                "Max steps": {
                    "fun": function (cult) {
                        appendAndPreview("send p to " + cult);
                    },
                    "label": ""
                },
                "1 step": {
                    "fun": function (cult) {
                        appendAndPreview("send p to " + cult + " for 1");
                    },
                    "label": ""
                }
            });
        });
        row.show();
    } else {
        row.hide();
    }

    return row;
}

function addAdvanceToMovePicker(picker, faction) {
    var validate = function() {
        var advance_on = track.value;
        if (advance_on == "-") {
            button.disable()
            return;
        }
        button.enable()
    };
    var execute = function() {
        var command = "advance " + track.value;
        appendAndPreview(command);
    };

    var row = insertOrClearPickerRow(picker, "move_picker_advance");

    var button = new Element("button").update("Advance");
    button.onclick = execute;
    button.disable();

    var track = makeSelectWithOptions(["-"]);
    var track_count = 0;
    track.onchange = validate;

    ["dig", "ship"].each(function (type) {
        if (faction[type].level >= faction[type].max_level) {
            return;
        }

        var can_afford = canAfford(faction,
                                   [faction[type].advance_cost]);
        if (can_afford) {
            track.insert(new Element("option").update(type));
            track_count++;
        }
    });

    row.insert(button);
    row.insert(" on ");
    row.insert(track);

    if (track_count && faction.allowed_actions) {
        row.show();
    } else {
        row.hide();
    }

    return row;
}

function addConnectToMovePicker(picker, faction) {
    if (!faction.possible_towns) {
        return;
    }

    var validate = function() {
        if (location.value == "-") {
            button.disable();
        } else {
            button.enable();
        }
    };
    var execute = function() {
        appendAndPreview("connect " + location.value);
    };

    var row = insertOrClearPickerRow(picker, "move_picker_connect");
    var button = new Element("button").update("Connect");
    button.onclick = execute;

    var location = makeSelectWithOptions(["-"].concat(faction.possible_towns));
    location.onchange = validate;
    var location_count = 0;

    faction.possible_towns.each(function (loc) {
        addMapClickHandler("Connect", loc, { "Form town": {
            "fun": function (loc) {
                appendAndPreview("connect " + loc);
            },
            "label": ""
        }});
    });

    row.insert(button);
    row.insert(" over ");
    row.insert(location);
    row.insert(" to form town ");

    validate();
    
    if (faction.possible_towns.size() > 0) {
        row.show();
    } else {
        row.hide();
    }

    return row;
}

function draw() {
    $("error").innerHTML = "";
    state.error.each(function(row) {
        $("error").insert("<div>" + row.escapeHTML() + "</div>");
    });

    if ($("main-data")) {
        $("main-data").style.display = "block";
    }

    drawMap();
    drawCults();
    drawScoringTiles();
    drawFactions();
    // Draw this after factions, so that we can manipulate the DOM of
    // the action markers.
    drawActionRequired();
    drawLedger();

    if (state.history_view > 0) {
        $("root").style.backgroundColor = "#ffeedd";
    }
}

function failed() {
    $("action_required").innerHTML = "";
    if (state.error) {
        state.error.each(function(row) {
            $("error").insert("<div>" + row.escapeHTML() + "</div>");
        });
    } else {
        $("error").insert("Couldn't load game");
    }
}

function spin() {
    $("action_required").innerHTML = '<img src="/stc/spinner.gif"></img> loading ...';
}

function init(root) {
    root.innerHTML += ' \
    <table style="border-style: none" id="main-data"> \
      <tr> \
        <td> \
          <div id="map-container"> \
            <canvas id="map" width="800" height="500"> \
              Browser not supported. \
            </canvas> \
          </div> \
        <td> \
          <div id="cult-container"> \
            <canvas id="cults" width="250" height="500"> \
              Browser not supported. \
            </canvas> \
          </div> \
      <tr> \
        <td colspan=2> \
          <div id="shared-actions"></div> \
          <div id="scoring"></div> \
    </table> \
    <div id="menu" class="menu" style="display: none"></div> \
    <div id="preview_status"></div> \
    <pre id="preview_commands"></pre> \
    <div id="error"></div> \
    <div id="action_required"></div> \
    <div id="data_entry"></div> \
    <div id="factions"></div> \
    <table id="ledger"> \
      <col></col> \
      <col span=2 ></col> \
      <col span=2 style="background-color: #e0e0f0"></col> \
      <col span=2 ></col> \
      <col span=2 style="background-color: #e0e0f0"></col> \
      <col span=2 ></col> \
      <col span=2 style="background-color: #e0e0f0"></col> \
    </table>';

}

