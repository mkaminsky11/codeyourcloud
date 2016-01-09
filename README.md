![logo](https://codeyourcloud.com/icon_128.png)
#Code Your Cloud#

[Main project page](https://codeyourcloud.com) | [About](https://codeyourcloud.com/about) | [Google+](https://plus.google.com/u/0/b/109834723365906365793/+Codeyourcloudeditor/posts)

**Created by [Michael Kaminsky](https://mkaminsky11.github.io)**

The goal of this project is to allow people around the globe to collaborate on coding projects via Google Drive and OneDrive. It's that simple.

### Installation Notes
This is only the **FRONTEND**. There is also a backend component which is not open-source (yet), which is used for some things like preferences and authentication. The goal of publishing this is to show others how to successfully interact with the Google Drive and OneDrive APIs.

### The Good Parts
If you want to see the places where all of the _magic_ happens, take a look at `js/drive.js`, `js/sky.js`, and `js/tabs.js`. Enjoy!

### Recent Updates
+ Tree contents loaded asyncronously
+ Modes dynamically loaded, instead of all at once
+ Can now import and export snippets
+ Open tabs now stored automatically and reloaded
+ Added ability to copy snippets to clipboard
+ Added a snippet manager (located in sidebar) which replaces the Javascript REPL
+ Updated to [CodeMirror](http://codemirror.net/) version 5.9 ([release notes](http://codemirror.net/doc/releases.html))
+ Now supports [OneDrive](https://onedrive.live.com/)
+ Persistant preferences via backend

![Screenshot](http://codeyourcloud.com/images/web.png)

### Todo
+ Run Python + other languages
+ Copy files
+ Context menu in sidebar
+ Minimize and beautify
+ ~~Warning when closing without saving changes~~ **DONE!**
+ ~~Snippets (coming soon)~~ **DONE!**
+ Fix running Javascript + Coffeescript
+ ~~Import and export snippets~~ **DONE!**
+ ~~Store open tabs and reload on open~~ **DONE!**
+ ~~Dynamically load modes~~ **DONE!**
+ Custom-made color picker (WIP)
+ Chat and collaboration using our backend, so that Onedrive users can chat and collaborate as well
+ Better publishing (WIP)
+ ~~Remove Roboto font, use websafe font~~ **KEEP IT, LOADED VIA GOOGLE FONTS**

### Long-Term Goals
+ Improve user onboarding and visual interface
+ Reduce bloat and increase speed

=====

### Features
+ Snippet manager
+ Syntax highlighting
+ Collaboration
+ Built-in color picker
+ HTML and markdown preview
+ Autocomplete
+ Javascript console
+ Keyboard shortcuts
+ Preferences
+ Google Drive and OneDrive integration
+ Run (javascript and Coffeescript only, for now)
+ Minimap preview
+ Search/replace

### Supported Languages
+ APL
+ PGP
+ ASN.1
+ Asterisk
+ Brainfuck
+ C
+ C++
+ Cobol
+ C#
+ Clojure
+ Closure Stylesheets (GSS)
+ CMake
+ CoffeeScript
+ Common Lisp
+ Cypher
+ Cython
+ CSS
+ CQL
+ D
+ Dart
+ diff
+ Django
+ Dockerfile
+ DTD
+ Dylan
+ EBNF
+ ECL
+ Eiffel
+ Elm
+ Embedded Javascript
+ Embedded Ruby
+ Erlang
+ Factor
+ Forth
+ Fortran
+ F#
+ Gas
+ Gherkin
+ GitHub Flavored Markdown
+ Go
+ Groovy
+ HAML
+ Haskell
+ Haxe
+ HXML
+ ASP.NET
+ HTML
+ HTTP
+ IDL
+ Jade
+ Java
+ Java Server Pages
+ JavaScript
+ JSON
+ JSON-LD
+ Jinja2
+ Julia
+ Kotlin
+ LESS
+ LiveScript
+ Lua
+ Markdown
+ mIRC
+ MariaDB SQL
+ Mathematica
+ Modelica
+ MUMPS
+ MS SQL
+ MySQL
+ Nginx
+ NSIS
+ NTriples
+ Objective C
+ OCaml
+ Octave
+ Oz
+ Pascal
+ PEG.js
+ Perl
+ PHP
+ Pig
+ Plain Text
+ PLSQL
+ Properties files
+ Python
+ Puppet
+ Q
+ R
+ reStructuredText
+ RPM Changes
+ RPM Spec
+ Ruby
+ Rust
+ Sass
+ Scala
+ Scheme
+ SCSS
+ Shell
+ Sieve
+ Slim
+ Smalltalk
+ Smarty
+ Solr
+ Soy
+ SPARQL
+ Spreadsheet
+ SQL
+ Squirrel
+ Swift
+ MariaDB
+ sTeX
+ LaTeX
+ SystemVerilog
+ Tcl
+ Textile
+ TiddlyWiki 
+ Tiki wiki
+ TOML
+ Tornado
+ troff
+ TTCN
+ TTCN_CFG
+ Turtle
+ TypeScript
+ Twig
+ VB.NET
+ VBScript
+ Velocity
+ Verilog
+ VHDL
+ XML
+ XQuery
+ YAML
+ Z80
+ mscgen
+ xu
+ msgenny


###Themes###
+ 3024 day
+ 3024 night
+ abcdef
+ ambiance
+ ambiance mobile
+ base16 dark
+ base16 light
+ bespin
+ blackboard
+ cobalt
+ colorforth
+ dracula
+ eclipse
+ elegant
+ erlang dark
+ hopscotch
+ icecoder
+ isotope
+ lesser dark
+ liquibyte
+ material
+ mbo
+ mdn like
+ midnight
+ monokai
+ neat
+ neo
+ night
+ paraiso dark
+ paraiso light
+ pastel on dark
+ railscasts
+ rubyblue
+ seti
+ solarized
+ the matrix
+ tomorrow night bright
+ tomorrow night eighties
+ ttcn
+ twilight
+ vibrant ink
+ xq dark
+ xq light
+ yeti
+ zenburn

=====

###License
>The MIT License (MIT) 
>Copyright (c) 2015 Michael Kaminsky
>
>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to  deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.