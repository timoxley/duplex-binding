# Duplex Binding

for Node.bind/Polymer

```js

var DuplexBinding = require('duplex-binding')

var template = document.querySelector('template')
template.bindingDelegate = new PolymerExpressions()
template.model = {
  counter: {
    value: 0
  }
}
setInterval(function() {
  template.model.counter.value && template.model.counter.value--
}, 1000)

function MyCustomElement() {}

MyCustomElement.prototype = Object.create(HTMLElement.prototype)

MyCustomElement.prototype.createdCallback = function() {
  this.model = {
    value: 0
  }
}

MyCustomElement.prototype.attachedCallback = function() {
  var self = this;
  this.addEventListener('click', function() {
    self.model.value++
  })
}

DuplexBinding(
  MyCustomElement.prototype,
  'value',
  'model.value',
  onValueChanged
)

function onValueChanged(newValue, oldValue) {
  console.log('%s -> %s', oldValue, newValue)
}

document.register('my-element', MyCustomElement)
```
