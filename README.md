# Sselect
## Input text field tips. jQuery plugin.
Drop-down list of hints for text input.

## Install

NPM:
```sh
$ npm i @balambasik/sselect
```

CDN:
```sh
https://cdn.jsdelivr.net/gh/balambasik/sselect/sselect.js
https://cdn.jsdelivr.net/gh/balambasik/sselect/sselect.css
```
TAGS:
```sh
<script src="https://cdn.jsdelivr.net/gh/balambasik/sselect/sselect.js"></script>
<link href="https://cdn.jsdelivr.net/gh/balambasik/sselect/sselect.css" rel="stylesheet">
```


## Use

```sh
<input type="text" id="input-tips">
```

```sh
$('#input-tips').sselect({
    data: [],
    placeholder: 'Placeholder',
    text_noresults: 'Not results',
    prepLi: function() {},
    prepSelectedLi: function() {},
    prepQuery: function() {},
    onInput: function() {},
    onSelect: function() {},
    onNoresults: function() {},
    onShow: function() {},
    onClose: function() {}
});
```

### data
```sh
var data = ['foo', 'bar', 'baz']; // tips array

$('#input-tips').sselect({
    data: data, // tips data
});
```

### prep
```sh
// 
var data = [
    ['foo', 'bar'],
    ['foo1', 'bar1'],
    ['foo2', 'bar2'],
];

$('#input-tips').sselect({

    // prep  item var data
    prepLi: function(item) {
        if ($.isArray(item)) {
            return '<li class="sselect-li">' + item.join(',') + '</li>';
        }
        return '<li class="sselect-li">' + item + '</li>';
    },
        
    //  selected li elem
    prepSelectedLi: function($li){
        return $li.text();
    },
    
    // prep query string
    prepQuery: function(query){
        return query.trim();
    },
});
```

### events
```sh
$('#input-tips').sselect({
    onInput: function(query) {
        console.log(query);
    },
    onSelect: function(selected_text) {
         console.log(selected_text);
    },
    onNoresults: function() {
        // No results
    },
    onShow: function() {
        // Show tips drop menu
    },
    onClose: function() {
        // Close tips drop menu
    }
});
```
