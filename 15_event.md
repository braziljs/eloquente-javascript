# Handling Events

{{quote {author: "Marcus Aurelius", title: Meditations, chapter: true}

You have power over your mind—not outside events. Realize this, and
you will find strength.

quote}}

{{index stoicism, "Marcus Aurelius", input, timeline, "control flow"}}

{{figure {url: "img/chapter_picture_15.jpg", alt: "Picture a Rube Goldberg machine", chapter: "framed"}}}

Some programs work with direct user input, such as mouse and keyboard
actions. That kind of input isn't available as a well-organized data
structure—it comes in piece by piece, in real time, and the program is
expected to respond to it as it happens.

## Event handlers

{{index polling, button, "real-time"}}

Imagine an interface where the only way to find out whether a key on
the ((keyboard)) is being pressed is to read the current state of that
key. To be able to react to keypresses, you would have to constantly
read the key's state so that you'd catch it before it's released
again. It would be dangerous to perform other time-intensive
computations since you might miss a keypress.

Some primitive machines do handle input like that. A step up from this
would be for the hardware or operating system to notice the keypress
and put it in a queue. A program can then periodically check the queue
for new events and react to what it finds there.

{{index responsiveness, "user experience"}}

Of course, it has to remember to look at the queue, and to do it
often, because any time between the key being pressed and the program
noticing the event will cause the software to feel unresponsive. This
approach is called _((polling))_. Most programmers prefer to avoid it.

{{index "callback function", "event handling"}}

A better mechanism is for the system to actively notify our code when
an event occurs. Browsers do this by allowing us to register functions
as _handlers_ for specific events.

```{lang: "text/html"}
<p>Click this document to activate the handler.</p>
<script>
  window.addEventListener("click", () => {
    console.log("You knocked?");
  });
</script>
```

{{index "click event", "addEventListener method", "window object"}}

The `window` binding refers to a built-in object provided by the
browser. It represents the ((browser)) window that contains the
document. Calling its `addEventListener` method registers the second
argument to be called whenever the event described by its first
argument occurs.

## Events and DOM nodes

{{index "addEventListener method", "event handling", "window object"}}

Each ((browser)) event handler is registered in a context. In the previous example we called
`addEventListener` on the `window` object to register a handler
for the whole window. Such a method can also be found on ((DOM))
elements and some other types of objects. Event listeners are
called only when the event happens in the context of the object they are
registered on.

```{lang: "text/html"}
<button>Click me</button>
<p>No handler here.</p>
<script>
  let button = document.querySelector("button");
  button.addEventListener("click", () => {
    console.log("Button clicked.");
  });
</script>
```

{{index "click event", "button (HTML tag)"}}

That example attaches a handler to the button node. Clicks on the
button cause that handler to run, but clicks on the rest of the
document do not.

{{index "onclick attribute", encapsulation}}

Giving a node an `onclick` attribute has a similar effect. This works
for most types of events—you can attach a handler through the
attribute whose name is the event name with `on` in front of it.

But a node can have only one `onclick` attribute, so you can register
only one handler per node that way. The `addEventListener` method
allows you to add any number of handlers so that it is safe to add
handlers even if there is already another handler on the element.

{{index "removeEventListener method"}}

The `removeEventListener` method, called with arguments similar to
`addEventListener`, removes a handler.

```{lang: "text/html"}
<button>Act-once button</button>
<script>
  let button = document.querySelector("button");
  function once() {
    console.log("Done.");
    button.removeEventListener("click", once);
  }
  button.addEventListener("click", once);
</script>
```

{{index [function, "as value"]}}

The function given to `removeEventListener` has to be the same
function value that was given to `addEventListener`. So, to unregister
a handler, you'll want to give the function a name (`once`, in the
example) to be able to pass the same function value to both methods.

## Event objects

{{index "button property", "event handling"}}

Though we have ignored it so far, event handler functions are passed
an argument: the _((event object))_. This object holds additional
information about the event. For example, if we want to know _which_
((mouse button)) was pressed, we can look at the event object's
`button` property.

```{lang: "text/html"}
<button>Click me any way you want</button>
<script>
  let button = document.querySelector("button");
  button.addEventListener("mousedown", event => {
    if (event.button == 0) {
      console.log("Left button");
    } else if (event.button == 1) {
      console.log("Middle button");
    } else if (event.button == 2) {
      console.log("Right button");
    }
  });
</script>
```

{{index "event type", "type property"}}

