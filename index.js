"use strict"

module.exports = function DuplexBinding(elementProto, attrName, modelPath, fn) {
  fn = fn || noop
  var bind = elementProto.bind
  elementProto.bind = function(name, value, oneTime) {
    if (name !== attrName) return bind.call(this, name, value, oneTime);

    var self = this
    this.duplexBindings = this.duplexBindings || {}
    var bindingKey = name + '-' + modelPath
    var duplexBinding = this.duplexBindings[bindingKey]

    if (duplexBinding) {
      duplexBinding.in.close()
      duplexBinding.out.close()
    }

    duplexBinding = {
      in: new PathObserver(this, modelPath),
      out: value
    }

    duplexBinding.in.open(function(newValue) {
      duplexBinding.out.setValue(newValue)
      debounce(fn, arguments)
    })

    duplexBinding.out.open(function(newValue) {
      duplexBinding.in.setValue(newValue)
      debounce(fn, arguments)
    })

    function debounce(fn, args) {
      setTimeout(function() {
        if (debounce.called) return debounce.called = false;
        fn.apply(self, args)
        debounce.called = true
      })
    }

    this.duplexBindings[bindingKey] = duplexBinding
  }
}


function noop() {}

