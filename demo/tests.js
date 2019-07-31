console.log('--- logic ---');

  // these would be pure functions
  // the run_tests function will work: https://github.com/janke-learning/test-cases/blob/master/README.md

console.log('--- actions ---');

  // actions are _curried_ functions
  //  they use closure to change their behavior with the state
  //  use the test_action function for testing actions

  let push_action_cases = [
    {arg: null, state: {list: [4], new_entry: "e"}, expected: { list: [4, "e"] } },
    {arg: null, state: {list: [4, 3], new_entry: "e"}, expected: { list: [4, 3, "e"] } },
    {arg: null, state: {list: [], new_entry: "e"}, expected: { list: ["e"] } }
  ];
  test_action(actions.push, push_action_cases);

  let pop_action_cases = [
    {arg: null, state: {list: [4, null] }, expected: { list: [4] } },
    {arg: null, state: {list: [4, 3, null]}, expected: { list: [4, 3] } },
    {arg: null, state: {list: [null]}, expected: { list: [] } }
  ];
  test_action(actions.pop, pop_action_cases);

  let set_action_cases = [
    {arg: { key: 'a', value: 1}, state: null, expected: { a: 1 } },
    {arg: { key: 'b', value: 2}, state: null, expected: { b: 2 } },
    {arg: { key: 'devendra', value: 'rot'}, state: null, expected: { devendra: 'rot' } }
  ];
  test_action(actions.set, set_action_cases);

console.log('--- views ---');

  // for now, print the components to the console and look at them
  let input_cases = [
    { args: [actions.set, 'operation', 'push']},
    { args: [actions.set, 'a', '2']},
    { args: [actions.set, 'b', '3']}
  ];
  test_component('input', input_, input_cases);

  let text_cases = [
    { args: ['read-me', 'ddd']}
  ];
  test_component('text', text_, text_cases);

  let list_cases = [
    { args: [[8, "e"], text_]},
    { args: [[8], text_]},
    { args: [[8, "e", null], text_]},
  ];
  test_component('list', list_, list_cases);

  let button_cases = [
    { args: ['reverse', actions.reverse, 'button']},
    { args: ['display', actions.display, '']}
  ];
  test_component('button', button_, button_cases);

  let view_cases = [
    { args: [state, actions]}
  ];
  test_component('view', view, view_cases);



// testing utils

function test_action(action, cases) {

  for (let t_case of cases) {
    let arg = t_case.arg;
    let _state = t_case.state;
    let actual = evaluate_action(action, arg, _state);
    let actual_string = JSON.stringify(actual);
    let expected = t_case.expected;
    let expected_string = JSON.stringify(expected);
    console.assert(actual_string === expected_string, 
        {arg, expected, actual} )
  };

  function evaluate_action(action, args, state) {
    const curried_action = action(args);
    const result = curried_action(state);
    return result;
  };
};

function test_component(name, component, cases) {
  let result = [];
  result.push(name);
  for (let t_case of cases) {
    let args = t_case.args;
    let instance = component(...args);
    result.push(instance);
  };
  console.log(result);
}



