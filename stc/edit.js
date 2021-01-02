var fallback = true;
var id = document.location.pathname.sub(/\/edit\//, "");
var editor = null;

// From JQuery
var Browser = Class.create({
  initialize: function() {
    var userAgent = navigator.userAgent.toLowerCase();
    this.version = (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1];
    this.android = /android/.test( userAgent );
    this.ios = /iPhone|iPad|iPod/.test( userAgent );
    this.webkit = /webkit/.test( userAgent );
    this.opera = /opera/.test( userAgent );
    this.msie = /msie/.test( userAgent ) && !/opera/.test( userAgent );
    this.mozilla = /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent );
  }
});

var browser = new Browser();

function init() {
    $("fallback-editor").style.display = "block";
    try {
        $("title").text += " - " + id.match(/edit\/([^_]*)/)[1];
    } catch (e) {
    }
    load();
}

function getEditorContent() {
    if (editor) {
        return editor.getValue();
    } else {
        return $("fallback-editor").value;
    }
}

function setEditorContent(data) {
    if (editor) {
        editor.setValue(data);
        editor.clearSelection();
    } else {
        $("fallback-editor").focus();
        $("fallback-editor").value = data;
        $("fallback-editor").scrollTop = 9999;
    }
}

function drawPlayers(state) {
    if (state.players.size() == 0) {
        return;
    }

    var table = new Element("ul");

    state.players.each(function (player) {
        var row = new Element("li");
        row.insert(new Element("span").updateText("#{displayname} (#{username})".interpolate(player)));
        table.insert(row);
    });

    $("players").update(new Element("h4").updateText("Players"));
    $("players").insert(table);
}

function drawMetadata(state) {
    var metadata = state.metadata;

    // Status
    var status = "Running, last update " + seconds_to_pretty_time(state.metadata.time_since_update) + " ago";
    if (metadata.aborted) {
        status = "Aborted";
    } else if (metadata.finished) {
        status = "Finished";
    } else if (metadata.wanted_player_count &&
               metadata.player_count != metadata.wanted_player_count) {
        status = "Waiting for players";
    }

    $("status").insert(new Element("h4").updateText("Status"));
    $("status").insertTextSpan(status);
    var status_action = new Element("div");
    $("status").insert(status_action);

    if (!metadata.finished) {
        var abort = new Element("button").update("Abort");
        status_action.insert(abort);
        abort.onclick = function () { setStatus('abort', status_action) };
    } else if (metadata.aborted) {
        var unabort = new Element("button").update("Restart");
        status_action.insert(unabort);
        unabort.onclick = function () { setStatus('unabort', status_action) };
    }

    // Options
    if (metadata.game_options) {
        $("options").insert(new Element("h4").updateText("Options"));
        var list = new Element("ul");
        metadata.game_options.each(function (elem) {
            list.insert(new Element("li").updateText(elem));        
        });
        $("options").insert(list);
    }

    // Description
    $("description").insert(new Element("h4").updateText("Description"));
    $("description").insertTextSpan(metadata.description);
}

function setStatus(action, result) {
    disableDescendants($("status"));    

    new Ajax.Request("/app/set-game-status/", {
        parameters: {
            "cache-token": new Date(),
            "csrf-token": getCSRFToken(),
            "game": id,
            "action": action, 
        },
        method: "post",
        onSuccess: function(transport) {
            enableDescendants($("status"));
            try {
                var resp = transport.responseText.evalJSON();
                state = resp;
                if (resp.error.size()) {
                    result.style.color = "red";
                    result.update(resp.error.join("<br>"));
                } else {
                    result.style.color = "green";
                    result.updateText(resp.status);
                }
            } catch (e) {
                handleException(e);
            };
        }
    });    
}

function save() {
    if ($("save-button").disabled) {
        return;
    }

    $("error").update("");
    $("save-button").disable();
    new Ajax.Request("/app/save-game/", {
        method: "post",
        parameters: {
            "game": id,
            "content": getEditorContent(),
            "orig-hash": hash,
        },
        onFailure: function(transport) {
            $("error").innerHTML = "Error saving game.";
            try {
                $("save-button").enable();
            } catch (e) {
                handleException(e);
            };
        }, 
        onSuccess: function(transport) {
            try {
                var res = transport.responseText.evalJSON();
                res.error.each(function(line) {
                    $("error").insert(line.escapeHTML() + "<br>");
                });
                if (res.error.size() == 0) {
                    hash = res.hash;
                }
                drawActionRequired(res);
                drawPlayers(res);
                $("save-button").enable();
            } catch (e) {
                handleException(e);
            };
        }
    });
}