The information stored in an event object differs per type of event.
We'll discuss different types later in the chapter. The object's
`type` property always holds a string identifying the event (such as
`"click"` or `"mousedown"`).

## Propagation

{{index "event propagation", "parent node"}}

{{indexsee bubbling, "event propagation"}}

{{indexsee propagation, "event propagation"}}

For most event types, handlers registered on nodes with children will
also receive events that happen in the children. If a button inside a
paragraph is clicked, event handlers on the paragraph will also see
the click event.

{{index "event handling"}}

But if both the paragraph and the button have a handler, the more
specific handler—the one on the button—gets to go first. The event is
said to _propagate_ outward, from the node where it happened to that
node's parent node and on to the root of the document. Finally, after
all handlers registered on a specific node have had their turn,
handlers registered on the whole ((window)) get a chance to respond to
the event.

{{index "stopPropagation method", "click event"}}

At any point, an event handler can call the `stopPropagation` method
on the event object to prevent handlers further up from receiving the
event. This can be useful when, for example, you have a button inside
another clickable element and you don't want clicks on the button to
activate the outer element's click behavior.

{{index "mousedown event", "pointer event"}}

The following example registers `"mousedown"` handlers on both a
button and the paragraph around it. When clicked with the right mouse
button, the handler for the button calls `stopPropagation`, which will
prevent the handler on the paragraph from running. When the button is
clicked with another ((mouse button)), both handlers will run.

```{lang: "text/html"}
<p>A paragraph with a <button>button</button>.</p>
<script>
  let para = document.querySelector("p");
  let button = document.querySelector("button");
  para.addEventListener("mousedown", () => {
    console.log("Handler for paragraph.");
  });
  button.addEventListener("mousedown", event => {
    console.log("Handler for button.");
    if (event.button == 2) event.stopPropagation();
  });
</script>
```

{{index "event propagation", "target property"}}

Most event objects have a `target` property that refers to the node
where they originated. You can use this property to ensure that you're
not accidentally handling something that propagated up from a node you
do not want to handle.

It is also possible to use the `target` property to cast a wide net
for a specific type of event. For example, if you have a node
containing a long list of buttons, it may be more convenient to
register a single click handler on the outer node and have it use the
`target` property to figure out whether a button was clicked, rather
than register individual handlers on all of the buttons.

```{lang: "text/html"}
<button>A</button>
<button>B</button>
<button>C</button>
<script>
  document.body.addEventListener("click", event => {
    if (event.target.nodeName == "BUTTON") {
      console.log("Clicked", event.target.textContent);
    }
  });
</script>
```

## Default actions

{{index scrolling, "default behavior", "event handling"}}

Many events have a default action associated with them. If you click a
((link)), you will be taken to the link's target. If you press the
down arrow, the browser will scroll the page down. If you right-click,
you'll get a context menu. And so on.

{{index "preventDefault method"}}

For most types of events, the JavaScript event handlers are called
_before_ the default behavior takes place. If the handler doesn't want
this normal behavior to happen, typically because it has already taken
care of handling the event, it can call the `preventDefault` method on
the event object.

{{index expectation}}

This can be used to implement your own ((keyboard)) shortcuts or
((context menu)). It can also be used to obnoxiously interfere with
the behavior that users expect. For example, here is a link that
cannot be followed:

```{lang: "text/html"}
<a href="https://developer.mozilla.org/">MDN</a>
<script>
  let link = document.querySelector("a");
  link.addEventListener("click", event => {
    console.log("Nope.");
    event.preventDefault();
  });
</script>
```

{{index usability}}

Try not to do such things unless you have a really good reason to.
It'll be unpleasant for people who use your page when expected
behavior is broken.

Depending on the browser, some events can't be intercepted at all. On
Chrome, for example, the ((keyboard)) shortcut to close the current
tab ([control]{keyname}-W or [command]{keyname}-W) cannot be handled by JavaScript.

## Key events

{{index keyboard, "keydown event", "keyup event", "event handling"}}

When a key on the keyboard is pressed, your browser fires a
`"keydown"` event. When it is released, you get a `"keyup"`
event.

```{lang: "text/html", focus: true}
<p>This page turns violet when you hold the V key.</p>
<script>
  window.addEventListener("keydown", event => {
    if (event.key == "v") {
      document.body.style.background = "violet";
    }
  });
  window.addEventListener("keyup", event => {
    if (event.key == "v") {
      document.body.style.background = "";
    }
  });
</script>
```

