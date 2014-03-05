js-grid
=======
js-grid can display your table data in a nice grid.

**grid.html** contains some example showing how to use it.

Usage
----------
The branch ```subtreeable``` can be used to import tools in your projects using [Git subtree](http://git-scm.com/book/ch6-7.html).
* Add this repository as a remote to your project
```
git remote add -f js-grid https://github.com/matco/js-grid.git
```
* Create the subtree from branch ```subtreeable```
```
git subtree add --prefix js-grid-folder js-grid/subtreeable --squash
```
* Update js-grid in your project
```
git fetch js-grid subtreeable
git subtree pull --prefix js-grid-folder js-grid subtreeable --squash
```

You are free to remove any tool you don't need.