function load() {
    new Ajax.Request("/app/edit-game/", {
        parameters: {
            "game": id,
            "cache-token": new Date() - Math.random()
        },
        method:"post",
        onFailure: function(transport) {
            $("error").innerHTML = "Error opening game."
            $("save-button").disable();             
        },
        onSuccess: function(transport){
            try {
                var res = transport.responseText.evalJSON();

                if (res.location) {
                    document.location = res.location;
                }

                if (res.error.size()) {
                    res.error.each(function(line) {
                        $("error").insert(line.escapeHTML() + "<br>");
                        
                    });
                    return;
                }

                setEditorContent(res.data);
                hash = res.hash;

                drawActionRequired(res);
                drawPlayers(res);
                drawMetadata(res);

                $("links").innerHTML = "<h4>Game links</h4>";
                { 
                    var read_id = id.sub(/_.*/, '');
                    var div = new Element("div", {"style": "margin-left: 20px" });
                    var link = new Element("a", {"href": "/game/" + read_id });
                    link.update("Public view");
                    div.insert(link);
                    $("links").insert(div);
                }

                if (res.factions) {
                    $H(res.factions).each(function (elem) {
                        var div = new Element("div", {"style": "margin-left: 20px" });
                        var link = new Element("a", {"href": elem.value.edit_link});
                        if (elem.value.edit_link) {
                            link.update(elem.key);
                            div.insert(link);
                            $("links").insert(div);
                        }
                    });
                }
            } catch (e) {
                handleException(e);
            };
        }
    });
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
};

function coloredFactionSpan(state, faction_name) {
    record = {};
    record.bg = colors[state.factions[faction_name].color];
    record.fg = (record.bg == '#000000' ? '#ccc' : '#000');
    record.display = state.factions[faction_name].display;

    return "<span style='background-color:#{bg}; color: #{fg}'>#{display}</span>".interpolate(record);
}

function drawActionRequired(state) {
    if (!$("action_required")) {
        return;
    }

    $("action_required").innerHTML = '';

    state.action_required.each(function(record) {
        if (record.type == 'full') {
            record.pretty = 'should take an action';
        } else if (record.type == 'leech') {
            record.from_faction_span = coloredFactionSpan(state, record.from_faction);
            record.pretty = 'may gain #{amount} power from #{from_faction_span}'.interpolate(record);
            if (record.actual != record.amount) {
                record.pretty += " (actually #{actual} power)".interpolate(record);
            }
        } else if (record.type == 'transform') {
            if (record.amount == 1) {
                record.pretty = 'may use a spade'.interpolate(record);
            } else {
                record.pretty = 'may use #{amount} spades'.interpolate(record);
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
                record.pretty = 'may take a favor tile'.interpolate(record);
            } else {
                record.pretty = 'may take #{amount} favor tiles'.interpolate(record);
            }
        } else if (record.type == 'dwelling') {
            record.pretty = 'should place a dwelling';
		} else if (record.type == 'dock') {
			record.pretty = 'should place a dock';
		} else if (record.type == 'storehouse') {
			record.pretty = 'should place a storehouse';
        } else if (record.type == 'bonus') {
            record.pretty = 'should pick a bonus tile';
        } else if (record.type == 'gameover') {
            record.pretty = 'The game is over';
        } else if (record.type == 'faction') {
            record.pretty = '#{player} should pick a faction'.interpolate(record);
        } else if (record.type == 'not-started') {
            record.pretty = "Game hasn't started yet, #{player_count}/#{wanted_player_count} players have joined.".interpolate(record);
        } else {
            record.pretty = '?';
        }

	if (record.faction) {
            record.faction_span = coloredFactionSpan(state, record.faction);
	} else {
	    record.faction_span = "";
	}

        var row = new Element("div", {'style': 'margin: 3px'}).update("#{faction_span} #{pretty}</div>".interpolate(record));
        $("action_required").insert(row);
    });
}
