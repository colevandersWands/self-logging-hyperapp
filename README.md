## Self-Logging Hyperapp

This is a variation of [Hyperapp](https://github.com/jorgebucaran/hyperapp) by [jorgebucaran](https://github.com/jorgebucaran) modified for learning & studying.   Hyperapp is a minimal frontend framework that illustrates the key principles of larger frameworks without the complexity and build environment.    

Using this logged version will help you understand:
* virtual dom
* state & actions
* stateless UI components
* frontend app life cycle

to use: Call __self-logging-hyperapp__ with an additional truthy argument to enable real-time self-logging:

```js
var app_1 = app(state, actions, view, container, true); // auto-logging is enabled in this instance

var app_2 = app(state, actions, view, container, false); // auto-logging is disabled in this instance
```
This version of Hyperapp is non-breaking, you can swap it out in any existing V1 hyperapp project for debugging or study.

---

### Additional Functionality

__Additional Properties :__
* __.log__- Accumulates all acitons calls, parial states, and v-dom rerenders through the lifecycle of your application. Action calls and their direct downstream effects are logged under the same entry ID.
* __.log.actions -__ Stores a mirror of the application's actions with functions replaced by true/false to indicate if it is being tracked.

__Additional Methods:__		

|  | args | behavior |   
| --- | --- | --- |  
| .logActions | nothing, a string, or array of strings |	prints all actions, a top-level action, or a nested action |  
| .logState | nothing, a string, or array of string |	prints full state, a top-level state property, or a nested state |  
| .logVdom | nothing, or a string | prints the whole v-dom, or the element with id matching your argument |  
| .logIgnore | a string, or array of strings | will exclude the designated top-level, or nested action from the log. the partial state and vdom from this action will also be ignored |    
| .logTrack |  a string, or array of strings | will include the designated top-level or nested action in the log. the partial state and vdom from this action will be logged |  
| .logFlag | strings are best, but anything works | pushes your arg into the log |  
| .logConfig | { actions: boolean, state: boolean, vdom: boolean } | globally tracks or ignores all actions, state changes, or vdom changes |  

___
___
### <a href="http://janke-learning.org" target="_blank"><img src="https://user-images.githubusercontent.com/18554853/50098409-22575780-021c-11e9-99e1-962787adaded.png" width="40" height="40"></img> Janke Learning</a>
