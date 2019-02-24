try {
  // for testing in node, replaced export
  module.exports = { app, h };
} catch(err) {
  // console.log('you in de browser. mec quoi');
}

// export function h(name, attributes) {
function h(name, attributes) {
  var rest = []
  var children = []
  var length = arguments.length

  while (length-- > 2) rest.push(arguments[length])

  while (rest.length) {
    var node = rest.pop()
    if (node && node.pop) {
      for (length = node.length; length--; ) {
        rest.push(node[length])
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node)
    }
  }

  return typeof name === "function"
    ? name(attributes || {}, children)
    : {
        nodeName: name,
        attributes: attributes || {},
        children: children,
        key: attributes && attributes.key
      }
}


// export function app(state, actions, view, container) {
function app(state, actions, view, container, trace) {

  var map = [].map
  var rootElement = (container && container.children[0]) || null
  var oldNode = rootElement && recycleElement(rootElement)
  var lifecycle = []
  var skipRender
  var isRecycling = true
  var globalState = clone(state)

  if (trace) {
    actions.logActions = path => () => {
        if ( path instanceof Array ) {
            let namespace = actions;
            for (let step of path) {
              namespace = namespace[step];
            };
            console.log(namespace);
        } else if (typeof path === 'string') {
          console.log(actions[path])
        } else if (typeof path === 'boolean') {

        } else {
          console.log(actions);
        };
      };
    actions.logState = path => state => {
        if ( path instanceof Array ) {
            let namespace = state;
            for (let step of path) {
              namespace = namespace[step];
            };
            console.log(namespace);
        } else if (typeof path === 'string') {
          console.log(state[path])
        } else {
          console.log(state);
        };
      };
    actions.logVdom = id => () => {
        if ( id ) {
            let element = find_element(resolveNode(view), id);
            if ( element ) {
              console.log(element);
            } else {
              console.log('no such id');
            }
        } else {
          console.log(resolveNode(view));
        };
        function find_element(element, id) {
          if ( element.attributes ) {
            if ( element.attributes.id ) {
              if ( element.attributes.id === id ) {
                return element;
              };
            };
          };
          if ( element.children instanceof Array ) {
            for (let child of element.children) {
              let found = find_element(child, id);
                if ( found ) {
                  return found;
                }
              };
          };
          return false;
        };
      };

  }
  var wiredActions = wireStateToActions([], globalState, clone(actions))
  if (trace) {
    var ignore_trace;
    var track = {actions: true, state: true, vdom: true};
    var totes_path;
    var trace_id = 0;
    wiredActions.log = [];
    wiredActions.log.actions = {};
    wiredActions.log.actions = build_log_list(actions);
    delete wiredActions.log.actions.logActions;
    delete wiredActions.log.actions.logState;
    delete wiredActions.log.actions.logVdom;
    wiredActions.logIgnore = (path) => {
          wiredActions.log.push('- ignoring ' + path.toString());
          if (typeof path === 'string') {
            path = [path]
          };
          let key = path.pop();
          let namespace = wiredActions.log.actions;
          for (let step of path) {
            namespace = namespace[step];
          };
          namespace[key] = false;
        };
    wiredActions.logTrace = (path) => {
          wiredActions.log.push('- tracing ' + path.toString());
          if (typeof path === 'string') {
            path = [path]
          };
          let key = path.pop();
          let namespace = wiredActions.log.actions;
          for (let step of path) {
            namespace = namespace[step];
          };
          namespace[key] = true;
        };
    wiredActions.logFlag = (message) => (wiredActions.log.push(message));
    wiredActions.logConfig = (config) => {
          for (let key in config) {
            track[key] = config[key]
          };
          wiredActions.log.push('- config: ' + JSON.stringify(track));
        };
    wiredActions.log.push({ 
          initial_state: JSON.parse(JSON.stringify(state)),
          _: trace_id
        });
    function build_log_list(target, _key) {
      let copy;
      if (typeof target === 'function') {
        copy = true;
      } else {
        copy = {};
        for (let key in target) {
          copy[key] = build_log_list(target[key], key);
        };
      };
      return copy
    }
  }

  scheduleRender()

  return wiredActions

  function recycleElement(element) {
    return {
      nodeName: element.nodeName.toLowerCase(),
      attributes: {},
      children: map.call(element.childNodes, function(element) {
        return element.nodeType === 3 // Node.TEXT_NODE
          ? element.nodeValue
          : recycleElement(element)
      })
    }
  }

  // 
  function resolveNode(node) {
    return typeof node === "function"
      ? resolveNode(node(globalState, wiredActions))
      : node != null
        ? node
        : ""
  }

  function render() {
    skipRender = !skipRender

    var node = resolveNode(view)

    if (container && !skipRender) {
      rootElement = patch(container, rootElement, oldNode, (oldNode = node))
      /*-trace vdom-*/  if (trace && !ignore_trace && track.vdom) {
        let v_dom_log = {};
        let v_dom = resolveNode(view);
        v_dom_log.v_dom = JSON.parse(JSON.stringify(v_dom));
        v_dom_log._ = trace_id;
        wiredActions.log.push( v_dom_log );
      };
    }

    isRecycling = false

    while (lifecycle.length) lifecycle.pop()()
  }

  function scheduleRender() {
    if (!skipRender) {
      skipRender = true
      setTimeout(render)
    }
  }

  function clone(target, source) {
    var out = {}

    for (var i in target) out[i] = target[i]
    for (var i in source) out[i] = source[i]

    return out
  }

  function setPartialState(path, value, source) {
    var target = {}
    if (path.length) {
      target[path[0]] =
        path.length > 1
          ? setPartialState(path.slice(1), value, source[path[0]])
          : value
      return clone(source, target)
    }
    return value
  }

  function getPartialState(path, source) {
    var i = 0
    while (i < path.length) {
      source = source[path[i++]]
    }
    return source
  }

  function wireStateToActions(path, state, actions) {
    for (var key in actions) {
      typeof actions[key] === "function"
        ? (function(key, action) {
            actions[key] = function(data) {
              var result = action(data)

              /*-trace-*/ if (trace) trace_id++;

              /*-trace actions-*/  if (trace && track.actions) {
                totes_path = [];
                totes_path = path.map(x => x);
                totes_path.push(key)
                let trace_action = wiredActions.log.actions;
                console
                for (let step of totes_path) {
                  trace_action = trace_action[step];
                }
                if ( trace_action ) {
                  let actionLog = {};
                  totes_path.length === 1 ? actionLog.action = key : actionLog.action = totes_path;
                  if (data !== undefined) actionLog.args = data;
                  actionLog._ = trace_id;
                  wiredActions.log.push( actionLog );
                  ignore_trace = false;
                } else {
                  ignore_trace = true;
                };
              };

              if (typeof result === "function") {
                result = result(getPartialState(path, globalState), actions)
                /*-trace state-*/  if (trace && !ignore_trace && track.state) {
                  if (result !== undefined) {
                    let stateLog = {};
                    stateLog.partial_state = JSON.parse(JSON.stringify(result))
                    stateLog._ = trace_id;
                    wiredActions.log.push( stateLog )
                  };
                };
              }

              if (
                result &&
                result !== (state = getPartialState(path, globalState)) &&
                !result.then // !isPromise
              ) {
                scheduleRender(
                  (globalState = setPartialState(
                    path,
                    clone(state, result),
                    globalState
                  ))
                )
              }

              return result
            }
          })(key, actions[key])
        : wireStateToActions(
            path.concat(key),
            (state[key] = clone(state[key])),
            (actions[key] = clone(actions[key]))
          )
    }

    return actions
  }

  function getKey(node) {
    return node ? node.key : null
  }

  function eventListener(event) {
    return event.currentTarget.events[event.type](event)
  }

  function updateAttribute(element, name, value, oldValue, isSvg) {
    if (name === "key") {
    } else if (name === "style") {
      if (typeof value === "string") {
        element.style.cssText = value
      } else {
        if (typeof oldValue === "string") oldValue = element.style.cssText = ""
        for (var i in clone(oldValue, value)) {
          var style = value == null || value[i] == null ? "" : value[i]
          if (i[0] === "-") {
            element.style.setProperty(i, style)
          } else {
            element.style[i] = style
          }
        }
      }
    } else {
      if (name[0] === "o" && name[1] === "n") {
        name = name.slice(2)

        if (element.events) {
          if (!oldValue) oldValue = element.events[name]
        } else {
          element.events = {}
        }

        element.events[name] = value

        if (value) {
          if (!oldValue) {
            element.addEventListener(name, eventListener)
          }
        } else {
          element.removeEventListener(name, eventListener)
        }
      } else if (
        name in element &&
        name !== "list" &&
        name !== "type" &&
        name !== "draggable" &&
        name !== "spellcheck" &&
        name !== "translate" &&
        !isSvg
      ) {
        element[name] = value == null ? "" : value
      } else if (value != null && value !== false) {
        element.setAttribute(name, value)
      }

      if (value == null || value === false) {
        element.removeAttribute(name)
      }
    }
  }

  function createElement(node, isSvg) {
    var element =
      typeof node === "string" || typeof node === "number"
        ? document.createTextNode(node)
        : (isSvg = isSvg || node.nodeName === "svg")
          ? document.createElementNS(
              "http://www.w3.org/2000/svg",
              node.nodeName
            )
          : document.createElement(node.nodeName)

    var attributes = node.attributes
    if (attributes) {
      if (attributes.oncreate) {
        lifecycle.push(function() {
          attributes.oncreate(element)
        })
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(
          createElement(
            (node.children[i] = resolveNode(node.children[i])),
            isSvg
          )
        )
      }

      for (var name in attributes) {
        updateAttribute(element, name, attributes[name], null, isSvg)
      }
    }

    return element
  }

  function updateElement(element, oldAttributes, attributes, isSvg) {
    for (var name in clone(oldAttributes, attributes)) {
      if (
        attributes[name] !==
        (name === "value" || name === "checked"
          ? element[name]
          : oldAttributes[name])
      ) {
        updateAttribute(
          element,
          name,
          attributes[name],
          oldAttributes[name],
          isSvg
        )
      }
    }

    var cb = isRecycling ? attributes.oncreate : attributes.onupdate
    if (cb) {
      lifecycle.push(function() {
        cb(element, oldAttributes)
      })
    }
  }

  function removeChildren(element, node) {
    var attributes = node.attributes
    if (attributes) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i])
      }

      if (attributes.ondestroy) {
        attributes.ondestroy(element)
      }
    }
    return element
  }

  function removeElement(parent, element, node) {
    function done() {
      parent.removeChild(removeChildren(element, node))
    }

    var cb = node.attributes && node.attributes.onremove
    if (cb) {
      cb(element, done)
    } else {
      done()
    }
  }

  function patch(parent, element, oldNode, node, isSvg) {
    if (node === oldNode) {
    } else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
      var newElement = createElement(node, isSvg)
      parent.insertBefore(newElement, element)

      if (oldNode != null) {
        removeElement(parent, element, oldNode)
      }

      element = newElement
    } else if (oldNode.nodeName == null) {     
      element.nodeValue = node
    } else { 
      updateElement(
        element,
        oldNode.attributes,
        node.attributes,
        (isSvg = isSvg || node.nodeName === "svg")
      )

      var oldKeyed = {}
      var newKeyed = {}
      var oldElements = []
      var oldChildren = oldNode.children
      var children = node.children

      for (var i = 0; i < oldChildren.length; i++) {
        oldElements[i] = element.childNodes[i]

        var oldKey = getKey(oldChildren[i])
        if (oldKey != null) {
          oldKeyed[oldKey] = [oldElements[i], oldChildren[i]]
        }
      }

      var i = 0
      var k = 0

      while (k < children.length) {
        var oldKey = getKey(oldChildren[i])
        var newKey = getKey((children[k] = resolveNode(children[k])))

        if (newKeyed[oldKey]) {
          i++
          continue
        }

        if (newKey != null && newKey === getKey(oldChildren[i + 1])) {
          if (oldKey == null) {
            removeElement(element, oldElements[i], oldChildren[i])
          }
          i++
          continue
        }

        if (newKey == null || isRecycling) {
          if (oldKey == null) {
            patch(element, oldElements[i], oldChildren[i], children[k], isSvg)
            k++
          }
          i++
        } else {
          var keyedNode = oldKeyed[newKey] || []

          if (oldKey === newKey) {
            patch(element, keyedNode[0], keyedNode[1], children[k], isSvg)
            i++
          } else if (keyedNode[0]) {
            patch(
              element,
              element.insertBefore(keyedNode[0], oldElements[i]),
              keyedNode[1],
              children[k],
              isSvg
            )
          } else {
            patch(element, oldElements[i], null, children[k], isSvg)
          }

          newKeyed[newKey] = children[k]
          k++
        }
      }

      while (i < oldChildren.length) {
        if (getKey(oldChildren[i]) == null) {
          removeElement(element, oldElements[i], oldChildren[i])
        }
        i++
      }

      for (var i in oldKeyed) {
        if (!newKeyed[i]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1])
        }
      }
    }
    return element
  }
}

/*
  Copyright © 2017-present [Jorge Bucaran](https://github.com/jorgebucaran)

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
/*
  self-logging remix: https://github.com/janke-learning/self-logging-hyperapp
*/