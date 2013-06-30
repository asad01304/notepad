
var keys = {},
    keyAlias = {},
    kp = /@([a-z\s]+):([^\s]*)$/
    hp = /#([^\s]*)$/;


var preSelector = null;


function initTextArea($el){
    $el.keyup(processText);

    $el.bind( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).data( "ui-autocomplete" ).menu.active ) {
            event.preventDefault();
        }
    });
}

function processText(){

    if(preSelector) $('.' + preSelector).remove();

    var txt = $(this).val(), key = kp.exec(txt), hash = hp.exec(txt);
    if(key)  handleActionKey(key[1], key[2], $(this));
    if(hash) handleHash(hash[1], $(this));

}

function handleActionKey(key, val, $el){

    var actionKey = key;

    if(!keys[key]){
        _.each(keyAlias, function(al, k){
            if(al.indexOf(key) >= 0 ) {
                actionKey = k;
                return false;
            }
        });
    }

    if(keys[actionKey]){
        return (keys[actionKey])(actionKey, val, $el)
    }
}

function handleHash(hash, $el){
    $el.autocomplete({
        source: availableTags,
        focus: function() {
            return false;
        },
        select: function( event, ui ) {
            this.value = this.value.replace(new RegExp( hash + '$'), '') + ui.item.value ;

            $el.autocomplete('destroy');
            return false;
        }
    }).autocomplete( "search", hash )

}

function handleActionResult($el, result){
    var text = $el.val();
    $el.val(text + result);
}


keys['date'] = function(key, val, $el){

    preSelector = 'tmp-dp' + Math.random().toString().replace('.','');

    var datePartes = val.split(/[-./]/);
    var date  = new Date();

    if(datePartes){

        if(datePartes[0]){
            date.setDate(parseInt(datePartes[0]));
        }

        if(datePartes[1]){
            date.setMonth(parseInt(datePartes[1]) - 1);
        }

        if(datePartes[2]){
            date.setFullYear(parseInt(datePartes[2]));
        }
    }

    $('<div class="'+preSelector+'"></div>').insertAfter($el)
        .datepicker({
            dateFormat: 'dd-mm-yy',
            onSelect: function(dateText, ob) {
                handleActionResult($el, dateText);
                $('.'+ preSelector).datepicker('destroy').remove();
            }
        }).datepicker("setDate", date);

}

keyAlias['date'] = ['start date', 'end date'];



var people = []


var availablePeople = [
    "S M Asad Rahman",
    "S M Azad Rahman",
    "E Hasan",
    "Noman Ali Khan",
    "Masuiddaa"
];

var availableTags = [
    "PHP",
    "JAVA",
    "C++",
    "Scala",
    "Ruby"
];



keys['assign'] = function(key, val, $el){

    $el.autocomplete({
        source: availablePeople,
        focus: function() {
            return false;
        },
        select: function( event, ui ) {
            this.value = this.value.replace(new RegExp( val + '$'), '') + ui.item.value ;
            $el.autocomplete('destroy');
            return false;
        }
    }).autocomplete( "search", val )

}

keyAlias['assign'] = ['managed by'];