{{index "repeating key"}}

Despite its name, `"keydown"` fires not only when the key is
physically pushed down. When a key is pressed and held, the event
fires again every time the key _repeats_. Sometimes you have to be
careful about this. For example, if you add a button to the DOM when a
key is pressed and remove it again when the key is released, you
might accidentally add hundreds of buttons when the key is held down
longer.

{{index "key property"}}

The example looked at the `key` property of the event object to see
which key the event is about. This property holds a string that, for
most keys, corresponds to the thing that pressing that key would type.
For special keys such as [enter]{keyname}, it holds a string that names the key
(`"Enter"`, in this case). If you hold [shift]{keyname} while pressing a key,
that might also influence the name of the key—`"v"` becomes `"V"`, and
`"1"` may become `"!"`, if that is what pressing [shift]{keyname}-1 produces on
your keyboard.

{{index "modifier key", "shift key", "control key", "alt key", "meta key", "command key", "ctrlKey property", "shiftKey property", "altKey property", "metaKey property"}}

Modifier keys such as [shift]{keyname}, [control]{keyname}, [alt]{keyname}, and [meta]{keyname} ([command]{keyname} on Mac)
generate key events just like normal keys. But when looking for key
combinations, you can also find out whether these keys are held down
by looking at the `shiftKey`, `ctrlKey`, `altKey`, and `metaKey`
properties of keyboard and mouse events.

```{lang: "text/html", focus: true}
<p>Press Control-Space to continue.</p>
<script>
  window.addEventListener("keydown", event => {
    if (event.key == " " && event.ctrlKey) {
      console.log("Continuing!");
    }
  });
</script>
```

{{index "button (HTML tag)", "tabindex attribute"}}

