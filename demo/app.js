const state = {
  new_entry: '',
  list: [3, 4]
};

const logic = {
};

const actions = {
  set: args => () => {
    return { [args.key]: args.value };
  },
  push: () => state => {
    state.list.push(state.new_entry);
    return { list: state.list };
  },
  pop: () => state => {
    state.list.pop();
    return { list: state.list };
  }
};

const input_ = (set, key, value) => { return (
    h("input", {
      id: key,
      onkeyup: function onkeyup(e) { return set( { key, value: e.target.value } ); },
      type: "text",
      value: value })
)};
const text_ = (id, value) => { return (h("p", { id }, value)) };

const list_ = (list, text_comp) => { 
  let texts = [];
  for (let i = list.length; i > 0; i-- ) {
    let new_ui_comp = text_comp(i, list[i]);
    texts.push(new_ui_comp);
  };
  return ( h('div', null,
    ...texts
  )
)}

const button_ = (value, action, css_class) => { return (
  h("button", { 
    class: css_class,
    onclick: function onclick() { return action() } }, 
    value)
) };

const view = (state, actions) => { return (
  h("div", { id: 'main' }, 
    h("h2", {}, "a stack"),
    input_(actions.set, 'new_entry', state.new_entry),
    h("br"),
    button_('push', actions.push, 'button'),
    button_('pop', actions.pop, 'button'),
    list_(state.list, text_),
  )
)};



const container = document.getElementById('container'); 
const stack = app(state, actions, view, container, true);