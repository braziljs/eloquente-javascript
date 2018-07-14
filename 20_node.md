{{meta {code_links: "[\"code/file_server.js\"]"}}}

# Node.js

{{quote {author: "Master Yuan-Ma", title: "The Book of Programming", chapter: true}

A student asked, 'The programmers of old used only simple machines and
no programming languages, yet they made beautiful programs. Why do we
use complicated machines and programming languages?'. Fu-Tzu replied,
'The builders of old used only sticks and clay, yet they made
beautiful huts.'

quote}}

{{index "Yuan-Ma", "Book of Programming"}}

{{figure {url: "img/chapter_picture_20.jpg", alt: "Picture of a telephone pole", chapter: "framed"}}}

{{index "command line"}}

So far, we have used the JavaScript language in a single environment:
the browser. This chapter and the [next one](skillsharing) will
briefly introduce ((Node.js)), a program that allows you to apply your
JavaScript skills outside of the browser. With it, you can build
anything from small command line tools to HTTP ((server))s that power
dynamic ((website))s.

These chapters aim to teach you the main concepts that Node.js uses
and to give you enough information to write useful programs for it.
They do not try to be a complete, or even a thorough, treatment of the
platform.

{{if interactive

Whereas you could run the code in previous chapters directly on these
pages, because it was either raw JavaScript or written for the
browser, the code samples in this chapter are written for Node and
often won't run in the browser.

if}}

