## Self-Logging Hyperapp

This is a variation of [Hyperapp V1](https://github.com/jorgebucaran/hyperapp/tree/V1) by [jorgebucaran](https://github.com/jorgebucaran) modified to help you prepare for popular frontend frameworks like Vue, React and Angular.   Hyperapp is a minimal frontend framework that illustrates the key principles of larger frameworks without the complexity and build environment.    

Using this logged version will help you understand:
* virtual dom
* state & actions
* stateless UI components
* frontend app life cycle

to use: copy & require self-tracing-hyperapp.js into your project, then use __app()__ as you would with a regular hyperapp V1 project. There is an additional boolean argument to enable or disable self-logging:

```js
var app_1 = app(state, actions, view, container, true); // auto-logging is enabled in this instance

var app_2 = app(state, actions, view, container, false); // auto-logging is disabled in this instance
```
This version of Hyperapp is non-breaking, you can swap it out in any existing V1 hyperapp project for debugging or study.

---

## Project Starters

* [hyperapp starter repo](https://github.com/janke-learning/hyperapp-starter-basic)  
* [hyperapp replit repl.it](https://repl.it/@colevandersWands/hyperapp-starter-basic)  

## Examples to Study

* [this repo's demo](https://janke-learning.github.io/self-logging-hyperapp)
* [examples gallery](https://repl.it/@colevandersWands/hyperapp-examples-gallery)
* [example demo calc](https://repl.it/@colevandersWands/hyperapping-calc-1)  

---

## Log Documentation

__Additional Properties :__
* __.log__- Accumulates all acitons calls, state changes, and v-dom rerenders through the lifecycle of your application. Action calls and their direct downstream effects are logged under the same entry ID.
* __.log.tracking -__ Stores a mirror of the application's actions with functions replaced by true/false to indicate if it is being tracked.

__Additional Methods:__		

|  | args | behavior |   
| --- | --- | --- |  
| .logActions | nothing, a string, or array of strings |	prints all actions, a top-level action, or a nested action (the array is a path to the desired nested property) |  
| .logState | nothing, a string, or array of string |	prints full state, a top-level state property, or a nested state property (the array is a path to the desired nested property) |  
| .logVdom | nothing, or a string | prints the whole v-dom, or the element with id matching your argument |  
| .logIgnore | a string, or array of strings | will exclude the designated top-level, or nested action from the log. the partial state and vdom updates resulting from calls to this action will also be ignored |    
| .logTrack |  a string, or array of strings | will include the designated top-level or nested action in the log. the partial state and vdom resulting from calls to this action will be logged |  
| .logPush | you can push anything into the log | pushes your arg into the log |  
| .logConfig | { actions: boolean, state: boolean, vdom: boolean } | enable or disable logging of the lifecycle stages.  This will apply across all actions, and is applied after  ```.logIgnore``` and ```.logTrack``` |  

___
___
### <a href="http://janke-learning.org" target="_blank"><img src="https://user-images.githubusercontent.com/18554853/50098409-22575780-021c-11e9-99e1-962787adaded.png" width="40" height="40"></img> Janke Learning</a>