The ((DOM)) node where a key event originates depends on the element
that has ((focus)) when the key is pressed. Most nodes cannot have
focus unless you give them a `tabindex` attribute, but things like
((link))s, buttons, and form fields can. We'll come back to form
((field))s in [Chapter ?](http#forms). When nothing in particular has
focus, `document.body` acts as the target node of key events.

When the user is typing text, using key events to figure out what is
being typed is problematic. Some platforms, most notably the ((virtual
keyboard)) on ((Android)) ((phone))s, don't fire key events. But even
when you have an old-fashioned keyboard, some types of text input
don't match key presses in a straightforward way, such as _input method editor_ (((IME)))
software used by people whose scripts don't
fit on a keyboard, where multiple key strokes are combined to create
characters.

To notice when something was typed, elements that you can type into,
such as the `<input>` and `<textarea>` tags, fire `"input"` events
whenever the user changes their content. To get the actual content
that was typed, it is best to directly read it from the focused field.
[Chapter ?](http#forms) will show how.

## Pointer events

There are currently two widely used ways to point at things on a
screen: mice (including devices that act like mice, such as touchpads
and trackballs) and touchscreens. These produce different kinds of
events.

### Mouse clicks

{{index "mousedown event", "mouseup event", "mouse cursor"}}

Pressing a ((mouse button)) causes a number of events to fire. The
`"mousedown"` and `"mouseup"` events are similar to `"keydown"` and
`"keyup"` and fire when the button is pressed and released. These
happen on the DOM nodes that are immediately below the mouse pointer
when the event occurs.

{{index "click event"}}

After the `"mouseup"` event, a `"click"` event fires on the most
specific node that contained both the press and the release of the
button. For example, if I press down the mouse button on one paragraph
and then move the pointer to another paragraph and release the button,
the `"click"` event will happen on the element that contains both
those paragraphs.

{{index "dblclick event", "double click"}}

If two clicks happen close together, a `"dblclick"` (double-click)
event also fires, after the second click event.

{{index pixel, "clientX property", "clientY property", "pageX property", "pageY property", "event object"}}

To get precise information about the place where a mouse event
happened, you can look at its `clientX` and `clientY` properties,
which contain the event's ((coordinates)) (in pixels) relative to the
top-left corner of the window, or `pageX` and `pageY`, which are
relative to the top-left corner of the whole document (which may be
different when the window has been scrolled).

{{index "border-radius (CSS)", "absolute positioning", "drawing program example"}}

{{id mouse_drawing}}

The following implements a primitive drawing program. Every time you
click the document, it adds a dot under your mouse pointer. See
[Chapter ?](paint) for a less primitive drawing program.

```{lang: "text/html"}
<style>
  body {
    height: 200px;
    background: beige;
  }
  .dot {
    height: 8px; width: 8px;
    border-radius: 4px; /* rounds corners */
    background: blue;
    position: absolute;
  }
</style>
<script>
  window.addEventListener("click", event => {
    let dot = document.createElement("div");
    dot.className = "dot";
    dot.style.left = (event.pageX - 4) + "px";
    dot.style.top = (event.pageY - 4) + "px";
    document.body.appendChild(dot);
  });
</script>
```

### Mouse motion

{{index "mousemove event"}}

Every time the mouse pointer moves, a `"mousemove"` event is fired.
This event can be used to track the position of the mouse. A common
situation in which this is useful is when implementing some form of
mouse-((dragging)) functionality.

{{index "draggable bar example"}}

As an example, the following program displays a bar and sets up event
handlers so that dragging to the left or right on this bar makes it
narrower or wider:

```{lang: "text/html", startCode: true}
<p>Drag the bar to change its width:</p>
<div style="background: orange; width: 60px; height: 20px">
</div>
<script>
  let lastX; // Tracks the last observed mouse X position
  let bar = document.querySelector("div");
  bar.addEventListener("mousedown", event => {
    if (event.button == 0) {
      lastX = event.clientX;
      window.addEventListener("mousemove", moved);
      event.preventDefault(); // Prevent selection
    }
  });

  function moved(event) {
    if (event.buttons == 0) {
      window.removeEventListener("mousemove", moved);
    } else {
      let dist = event.clientX - lastX;
      let newWidth = Math.max(10, bar.offsetWidth + dist);
      bar.style.width = newWidth + "px";
      lastX = event.clientX;
    }
  }
</script>
```

{{if book

The resulting page looks like this:

{{figure {url: "img/drag-bar.png", alt: "A draggable bar",width: "5.3cm"}}}

if}}

{{index "mouseup event", "mousemove event"}}

Note that the `"mousemove"` handler is registered on the whole
((window)). Even if the mouse goes outside of the bar during resizing,
as long as the button is held we still want to update its size.

{{index "buttons property", "button property", "bitfield"}}

We must stop resizing the bar when the mouse button is released. For
that, we can use the `buttons` property (note the plural), which tells
us about the buttons that are currently held down. When this is zero,
no buttons are down. When buttons are held, its value is the sum of
the codes for those buttons—the left button has code 1, the right
button 2, and the middle one 4. That way, you can check whether a given
button is pressed by taking the remainder of the value of `buttons`
and its code.

Note that the order of these codes is different from the one used by
`button`, where the middle button came before the right one. As
mentioned, consistency isn't really a strong point of the browser's
programming interface.

### Touch events

{{index touch, "mousedown event", "mouseup event", "click event"}}

The style of graphical browser that we use was designed with mouse
interfaces in mind, at a time where touchscreens were rare. To
make the Web "work" on early touchscreen phones, browsers for those
devices pretended, to a certain extent, that touch events were mouse
events. If you tap your screen, you'll get `"mousedown"`, `"mouseup"`,
and `"click"` events.

But this illusion isn't very robust. A touchscreen works differently
from a mouse: it doesn't have multiple buttons, you can't track the
finger when it isn't on the screen (to simulate `"mousemove"`), and it
allows multiple fingers to be on the screen at the same time.

Mouse events cover touch interaction only in straightforward cases—if
you add a `"click"` handler to a button, touch users will still be
able to use it. But something like the resizeable bar in the previous
example does not work on a touchscreen.

{{index "touchstart event", "touchmove event", "touchend event"}}

There are specific event types fired by touch interaction. When a
finger starts touching the screen, you get a `"touchstart"` event.
When it is moved while touching, `"touchmove"` events fire. 
Finally, when it stops touching the screen, you'll see a `"touchend"`
event.

{{index "touches property", "clientX property", "clientY property", "pageX property", "pageY property"}}

Because many touchscreens can detect multiple fingers at the same
time, these events don't have a single set of coordinates associated
with them. Rather, their ((event object))s have a `touches` property,
which holds an ((array-like object)) of points, each of which has its
own `clientX`, `clientY`, `pageX`, and `pageY` properties.

You could do something like this to show red circles around every
touching finger:

```{lang: "text/html"}
<style>
  dot { position: absolute; display: block;
        border: 2px solid red; border-radius: 50px;
        height: 100px; width: 100px; }
</style>
<p>Touch this page</p>
<script>
  function update(event) {
    for (let dot; dot = document.querySelector("dot");) {
      dot.remove();
    }
    for (let i = 0; i < event.touches.length; i++) {
      let {pageX, pageY} = event.touches[i];
      let dot = document.createElement("dot");
      dot.style.left = (pageX - 50) + "px";
      dot.style.top = (pageY - 50) + "px";
      document.body.appendChild(dot);
    }
  }
  window.addEventListener("touchstart", update);
  window.addEventListener("touchmove", update);
  window.addEventListener("touchend", update);
</script>
```

{{index "preventDefault method"}}

You'll often want to call `preventDefault` in touch event handlers to
override the browser's default behavior (which may include scrolling
the page on swiping) and to prevent the mouse events from being fired,
for which you may _also_ have a handler.

## Scroll events

{{index scrolling, "scroll event", "event handling"}}

Whenever an element is scrolled, a `"scroll"` event is fired on it.
This has various uses, such as knowing what the user is currently
looking at (for disabling off-screen ((animation))s or sending ((spy))
reports to your evil headquarters) or showing some indication of
progress (by highlighting part of a table of contents or showing a
page number).

The following example draws a ((progress bar)) above the document and
updates it to fill up as you scroll down:

```{lang: "text/html"}
<style>
  #progress {
    border-bottom: 2px solid blue;
    width: 0;
    position: fixed;
    top: 0; left: 0;
  }
</style>
<div id="progress"></div>
<script>
  // Create some content
  document.body.appendChild(document.createTextNode(
    "supercalifragilisticexpialidocious ".repeat(1000)));

  let bar = document.querySelector("#progress");
  window.addEventListener("scroll", () => {
    let max = document.body.scrollHeight - innerHeight;
    bar.style.width = `${(pageYOffset / max) * 100}%`;
  });
</script>
```

{{index "unit (CSS)", scrolling, "position (CSS)", "fixed positioning", "absolute positioning", percent, "repeat method"}}

Giving an element a `position` of `fixed` acts much like an `absolute`
position but also prevents it from scrolling along with the rest of
the document. The effect is to make our progress bar stay at the top.
Its width is changed to indicate the current progress. We use `%`,
rather than `px`, as a unit when setting the width so that the element
is sized relative to the page width.

{{index "innerHeight property", "innerWidth property", "pageYOffset property"}}

The global `innerHeight` binding gives us the height of the window,
which we have to subtract from the total scrollable height—you can't
keep scrolling when you hit the bottom of the document. There's also
an `innerWidth` for the window width. By dividing `pageYOffset`, the
current scroll position, by the maximum scroll position and
multiplying by 100, we get the percentage for the progress bar.

{{index "preventDefault method"}}

Calling `preventDefault` on a scroll event does not prevent the
scrolling from happening. In fact, the event handler is called only
_after_ the scrolling takes place.

## Focus events

{{index "event handling", "focus event", "blur event"}}

When an element gains ((focus)), the browser fires a `"focus"` event
on it. When it loses focus, the element gets a `"blur"` event.

{{index "event propagation"}}

Unlike the events discussed earlier, these two events do not
propagate. A handler on a parent element is not notified when a child
element gains or loses focus.

{{index "input (HTML tag)", "help text example"}}

The following example displays help text for the ((text field)) that
currently has focus:

```{lang: "text/html"}
<p>Name: <input type="text" data-help="Your full name"></p>
<p>Age: <input type="text" data-help="Your age in years"></p>
<p id="help"></p>

<script>
  let help = document.querySelector("#help");
  let fields = document.querySelectorAll("input");
  for (let field of Array.from(fields)) {
    field.addEventListener("focus", event => {
      let text = event.target.getAttribute("data-help");
      help.textContent = text;
    });
    field.addEventListener("blur", event => {
      help.textContent = "";
    });
  }
</script>
```

{{if book

This screenshot shows the help text for the age field.

{{figure {url: "img/help-field.png", alt: "Providing help when a field is focused",width: "4.4cm"}}}

if}}

{{index "focus event", "blur event"}}

The ((window)) object will receive `"focus"` and `"blur"` events when
the user moves from or to the browser tab or window in which the
document is shown.

## Load event

{{index "script (HTML tag)", "load event"}}

When a page finishes loading, the `"load"` event fires on the window
and the document body objects. This is often used to schedule
((initialization)) actions that require the whole ((document)) to have
been built. Remember that the content of `<script>` tags is run
immediately when the tag is encountered. This may be too soon, for
example when the script needs to do something with parts of the
document that appear after the `<script>` tag.

{{index "event propagation", "img (HTML tag)"}}

Elements such as ((image))s and script tags that load an external file
also have a `"load"` event that indicates the files they reference
were loaded. Like the focus-related events, loading events do not
propagate.

{{index "beforeunload event", "page reload", "preventDefault method"}}

When a page is closed or navigated away from (for example, by following
a link), a `"beforeunload"` event fires. The main use of this event is
to prevent the user from accidentally losing work by closing a
document. Preventing the page from unloading is not, as you might
expect, done with the `preventDefault` method. Instead, it is done by
returning a non-null value from the handler. When you do that, the
browser will show the user a dialog asking if they are sure they want to
leave the page. This mechanism ensures that a user is always able to
leave, even on malicious pages that would prefer to keep them there
forever and force them to look at dodgy weight-loss ads.

{{id timeline}}

## Events and the event loop

{{index "requestAnimationFrame function", "event handling", timeline, "script (HTML tag)"}}

In the context of the event loop, as discussed in [Chapter ?](async),
browser event handlers behave like other asynchronous notifications.
They are scheduled when the event occurs but must wait for other
scripts that are running to finish before they get a chance to run.

The fact that events can be processed only when nothing else is
running means that, if the event loop is tied up with other work, any
interaction with the page (which happens through events) will be
delayed until there's time to process it. So if you schedule too much
work, either with long-running event handlers or with lots of
short-running ones, the page will become slow and cumbersome to use.

For cases where you _really_ do want to do some time-consuming thing
in the background without freezing the page, browsers provide
something called _((web worker))s_. A worker is a JavaScript process
that runs alongside the main script, on its own timeline.

Imagine that squaring a number is a heavy, long-running computation
that we want to perform in a separate ((thread)). We could write a
file called `code/squareworker.js` that responds to messages by
computing a square and sending a message back.

```
addEventListener("message", event => {
  postMessage(event.data * event.data);
});
```

To avoid the problems of having multiple ((thread))s touching the same
data, workers do not share their ((global scope)) or any other data
with the main script's environment. Instead, you have to communicate
with them by sending messages back and forth.

This code spawns a worker running that script, sends it a few
messages, and outputs the responses.

```{test: no}
let squareWorker = new Worker("code/squareworker.js");
squareWorker.addEventListener("message", event => {
  console.log("The worker responded:", event.data);
});
squareWorker.postMessage(10);
squareWorker.postMessage(24);
```

{{index "postMessage method", "message event"}}

The `postMessage` function sends a message, which will cause a
`"message"` event to fire in the receiver. The script that created the
worker sends and receives messages through the `Worker` object,
whereas the worker talks to the script that created it by sending and
listening directly on its ((global scope)). Only values that can be
represented as JSON can be sent as messages—the other side will
receive a _copy_ of them, rather than the value itself.

## Timers

{{index timeout, "setTimeout function"}}

We saw the `setTimeout` function in [Chapter ?](async). It schedules
another function to be called later, after a given number of
milliseconds.

{{index "clearTimeout function"}}

Sometimes you need to cancel a function you have scheduled. This is
done by storing the value returned by `setTimeout` and calling
`clearTimeout` on it.

```
let bombTimer = setTimeout(() => {
  console.log("BOOM!");
}, 500);

if (Math.random() < 0.5) { // 50% chance
  console.log("Defused.");
  clearTimeout(bombTimer);
}
```

{{index "cancelAnimationFrame function", "requestAnimationFrame function"}}

The `cancelAnimationFrame` function works in the same way as
`clearTimeout`—calling it on a value returned by
`requestAnimationFrame` will cancel that frame (assuming it hasn't
already been called).

{{index "setInterval function", "clearInterval function", repetition}}

A similar set of functions, `setInterval` and `clearInterval`, are used
to set timers that should _repeat_ every _X_ milliseconds.

```
let ticks = 0;
let clock = setInterval(() => {
  console.log("tick", ticks++);
  if (ticks == 10) {
    clearInterval(clock);
    console.log("stop.");
  }
}, 200);
```

## Debouncing

{{index optimization, "mousemove event", "scroll event", blocking}}

Some types of events have the potential to fire rapidly, many times in
a row (the `"mousemove"` and `"scroll"` events, for example). When
handling such events, you must be careful not to do anything too
time-consuming or your handler will take up so much time that
interaction with the document starts to feel slow.

{{index "setTimeout function"}}

If you do need to do something nontrivial in such a handler, you can
use `setTimeout` to make sure you are not doing it too often. This is
usually called _((debouncing))_ the event. There are several slightly
different approaches to this.

{{index "textarea (HTML tag)", "clearTimeout function", "keydown event"}}

In the first example, we want to react when the user has typed
something, but we don't want to do it immediately for every input
event. When they are ((typing)) quickly, we just want to wait until a
pause occurs. Instead of immediately performing an action in the event
handler, we set a timeout. We also clear the previous timeout (if any)
so that when events occur close together (closer than our timeout
delay), the timeout from the previous event will be canceled.

```{lang: "text/html"}
<textarea>Type something here...</textarea>
<script>
  let textarea = document.querySelector("textarea");
  let timeout;
  textarea.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => console.log("Typed!"), 500);
  });
</script>
```

{{index "sloppy programming"}}

Giving an undefined value to `clearTimeout` or calling it on a timeout
that has already fired has no effect. Thus, we don't have to be
careful about when to call it, and we simply do so for every event.

{{index "mousemove event"}}

We can use a slightly different pattern if we want to space responses
so that they're separated by at least a certain length of ((time)) but
want to fire them _during_ a series of events, not just afterward. For
example, we might want to respond to `"mousemove"` events by showing
the current coordinates of the mouse but only every 250 milliseconds.

```{lang: "text/html"}
<script>
  let scheduled = null;
  window.addEventListener("mousemove", event => {
    if (!scheduled) {
      setTimeout(() => {
        document.body.textContent =
          `Mouse at ${scheduled.pageX}, ${scheduled.pageY}`;
        scheduled = null;
      }, 250);
    }
    scheduled = event;
  });
</script>
```

## Summary

Event handlers make it possible to detect and react to events
happening in our web page. The `addEventListener` method is used to
register such a handler.

Each event has a type (`"keydown"`, `"focus"`, and so on) that
identifies it. Most events are called on a specific DOM element and
then _propagate_ to that element's ancestors, allowing handlers
associated with those elements to handle them.

When an event handler is called, it is passed an event object with
additional information about the event. This object also has methods
that allow us to stop further propagation (`stopPropagation`) and
prevent the browser's default handling of the event
(`preventDefault`).

Pressing a key fires `"keydown"` and `"keyup"` events. Pressing a
mouse button fires `"mousedown"`, `"mouseup"`, and `"click"` events.
Moving the mouse fires `"mousemove"` events. Touchscreen interaction
will result in `"touchstart"`, `"touchmove"`, and `"touchend"` events.

Scrolling can be detected with the `"scroll"` event, and focus changes
can be detected with the `"focus"` and `"blur"` events. When the
document finishes loading, a `"load"` event fires on the window.

## Exercises

### Balloon

{{index "balloon (exercise)", "arrow key"}}

Write a page that displays a ((balloon)) (using the balloon ((emoji)),
🎈). When you press the up arrow, it should inflate (grow) 10 percent,
and when you press the down arrow, it should deflate (shrink) 10 percent.

{{index "font-size (CSS)"}}

You can control the size of text (emoji are text) by setting the
`font-size` CSS property (`style.fontSize`) on its parent element.
Remember to include a unit in the value—for example, pixels (`10px`).

The key names of the arrow keys are `"ArrowUp"` and `"ArrowDown"`.
Make sure the keys change only the balloon, without scrolling the
page.

When that works, add a feature where, if you blow up the balloon past
a certain size, it explodes. In this case, exploding means that it is
replaced with an 💥 emoji, and the event handler is removed (so that
you can't inflate or deflate the explosion).

{{if interactive

```{test: no, lang: "text/html", focus: yes}
<p>🎈</p>

<script>
  // Your code here
</script>
```

if}}

{{hint

{{index "keydown event", "key property", "balloon (exercise)"}}

You'll want to register a handler for the `"keydown"` event and look
at `event.key` to figure out whether the up or down arrow key was
pressed.

The current size can be kept in a binding so that you can base the
new size on it. It'll be helpful to define a function that updates the
size—both the binding and the style of the balloon in the DOM—so that
you can call it from your event handler, and possibly also once when
starting, to set the initial size.

{{index "replaceChild method", "textContent property"}}

You can change the balloon to an explosion by replacing the text node
with another one (using `replaceChild`) or by setting the
`textContent` property of its parent node to a new string.

hint}}

### Mouse trail

{{index animation, "mouse trail (exercise)"}}

In JavaScript's early days, which was the high time of ((gaudy home
pages)) with lots of animated images, people came up with some truly
inspiring ways to use the language.