If you want to follow along and run the code in this chapter, you'll
need to install Node.js version 10.1 or higher. To do so, go to
[_https://nodejs.org_](https://nodejs.org) and follow the installation
instructions for your operating system. You can also find further
((documentation)) for Node.js there.

## Background

{{index responsiveness, input}}

One of the more difficult problems with writing systems that
communicate over the ((network)) is managing input and ((output))—that
is, the reading and writing of data to and from the network and ((hard
drive)). Moving data around takes time, and ((scheduling)) it cleverly
can make a big difference in how quickly a system responds to the user
or to network requests.

In such programs, ((asynchronous programming)) is often helpful. It
allows the program to send and receive data from and to multiple
devices at the same time without complicated thread management and
synchronization.

{{index "programming language", "Node.js", standard}}

Node was initially conceived for the purpose of making asynchronous
programming easy and convenient. JavaScript lends itself well to a
system like Node. It is one of the few programming languages that does
not have a built-in way to do in- and output. Thus, JavaScript could
be fit onto Node's rather eccentric approach to in- and output without
ending up with two inconsistent interfaces. In 2009, when Node was
being designed, people were already doing callback-based programming
in the browser, so the ((community)) around the language was used to
an ((asynchronous programming)) style.

## The node command

{{index "node program"}}

When ((Node.js)) is installed on a system, it provides a program
called `node`, which is used to run JavaScript files. Say you have a
file `hello.js`, containing this code:

```
let message = "Hello world";
console.log(message);
```

You can then run `node` from the ((command line)) like this to execute
the program:

```{lang: null}
$ node hello.js
Hello world
```

{{index "console.log"}}

The `console.log` method in Node does something similar to what it
does in the browser. It prints out a piece of text. But in Node, the
text will go to the process's ((standard output)) stream, rather than
to a browser's ((JavaScript console)). When running `node` from the
command line, that means you see the logged values in your
((terminal)).

{{index "node program", "read-eval-print loop"}}

If you run `node` without giving it a file, it provides you with a
prompt at which you can type JavaScript code and immediately see the
result.

```{lang: null}
$ node
> 1 + 1
2
> [-1, -2, -3].map(Math.abs)
[1, 2, 3]
> process.exit(0)
$
```

{{index "process object", "global scope", [binding, global], "exit method", "status code"}}

The `process` binding, just like the `console` binding, is available
globally in Node. It provides various ways to inspect and manipulate
the current program. The `exit` method ends the process and can be
given an exit status code, which tells the program that started `node`
(in this case, the command line shell) whether the program completed
successfully (code zero) or encountered an error (any other code).

{{index "command line", "argv property"}}

To find the command line arguments given to your script, you can read
`process.argv`, which is an array of strings. Note that it also
includes the name of the `node` command and your script name, so the
actual arguments start at index 2. If `showargv.js` contains the
statement `console.log(process.argv)`, you could run it like this:

```{lang: null}
$ node showargv.js one --and two
["node", "/tmp/showargv.js", "one", "--and", "two"]
```

{{index [binding, global]}}

All the ((standard)) JavaScript global bindings, such as `Array`,
`Math`, and `JSON`, are also present in Node's environment.
Browser-related functionality, such as `document` or `prompt`, is not.

## Modules

{{index "Node.js", "global scope", "module loader"}}

Beyond the bindings I mentioned, such as `console` and `process`,
Node puts few additional bindings in the global scope. If you want to access
built-in functionality, you have to ask the module system for it.

{{index "require function"}}

The ((CommonJS)) module system, based on the `require` function, was
described in [Chapter ?](modules#commonjs). This system is built into
Node and is used to load anything from built-in ((module))s to
downloaded ((package))s to ((file))s that are part of your own
program.

{{index [path, "file system"], "relative path", resolution}}

When `require` is called, Node has to resolve the given string to an
actual ((file)) that it can load. Pathnames that start with `/`,
`./`, or `../` are resolved relative to the current module's path,
where `.` stands for the current directory, `../` for one
directory up, and `/` for the root of the file system. So if you ask
for `"./graph"` from the file `/tmp/robot/robot.js`, Node will try to
load the file `/tmp/robot/graph.js`.

{{index "index.js"}}

The `.js` ((extension)) may be omitted, and Node will add it if such a
file exists. If the required path refers to a ((directory)), Node will
try to load the file named `index.js` in that directory.

{{index "node_modules directory", directory}}

When a string that does not look like a relative or absolute path is
given to `require`, it is assumed to refer to either a built-in
((module)) or a module installed in a `node_modules` directory. For
example, `require("fs")` will give you Node's built-in file system
module. And `require("robot")` might try to load the library found in
`node_modules/robot/`. A common way to install such libraries is by
using ((NPM)), which we'll come back to in a moment.

{{index "require function", "Node.js", "garble example"}}

Let's set up a small project consisting of two files. The first one,
called `main.js`, defines a script that can be called from the
((command line)) to reverse a string.

```
const {reverse} = require("./reverse");

// Index 2 holds the first actual command line argument
let argument = process.argv[2];

console.log(reverse(argument));
```

{{index reuse, "Array.from function", "join method"}}

The file `reverse.js` defines a library for reversing strings, which
can be used both by this command line tool and by other scripts that
need direct access to a string-reversing function.

```
exports.reverse = function(string) {
  return Array.from(string).reverse().join("");
};
```

{{index "exports object", CommonJS}}

Remember that adding properties to `exports` adds them to the
((interface)) of the module. Since Node.js treats files as
((CommonJS)) ((module))s, `main.js` can take the exported `reverse`
function from `reverse.js`.

We can now call our tool like this:

```{lang: null}
$ node main.js JavaScript
tpircSavaJ
```

## Installing with NPM

{{index NPM, "Node.js", "npm program", library}}

NPM, which was introduced in [Chapter ?](modules#modules_npm), is an
online repository of JavaScript ((module))s, many of which are
specifically written for Node. When you install Node on your computer,
you also get the `npm` command, which you can use to interact with this
repository.

{{index "ini package"}}

NPM's main use is ((download))ing packages. We saw the `ini` package in
[Chapter ?](modules#modules_ini). We can use NPM to fetch and install
that package on our computer.

```{lang: null}
$ npm install ini
npm WARN enoent ENOENT: no such file or directory,
         open '/tmp/package.json'
+ ini@1.3.5
added 1 package in 0.552s

$ node
> const {parse} = require("ini");
> parse("x = 1\ny = 2");
{ x: '1', y: '2' }
```

{{index "require function", "node_modules directory", "npm program"}}

After running `npm install`, ((NPM)) will have created a directory
called `node_modules`. Inside that directory will be an `ini`
directory that contains the ((library)). You can open it and look at
the code. When we call `require("ini")`, this library is loaded, and
we can call its `parse` property to parse a configuration file.

By default NPM installs packages under the current directory, rather
than in a central place. If you are used to other package managers,
this may seem unusual, but it has advantages—it puts each application
in full control of the packages it installs and makes it easier to
manage versions and clean up when removing an application.

### Package files

{{index "package.json", dependency}}

In the `npm install` example, you could see a ((warning)) about the
fact that the `package.json` file did not exist. It is recommended to
create such a file for each project, either manually or by running
`npm init`. It contains some information about the project, such as
its name and ((version)), and lists its dependencies.

The robot simulation from [Chapter ?](robot), as modularized in the
exercise in [Chapter ?](modules#modular_robot), might have a
`package.json` file like this:

```{lang: "application/json"}
{
  "author": "Marijn Haverbeke",
  "name": "eloquent-javascript-robot",
  "description": "Simulation of a package-delivery robot",
  "version": "1.0.0",
  "main": "run.js",
  "dependencies": {
    "dijkstrajs": "^1.0.1",
    "random-item": "^1.0.0"
  },
  "license": "ISC"
}
```

{{index "npm program", tool}}

When you run `npm install` without naming a package to install, NPM
will install the dependencies listed in `package.json`. When you
install a specific package that is not already listed as a dependency,
NPM will add it to `package.json`.

### Versions

{{index "package.json", dependency, evolution}}

A `package.json` file lists both the program's own ((version)) and
versions for its dependencies. Versions are a way to deal with the
fact that ((package))s evolve separately, and code written to work
with a package as it existed at one point may not work with a later,
modified version of the package.

{{index compatibility}}

NPM demands that its packages follow a schema called _((semantic
versioning))_, which encodes some information about which versions are
_compatible_ (don't break the old interface) in the version number. A
semantic version consists of three numbers, separated by periods, such
as `2.3.0`. Every time new functionality is added, the middle number
has to be incremented. Every time compatibility is broken, so that
existing code that uses the package might not work with the new
version, the first number has to be incremented.

{{index "caret character"}}

A caret character (`^`) in front of the version number for a
dependency in `package.json` indicates that any version compatible
with the given number may be installed. So, for example, `"^2.3.0"`
would mean that any version greater than or equal to 2.3.0 and less
than 3.0.0 is allowed.

{{index publishing}}

The `npm` command is also used to publish new packages or new versions
of packages. If you run `npm publish` in a ((directory)) that has a
`package.json` file, it will publish a package with the name and
version listed in the JSON file to the registry. Anyone can publish
packages to NPM—though only under a package name that isn't in use yet since it would be
somewhat scary if random people could update existing packages.

Since the `npm` program is a piece of software that talks to an open
system—the package registry—there is nothing unique about what it
does. Another program, `yarn`, which can be installed from the NPM
registry, fills the same role as `npm` using a somewhat different
interface and installation strategy.

This book won't delve further into the details of ((NPM)) usage. Refer
to [_https://npmjs.org_](https://npmjs.org) for further documentation and a
way to search for packages.

## The file system module

{{index directory, "fs package", "Node.js"}}

One of the most commonly used built-in modules in Node is the `fs`
module, which stands for _((file system))_. It exports functions for
working with ((file))s and directories.

{{index "readFile function", "callback function"}}

For example, the function called `readFile` reads a file
and then calls a callback with the file's contents.

```
let {readFile} = require("fs");
readFile("file.txt", "utf8", (error, text) => {
  if (error) throw error;
  console.log("The file contains:", text);
});
```

{{index "Buffer class"}}

The second argument to `readFile` indicates the _((character
encoding))_ used to decode the file into a string. There are several
ways in which ((text)) can be encoded to ((binary data)), but most
modern systems use ((UTF-8)). So unless you have reasons to believe
another encoding is used, pass `"utf8"` when reading a text file. If
you do not pass an encoding, Node will assume you are interested in
the binary data and will give you a `Buffer` object instead of a
string. This is an ((array-like object)) that contains numbers
representing the bytes (8-bit chunks of data) in the files.

```
const {readFile} = require("fs");
readFile("file.txt", (error, buffer) => {
  if (error) throw error;
  console.log("The file contained", buffer.length, "bytes.",
              "The first byte is:", buffer[0]);
});
```

{{index "writeFile function", "file system"}}

A similar function, `writeFile`, is used to write a ((file)) to disk.

```
const {writeFile} = require("fs");
writeFile("graffiti.txt", "Node was here", err => {
  if (err) console.log(`Failed to write file: ${err}`);
  else console.log("File written.");
});
```

{{index "Buffer class", "character encoding"}}

Here it was not necessary to specify the encoding—`writeFile` will
assume that when it is given a string to write, rather than a `Buffer`
object, it should write it out as text using its default character
encoding, which is ((UTF-8)).

{{index "fs package", "readdir function", "stat function", "rename function", "unlink function"}}

The `fs` module contains many other useful functions: `readdir` will
return the ((file))s in a ((directory)) as an array of strings, `stat`
will retrieve information about a file, `rename` will rename a file,
`unlink` will remove one, and so on. See the documentation at
[_https://nodejs.org_](https://nodejs.org) for specifics.

{{index "asynchronous programming", "Node.js", "error handling", "callback function"}}

Most of these take a callback function as the last parameter, which
they call either with an error (the first argument) or with a successful
result (the second). As we saw in [Chapter ?](async), there are
downsides to this style of programming—the biggest one being that
error handling becomes verbose and error-prone.

{{index "Promise class", "promises package"}}

Though promises have been part of JavaScript for a while, at the time
of writing their integration into Node.js is still a work in progress.
There is an object `promises` exported from the `fs` package since
version 10.1 that contains most of the same functions as `fs` but
uses promises rather than callback functions.

```
const {readFile} = require("fs").promises;
readFile("file.txt", "utf8")
  .then(text => console.log("The file contains:", text));
```

{{index "synchronous programming", "fs package", "readFileSync function"}}

Sometimes you don't need asynchronicity, and it just gets in the way.
Many of the functions in `fs` also have a synchronous variant, which
has the same name with `Sync` added to the end. For example, the
synchronous version of `readFile` is called `readFileSync`.

```
const {readFileSync} = require("fs");
console.log("The file contains:",
            readFileSync("file.txt", "utf8"));
```

{{index optimization, performance, blocking}}

Do note that while such a synchronous operation is being performed,
your program is stopped entirely. If it should be responding to the
user or to other machines on the network, being stuck on a synchronous
action might produce annoying delays.

## The HTTP module

{{index "Node.js", "http package"}}

Another central module is called `http`. It provides functionality for
running ((HTTP)) ((server))s and making HTTP ((request))s.

{{index "listening (TCP)", "listen method", "createServer function"}}

This is all it takes to start an HTTP server:

```
const {createServer} = require("http");
let server = createServer((request, response) => {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(`
    <h1>Hello!</h1>
    <p>You asked for <code>${request.url}</code></p>`);
  response.end();
});
server.listen(8000);
console.log("Listening! (port 8000)");
```

{{index port, localhost}}

If you run this script on your own machine, you can point your web
((browser)) at
[_http://localhost:8000/hello_](http://localhost:8000/hello) to make a
request to your server. It will respond with a small HTML page.

{{index "createServer function", HTTP}}

The function passed as argument to `createServer` is called every time
a client connects to the server. The `request` and `response` bindings
are objects representing the incoming and outgoing data. The first
contains information about the ((request)), such as its `url` property,
which tells us to what URL the request was made.

So, when you open that page in your browser, it sends a request to your
own computer. This causes the server function to run and send back a
response, which you can then see in the browser.

{{index "200 (HTTP status code)", "Content-Type header", "writeHead method"}}

To send something back, you call methods on the `response` object. The
first, `writeHead`, will write out the ((response)) ((header))s (see
[Chapter ?](http#headers)). You give it the status code (200 for "OK"
in this case) and an object that contains header values. The example
sets the `Content-Type` header to inform the client that we'll be
sending back an HTML document.

{{index "writable stream", "body (HTTP)", stream, "write method", "end method"}}

Next, the actual response body (the document itself) is sent with
`response.write`. You are allowed to call this method multiple times
if you want to send the response piece by piece, for example to stream
data to the client as it becomes available. Finally, `response.end`
signals the end of the response.

{{index "listen method"}}

The call to `server.listen` causes the ((server)) to start waiting for
connections on ((port)) 8000. This is why you have to connect
to _localhost:8000_ to speak to this server, rather than just
_localhost_, which would use the default port 80.

{{index "Node.js", kill}}

When you run this script, the process just sits there and waits. When
a script is listening for events—in this case, network
connections—`node` will not automatically exit when it reaches the end
of the script. To close it, press [control]{keyname}-C.

A real web ((server)) usually does more than the one in the example—it
looks at the request's ((method)) (the `method` property) to see what
action the client is trying to perform and looks at the request's ((URL)) to
find out which resource this action is being performed on. We'll see a
more advanced server [later in this chapter](node#file_server).

{{index "http package", "request function"}}

To act as an ((HTTP)) _((client))_, we can use the `request` function
in the `http` module.

```
const {request} = require("http");
let requestStream = request({
  hostname: "eloquentjavascript.net",
  path: "/20_node.html",
  method: "GET",
  headers: {Accept: "text/html"}
}, response => {
  console.log("Server responded with status code",
              response.statusCode);
});
requestStream.end();
```

{{index "Node.js", "callback function", "readable stream"}}

The first argument to `request` configures the request, telling Node
what server to talk to, what path to request from that server, which
method to use, and so on. The second argument is the function that
should be called when a response comes in. It is given an object that
allows us to inspect the response, for example to find out its status
code.

{{index "GET method", "write method", "end method", "writable stream", "request function"}}

Just like the `response` object we saw in the server, the object
returned by `request` allows us to ((stream)) data into the
((request)) with the `write` method and finish the request with the
`end` method. The example does not use `write` because `GET` requests
should not contain data in their request body.

{{index HTTPS, "https package", "request function"}}

There's a similar `request` function in the `https` module that
can be used to make requests to `https:` URLs.

{{index "fetch function", "Promise class", "node-fetch package"}}

Making requests with Node's raw functionality is rather verbose.
There are much more convenient wrapper packages available on NPM. For
example, `node-fetch` provides the promise-based `fetch` interface that
we know from the browser.

## Streams

{{index "Node.js", stream, "writable stream"}}

We have seen two instances of writable streams in the HTTP
examples—namely, the response object that the server could write to
and the request object that was returned from `request`.

{{index "callback function", "asynchronous programming", "write method", "end method", "Buffer class"}}

_Writable streams_ are a widely used concept in Node. Such objects have
a `write` method that can be passed a string or a `Buffer` object to
write something to the stream. Their `end` method closes the stream
and optionally takes a value to write to the stream before
closing. Both of these methods can also be given a callback as an
additional argument, which they will call when the writing or closing
has finished.

{{index "createWriteStream function", "writeFile function"}}

It is possible to create a writable stream that points at a ((file))
with the `createWriteStream` function from the `fs` module. Then you
can use the `write` method on the resulting object to write the file
one piece at a time, rather than in one shot as with `writeFile`.

{{index "createServer function", "request function", "event handling", "readable stream"}}

Readable ((stream))s are a little more involved. Both the `request`
binding that was passed to the HTTP server's callback and the
`response` binding passed to the HTTP client's callback are readable
streams—a server reads requests and then writes responses, whereas a
client first writes a request and then reads a response. Reading from
a stream is done using event handlers, rather than methods.

{{index "on method", "addEventListener method"}}

Objects that emit events in Node have a method called `on` that is
similar to the `addEventListener` method in the browser. You give it
an event name and then a function, and it will register that function
to be called whenever the given event occurs.

{{index "createReadStream function", "data event", "end event", "readable stream"}}

Readable ((stream))s have `"data"` and `"end"` events. The first is
fired every time data comes in, and the second is called whenever the
stream is at its end. This model is most suited for _streaming_ data that
can be immediately processed, even when the whole document isn't
available yet. A file can be read as a readable stream by using the
`createReadStream` function from `fs`.

{{index "upcasing server example", capitalization, "toUpperCase method"}}

This code creates a ((server)) that reads request bodies and streams
them back to the client as all-uppercase text:

```
const {createServer} = require("http");
createServer((request, response) => {
  response.writeHead(200, {"Content-Type": "text/plain"});
  request.on("data", chunk =>
    response.write(chunk.toString().toUpperCase()));
  request.on("end", () => response.end());
}).listen(8000);
```

{{index "Buffer class", "toString method"}}

The `chunk` value passed to the data handler will be a binary
`Buffer`. We can convert this to a string by decoding it as UTF-8
encoded characters with its `toString` method.

The following piece of code, when run with the uppercasing server
active, will send a request to that server and write out the response
it gets:

```
const {request} = require("http");
request({
  hostname: "localhost",
  port: 8000,
  method: "POST"
}, response => {
  response.on("data", chunk =>
    process.stdout.write(chunk.toString()));
}).end("Hello server");
// → HELLO SERVER
```

{{index "stdout property", "standard output", "writable stream", "console.log"}}

The example writes to `process.stdout` (the process's standard output,
which is a writable stream) instead of using `console.log`. We can't
use `console.log` because it adds an extra newline character after
each piece of text that it writes, which isn't appropriate here since
the response may come in as multiple chunks.

{{id file_server}}

## A file server

{{index "file server example", "Node.js"}}

Let's combine our newfound knowledge about ((HTTP)) ((server))s and
working with the ((file system)) to create a bridge between the two:
an HTTP server that allows ((remote access)) to a file system. Such a
server has all kinds of uses—it allows web applications to store and
share data, or it can give a group of people shared access to a bunch of
files.

{{index [path, URL], "GET method", "PUT method", "DELETE method"}}

When we treat ((file))s as HTTP ((resource))s, the HTTP methods `GET`,
`PUT`, and `DELETE` can be used to read, write, and delete the files,
respectively. We will interpret the path in the request as the path of
the file that the request refers to.

{{index [path, "file system"], "relative path"}}

We probably don't want to share our whole file system, so we'll
interpret these paths as starting in the server's working
((directory)), which is the directory in which it was started. If I
ran the server from `/tmp/public/` (or `C:\tmp\public\` on Windows),
then a request for `/file.txt` should refer to `/tmp/public/file.txt`
(or `C:\tmp\public\file.txt`).

{{index "file server example", "Node.js", "methods object", "Promise class"}}

We'll build the program piece by piece, using an object called
`methods` to store the functions that handle the various HTTP methods.
Method handlers are `async` functions that get the request object as
argument and return a promise that resolves to an object that
describes the response.

```{includeCode: ">code/file_server.js"}
const {createServer} = require("http");

const methods = Object.create(null);

createServer((request, response) => {
  let handler = methods[request.method] || notAllowed;
  handler(request)
    .catch(error => {
      if (error.status != null) return error;
      return {body: String(error), status: 500};
    })
    .then(({body, status = 200, type = "text/plain"}) => {
       response.writeHead(status, {"Content-Type": type});
       if (body && body.pipe) body.pipe(response);
       else response.end(body);
    });
}).listen(8000);

async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} not allowed.`
  };
}
```

{{index "405 (HTTP status code)"}}

This starts a server that just returns 405 error responses, which is
the code used to indicate that the server refuses to handle a given
method.

{{index "500 (HTTP status code)", "error handling", "error response"}}

When a request handler's promise is rejected, the `catch` call
translates the error into a response object, if it isn't one already, so
that the server can send back an error response to inform the client
that it failed to handle the request.

{{index "200 (HTTP status code)", "Content-Type header"}}

The `status` field of the response description may be omitted, in
which case it defaults to 200 (OK). The content type, in the `type`
property, can also be left off, in which case the response is assumed
to be plain text.

{{index "end method", "pipe method", stream}}

When the value of `body` is a ((readable stream)), it will have a
`pipe` method that is used to forward all content from a readable
stream to a ((writable stream)). If not, it is assumed to be either
`null` (no body), a string, or a buffer, and it is passed directly to the
((response))'s `end` method.

{{index [path, URL], "urlToPath function", "url package", parsing, [escaping, "in URLs"], "decodeURIComponent function", "startsWith method"}}

To figure out which file path corresponds to a request URL, the
`urlPath` function uses Node's built-in `url` module to parse the URL.
It takes its pathname, which will be something like `"/file.txt"`,
decodes that to get rid of the `%20`-style escape codes, and resolves
it relative to the program's working directory.

```{includeCode: ">code/file_server.js"}
const {parse} = require("url");
const {resolve, sep} = require("path");

const baseDirectory = process.cwd();

function urlPath(url) {
  let {pathname} = parse(url);
  let path = resolve(decodeURIComponent(pathname).slice(1));
  if (path != baseDirectory &&
      !path.startsWith(baseDirectory + sep)) {
    throw {status: 403, body: "Forbidden"};
  }
  return path;
}
```

As soon as you set up a program to accept network requests, you have
to start worrying about ((security)). In this case, if we aren't
careful, it is likely that we'll accidentally expose our whole ((file
system)) to the network.

File paths are strings in Node. To map such a string to an actual
file, there is a nontrivial amount of interpretation going on. Paths
may, for example, include `../` to refer to a parent directory. So
one obvious source of problems would be requests for paths like
`/../secret_file`.

{{index "path package", "resolve function", "cwd function", "process object", "403 (HTTP status code)", "sep binding", "backslash character", "slash character"}}

To avoid such problems, `urlPath` uses the `resolve` function from the
`path` module, which resolves relative paths. It then verifies that
the result is _below_ the working directory. The `process.cwd`
function (where `cwd` stands for "current working directory") can be
used to find this working directory. The `sep` variable from the
`path` package is the system's path separator—a backslash on Windows
and a forward slash on most other systems. When the path doesn't start
with the base directory, the function throws an error response object,
using the HTTP status code indicating that access to the resource is
forbidden.

{{index "file server example", "Node.js", "GET method"}}

We'll set up the `GET` method to return a list of ((file))s when
reading a ((directory)) and to return the file's content when reading
a regular file.

{{index "media type", "Content-Type header", "mime package"}}

One tricky question is what kind of `Content-Type` header we should
set when returning a file's content. Since these files could be
anything, our server can't simply return the same content type for all
of them. ((NPM)) can help us again here. The `mime` package (content
type indicators like `text/plain` are also called _((MIME type))s_)
knows the correct type for a large number of ((file extension))s.

{{index "require function", "npm program"}}

The following `npm` command, in the directory where the server script
lives, installs a specific version of `mime`:

```{lang: null}
$ npm install mime@2.2.0
```

{{index "404 (HTTP status code)", "stat function"}}

When a requested file does not exist, the correct HTTP status code to
return is 404. We'll use the `stat` function, which looks up
information about a file, to find out both whether the ((file)) exists
and whether it is a ((directory)).

```{includeCode: ">code/file_server.js"}
const {createReadStream} = require("fs");
const {stat, readdir} = require("fs").promises;
const mime = require("mime");

methods.GET = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return {status: 404, body: "File not found"};
  }
  if (stats.isDirectory()) {
    return {body: (await readdir(path)).join("\n")};
  } else {
    return {body: createReadStream(path),
            type: mime.getType(path)};
  }
};
```

{{index "createReadStream function", "asynchronous programming", "error handling", "ENOENT (status code)", "Error type", inheritance}}

Because it has to touch the disk and thus might take a while, `stat`
is asynchronous. Since we're using promises rather than callback
style, it has to be imported from `promises` instead of directly from
`fs`.

When the file does not exist, `stat` will throw an error object with a
`code` property of `"ENOENT"`. These somewhat obscure,
((Unix))-inspired codes are how you recognize error types in Node.

{{index "Stats type", "stat function", "isDirectory method"}}

The `stats` object returned by `stat` tells us a number of things
about a ((file)), such as its size (`size` property) and its
((modification date)) (`mtime` property). Here we are interested in
the question of whether it is a ((directory)) or a regular file, which
the `isDirectory` method tells us.

{{index "readdir function"}}

We use `readdir` to read the array of files in a ((directory)) and
return it to the client. For normal files, we create a readable stream
with `createReadStream` and return that as the body, along with the
content type that the `mime` package gives us for the file's name.

{{index "Node.js", "file server example", "DELETE method", "rmdir function", "unlink function"}}

The code to handle `DELETE` requests is slightly simpler.

```{includeCode: ">code/file_server.js"}
const {rmdir, unlink} = require("fs").promises;

methods.DELETE = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return {status: 204};
  }
  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);
  return {status: 204};
};
```

{{index "204 (HTTP status code)", "body (HTTP)"}}

When an ((HTTP)) ((response)) does not contain any data, the status
code 204 ("no content") can be used to indicate this. Since the
response to deletion doesn't need to transmit any information beyond
whether the operation succeeded, that is a sensible thing to return
here.

{{index idempotence, "error response"}}

You may be wondering why trying to delete a nonexistent file returns a
success status code, rather than an error. When the file that is being
deleted is not there, you could say that the request's objective is
already fulfilled. The ((HTTP)) standard encourages us to make
requests _idempotent_, which means that making the same request
multiple times produces the same result as making it once. In a way,
if you try to delete something that's already gone, the effect you
were trying to do has been achieved—the thing is no longer there.

{{index "file server example", "Node.js", "PUT method"}}

This is the handler for `PUT` requests:

```{includeCode: ">code/file_server.js"}
const {createWriteStream} = require("fs");

function pipeStream(from, to) {
  return new Promise((resolve, reject) => {
    from.on("error", reject);
    to.on("error", reject);
    to.on("finish", resolve);
    from.pipe(to);
  });
}

methods.PUT = async function(request) {
  let path = urlPath(request.url);
  await pipeStream(request, createWriteStream(path));
  return {status: 204};
};
```

{{index overwriting, "204 (HTTP status code)", "error event", "finish event", "createWriteStream function", "pipe method", stream}}

We don't need to check whether the file exists this time—if it does,
we'll just overwrite it. We again use `pipe` to move data from a
readable stream to a writable one, in this case from the request to
the file. But since `pipe` isn't written to return a promise, we have
to write a wrapper, `pipeStream`, that creates a promise around the
outcome of calling `pipe`.

{{index "error event", "finish event"}}

When something goes wrong when opening the file, `createWriteStream`
will still return a stream, but that stream will fire an `"error"`
event. The output stream to the request may also fail, for example if
the network goes down. So we wire up both streams' `"error"` events to
reject the promise. When `pipe` is done, it will close the output
stream, which causes it to fire a `"finish"` event. That's the point
where we can successfully resolve the promise (returning nothing).

{{index download, "file server example", "Node.js"}}

The full script for the server is available at
[_https://eloquentjavascript.net/code/file_server.js_](https://eloquentjavascript.net/code/file_server.js).
You can download that and, after installing its dependencies, run it
with Node to start your own file server. And, of course, you can modify
and extend it to solve this chapter's exercises or to experiment.

{{index "body (HTTP)", "curl program"}}

The command line tool `curl`, widely available on ((Unix))-like
systems (such as macOS and Linux), can be used to make ((HTTP))
((request))s. The following session briefly tests our server. The `-X`
option is used to set the request's ((method)), and `-d` is used to
include a request body.

```{lang: null}
$ curl http://localhost:8000/file.txt
File not found
$ curl -X PUT -d hello http://localhost:8000/file.txt
$ curl http://localhost:8000/file.txt
hello
$ curl -X DELETE http://localhost:8000/file.txt
$ curl http://localhost:8000/file.txt
File not found
```

The first request for `file.txt` fails since the file does not exist
yet. The `PUT` request creates the file, and behold, the next request
successfully retrieves it. After deleting it with a `DELETE` request,
the file is again missing.

## Summary

{{index "Node.js"}}

Node is a nice, small system that lets us run JavaScript in a
nonbrowser context. It was originally designed for network tasks to
play the role of a _node_ in a network. But it lends itself to all
kinds of scripting tasks, and if writing JavaScript is something you
enjoy, automating tasks with Node works well.

NPM provides packages for everything you can think of (and quite a few
things you'd probably never think of), and it allows you to fetch and
install those packages with the `npm` program. Node comes with a
number of built-in modules, including the `fs` module for working with
the file system and the `http` module for running HTTP servers and
making HTTP requests.

All input and output in Node is done asynchronously, unless you
explicitly use a synchronous variant of a function, such as
`readFileSync`. When calling such asynchronous functions, you provide
callback functions, and Node will call them with an error value and
(if available) a result when it is ready.

## Exercises

### Search tool

{{index grep, search, "search tool (exercise)"}}

On ((Unix)) systems, there is a command line tool called `grep` that
can be used to quickly search files for a ((regular expression)).

Write a Node script that can be run from the ((command line)) and acts
somewhat like `grep`. It treats its first command line argument as a
regular expression and treats any further arguments as files to search. It
should output the names of any file whose content matches the regular
expression.

When that works, extend it so that when one of the arguments is a
((directory)), it searches through all files in that directory and its
subdirectories.

{{index "asynchronous programming", "synchronous programming"}}

Use asynchronous or synchronous file system functions as you see fit.
Setting things up so that multiple asynchronous actions are requested
at the same time might speed things up a little, but not a huge
amount, since most file systems can read only one thing at a time.

{{hint

{{index "RegExp class", "search tool (exercise)"}}

Your first command line argument, the ((regular expression)), can be
found in `process.argv[2]`. The input files come after that. You can
use the `RegExp` constructor to go from a string to a regular
expression object.

{{index "readFileSync function"}}

Doing this synchronously, with `readFileSync`, is more
straightforward, but if you use `fs.promises` again to get
promise-returning functions and write an `async` function, the code
looks similar.

{{index "stat function", "statSync function", "isDirectory method"}}

To figure out whether something is a directory, you can again use
`stat` (or `statSync`) and the stats object's `isDirectory` method.

{{index "readdir function", "readdirSync function"}}

Exploring a directory is a branching process. You can do it either
by using a recursive function or by keeping an array of work (files that
still need to be explored). To find the files in a directory, you can
call `readdir` or `readdirSync`. The strange
capitalization—Node's file system function naming is loosely based on
standard Unix functions, such as `readdir`, that are all lowercase,
but then it adds `Sync` with a capital letter.

To go from a filename read with `readdir` to a full path name, you
have to combine it with the name of the directory, putting a ((slash
character)) (`/`) between them.

hint}}

### Directory creation

{{index "file server example", "directory creation (exercise)", "rmdir function"}}

Though the `DELETE` method in our file server is able to delete
directories (using `rmdir`), the server currently does not provide any
way to _create_ a ((directory)).

{{index "MKCOL method", "mkdir function"}}

Add support for the `MKCOL` method ("make column"), which should create
a directory by calling `mkdir` from the `fs` module. `MKCOL` is not a
widely used HTTP method, but it does exist for this same purpose in
the _((WebDAV))_ standard, which specifies a set of conventions on top
of ((HTTP)) that make it suitable for creating documents.

```{hidden: true, includeCode: ">code/file_server.js"}
const {mkdir} = require("fs").promises;

methods.MKCOL = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    await mkdir(path);
    return {status: 204};
  }
  if (stats.isDirectory()) return {status: 204};
  else return {status: 400, body: "Not a directory"};
};
```

{{hint

{{index "directory creation (exercise)", "file server example", "MKCOL method", "mkdir function", idempotency, "400 (HTTP status code)"}}

You can use the function that implements the `DELETE` method as a
blueprint for the `MKCOL` method. When no file is found, try to create
a directory with `mkdir`. When a directory exists at that path, you
can return a 204 response so that directory creation requests are
idempotent. If a nondirectory file exists here, return an error code.
Code 400 ("bad request") would be appropriate.

hint}}

### A public space on the web

{{index "public space (exercise)", "file server example", "Content-Type header", website}}

Since the file server serves up any kind of file and even includes the
right `Content-Type` header, you can use it to serve a website. Since
it allows everybody to delete and replace files, it would be an
interesting kind of website: one that can be modified, improved, and
vandalized by everybody who takes the time to create the right HTTP
request.

Write a basic ((HTML)) page that includes a simple JavaScript file.
Put the files in a directory served by the file server and open them
in your browser.

Next, as an advanced exercise or even a ((weekend project)), combine
all the knowledge you gained from this book to build a more
user-friendly interface for modifying the website—from _inside_ the
website.

Use an HTML ((form)) to edit the content of the files that make up the
website, allowing the user to update them on the server by using HTTP
requests, as described in [Chapter ?](http).

Start by making only a single file editable. Then make it so that the
user can select which file to edit. Use the fact that our file server
returns lists of files when reading a directory.

{{index overwriting}}

Don't work directly in the code exposed by the file server since if
you make a mistake, you are likely to damage the files there. Instead,
keep your work outside of the publicly accessible directory and copy
it there when testing.

{{hint

{{index "file server example", "textarea (HTML tag)", "fetch function", "relative path", "public space (exercise)"}}

You can create a `<textarea>` element to hold the content of the file
that is being edited. A `GET` request, using `fetch`, can retrieve the
current content of the file. You can use relative URLs like
_index.html_, instead of
[_http://localhost:8000/index.html_](http://localhost:8000/index.html),
to refer to files on the same server as the running script.

{{index "form (HTML tag)", "submit event", "PUT method"}}

Then, when the user clicks a button (you can use a `<form>` element
and `"submit"` event), make a `PUT` request to the same URL, with the
content of the `<textarea>` as request body, to save the file.

{{index "select (HTML tag)", "option (HTML tag)", "change event"}}

You can then add a `<select>` element that contains all the files in
the server's top ((directory)) by adding `<option>` elements
containing the lines returned by a `GET` request to the URL `/`. When
the user selects another file (a `"change"` event on the field), the
script must fetch and display that file. When saving a file, use the
currently selected filename.

hint}}
