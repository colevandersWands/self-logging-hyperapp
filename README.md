## Self-Tracing Hyperapp

Call __self-tracing-hyperapp__ with an additional truthy argument to enable real-time self-logging:
```js
let main = app(state, actions, view, container, true);
```
This version of Hyperapp is non-breaking, you can swap it out in any existing V1 hyperapp project with no additional changes necessary.

---

> npm install self-tracing-hyperapp

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
### <a href="http://elewa.education/blog" target="_blank"><img src="https://user-images.githubusercontent.com/18554853/34921062-506450ae-f97d-11e7-875f-6feeb26ad72d.png" width="100" height="40"/></a>