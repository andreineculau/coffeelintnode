coffeelintnode - a coffee-script lint server for more expedient linting
=======================================================================

This is essentially a copy of `lintnode`_ (the David Miller fork
`davidmiller_lintnode`_) which is a fast way of Lint-ing JavaScript
code in the Emacs buffer, on-the-fly, using `flymake-mode`.  All I did
was make it work with `coffeelint`_ instead and make a few small
changes to make it work better with my set-up. YMMV.

Most of the explanation here is copied from `lintnode`_.

The following modules are needed with node: `coffeelint`_, `express`_
and underscore.  I recommend using npm to install them localling to
the directory.

.. _lintnode: https://github.com/keturn/lintnode
.. _davidmiller_lintnode: https://github.com/davidmiller/lintnode
.. _coffeelint: https://github.com/clutchski/coffeelint
.. _flymake-mode: http://www.emacswiki.org/emacs/FlymakeJavaScript
.. _JSLint: http://www.jslint.com/
.. _node.js: http://nodejs.org/
.. _Express: http://expressjs.com/
.. _npm: http://npmjs.org/

Note that this depends on


Usage
-----

::

  $ node coffeelintnode/app.js --port 3004 &
  Express started at http://localhost:3004/ in development mode

  $ coffeelintnode/coffeelint.curl myfilthycode.coffee

The exit code of ``coffeelint.curl`` is currently not nearly as
relevant as the output on standard out.  The output should be mostly
compatible with `JSLint's Rhino version`__ but it's missing the
'character' location as coffeelint doesn't support that.

.. __: http://www.jslint.com/rhino/


Emacs Usage
-----------

See the included `flymake-coffeelint.el`__.

.. __: flymake-coffeelint.el

The following configuration should be useful in getting it to work:


.. code-block:: lisp

	;; make coffeelinenode work nicely!
	(add-to-list 'load-path "path-to-coffeelintnode")
	(require 'flymake-coffeelint)
	;; Make sure we can find the lintnode executable
	(setq coffeelintnode-location "path-to-coffeelintnode")
	(setq coffeelintnode-node-program "path-to-node-executable")
	(setq coffeelintnode-coffeelintrc "path-to-coffeelintrc")
	;; Start the server when we first open a coffee file and start checking
	(setq coffeelintnode-autostart 'true)
	(add-hook 'coffee-mode-hook
	  (lambda ()
	    (coffeelintnode-hook)
	    (unless (eq buffer-file-name nil) (flymake-mode 1)) ;dont invoke flymake on temporary buffers for the interpreter
	    (local-set-key [f2] 'flymake-goto-prev-error)
	    (local-set-key [f3] 'flymake-goto-next-error)))



Configuration
-------------

`coffeelint_port` may be passed on the node command line with the
`--port` parameter.  It defaults to 3004.

`coffeelint_options` is set by passing `--coffeelintrc` to `app.js`.
e.g.

$ node app.js --coffeelintrc ~/.coffeelintrc

For documentation on coffeelint's options, see `coffeelint
options`_.

.. _coffeelint options: http://www.coffeelint.org/#options


Support
-------

This project is hosted at github, which has a wiki and an issue tracker:

  http://github.com/andreineculau/coffeelintnode


License
-------

This software is distributed under the same license__ as JSLint, which
looks like the MIT License with one additional clause:

  The Software shall be used for Good, not Evil.

.. __: LICENSE