One of these was the _mouse trail_—a series of elements that would
follow the mouse pointer as you moved it across the page.

{{index "absolute positioning", "background (CSS)"}}

In this exercise, I want you to implement a mouse trail. Use
absolutely positioned `<div>` elements with a fixed size and
background color (refer to the [code](event#mouse_drawing) in the
"Mouse Clicks" section for an example). Create a bunch of such
elements and, when the mouse moves, display them in the wake of the
mouse pointer.

{{index "mousemove event"}}

There are various possible approaches here. You can make your solution
as simple or as complex as you want. A simple solution to start with
is to keep a fixed number of trail elements and cycle through them,
moving the next one to the mouse's current position every time a
`"mousemove"` event occurs.

{{if interactive

```{lang: "text/html", test: no}
<style>
  .trail { /* className for the trail elements */
    position: absolute;
    height: 6px; width: 6px;
    border-radius: 3px;
    background: teal;
  }
  body {
    height: 300px;
  }
</style>

<script>
  // Your code here.
</script>
```

if}}

{{hint

{{index "mouse trail (exercise)"}}

Creating the elements is best done with a loop. Append them to the
document to make them show up. To be able to access them later to change their position, you'll want to store the elements in
an array.

{{index "mousemove event", [array, indexing], "remainder operator", "% operator"}}

Cycling through them can be done by keeping a ((counter variable)) and
adding 1 to it every time the `"mousemove"` event fires. The remainder
operator (`% elements.length`) can then be used to get a valid array
index to pick the element you want to position during a given event.

{{index simulation, "requestAnimationFrame function"}}

Another interesting effect can be achieved by modeling a simple
((physics)) system. Use the `"mousemove"` event only to update a pair
of bindings that track the mouse position. Then use
`requestAnimationFrame` to simulate the trailing elements being
attracted to the position of the mouse pointer. At every animation
step, update their position based on their position relative to the
pointer (and, optionally, a speed that is stored for each element).
Figuring out a good way to do this is up to you.

hint}}

### Tabs

{{index "tabbed interface (exercise)"}}

Tabbed panels are widely used in user interfaces. They allow you to
select an interface panel by choosing from a number of tabs "sticking
out" above an element.

{{index "button (HTML tag)", "display (CSS)", "hidden element", "data attribute"}}

In this exercise you must implement a simple tabbed interface. Write a
function, `asTabs`, that takes a DOM node and creates a tabbed
interface showing the child elements of that node. It should insert a
list of `<button>` elements at the top of the node, one for each child
element, containing text retrieved from the `data-tabname` attribute
of the child. All but one of the original children should be hidden
(given a `display` style of `none`). The currently visible node can be
selected by clicking the buttons.

When that works, extend it to style the button for the currently
selected tab differently so that it is obvious which tab is selected.

{{if interactive

```{lang: "text/html", test: no}
<tab-panel>
  <div data-tabname="one">Tab one</div>
  <div data-tabname="two">Tab two</div>
  <div data-tabname="three">Tab three</div>
</tab-panel>
<script>
  function asTabs(node) {
    // Your code here.
  }
  asTabs(document.querySelector("tab-panel"));
</script>
```

if}}

{{hint

{{index "text node", "childNodes property", "live data structure", "tabbed interface (exercise)"}}

One pitfall you might run into is that you can't directly use the
node's `childNodes` property as a collection of tab nodes. For one
thing, when you add the buttons, they will also become child nodes and
end up in this object because it is a live data structure. For
another, the text nodes created for the ((whitespace)) between the
nodes are also in `childNodes` but should not get their own tabs. You
can use `children` instead of `childNodes` to ignore text nodes.

{{index "TEXT_NODE code", "nodeType property"}}

You could start by building up an array of tabs so that you have easy
access to them. To implement the styling of the buttons, you could
store objects that contain both the tab panel and its button.

I recommend writing a separate function for changing tabs. You can
either store the previously selected tab and change only the styles
needed to hide that and show the new one, or you can just update the
style of all tabs every time a new tab is selected.

You might want to call this function immediately to make the
interface start with the first tab visible.

hint}}
