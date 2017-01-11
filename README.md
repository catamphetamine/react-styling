# react-styling

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

<!---
[![Gratipay][gratipay-image]][gratipay-url]
-->

Is a helper function to convert various CSS syntaxes into a React style JSON object

## Motivation

At first when I heard about "that React thing" a couple of years earlier I opened their website,
looked at the docs, saw the JSX syntax and said "wtf? who still does that? i'm not gonna ever use this, lol".

The same was the public's reaction at the first presentation of React:

[React.js Conf 2015 Keynote - Introducing React Native, 8:37](https://www.youtube.com/watch?v=KVZ-P-ZI6W4#t=517)

Okay, time passed, and after a couple of years I turned to React again and now I seemed to like it (and now I like it much more).

Then I saw that presentation by Christopher "vjeux" Chedeau

[React: CSS in JS by vjeux](https://speakerdeck.com/vjeux/react-css-in-js)

And I was again like "ummm, I'm not sure... do we really need to write our styles here too? what about web designers?"

[React.js Conf 2015 Keynote 2 - A Deep Dive into React Native, 9:14](https://www.youtube.com/watch?v=7rDsRXj9-cU#t=554)

And now, as you've already guessed, I'm writing my styles inline in my React components and I like it. As I see it, one should put generic styling (like body, h1, a, p, button, etc) into the main .css file and then put all the specific styles into the corresponding React components inline.

But still it was a bit of a hassle: you have your muscular memory of writing CSS, and now you need to write it all in JSON format with all those quotes which are difficult to reach with your pinkie (oh, and you missed one there, and your IDE automatically inserted an erroneous couple there, and now your syntax highlighting is broken), and commas (oh, you missed that one too, go figure; gosh, they still have commas in JSON objects in ES6 in the XXI'st century), and that camelCase (I don't like "borderBottomRadius", I don't like camelCase at all).

So I wrote this little module. All it does is it takes your CSS-alike text and transforms it to a valid JSON style object for your React components. It's simple and tiny. The syntax is clear and uncluttered. The module itself is unobtrusive and unopinionated (if you think it is go create an issue or a pull request).

## Installation

```bash
$ npm install react-styling
```

## Usage

This module uses an ES6 feature called [template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings) which allows you to write multiline strings (finally). You can still use this module with the old ES5 (regular javascript) syntax passing it a regular string, but it's much more convenient for you to just use [Babel](https://babeljs.io/docs/setup/) for ES6 to ES5 conversion (everyone out there does it by the way).

```javascript
import React from 'react'
import styler from 'react-styling'

export default class Page extends React.Component
{
  render()
  {
    return (
      <div>
        <header>
          <ul style={style.menu}>
            <li style={style.menu.item}><Link to="login" style={style.menu.item.link} activeStyle={style.menu.item.link.current}>Login</Link></li>
            <li style={style.menu.item}><Link to="about" style={style.menu.item.link} activeStyle={style.menu.item.link.current}>About</Link></li>
          </ul>
        </header>

        <RouteHandler/>
      </div>
    )
  }
}

const style = styler
`
  menu
    list-style-type: none

    item
      display: inline-block

      link
        display         : inline-block
        text-decoration : none
        color           : #000000
        padding         : 0.4em

        // notice the ampersand character here:
        // this feature is called a "modifier" class 
        // (see the "Modifiers" section of this document)
        &current
          color            : #ffffff
          background-color : #000000

  // supports comma separated style classes
  // and further style class extension
  
  can_style, multiple_classes, at_once
    font-family : Sans

  can_style
    font-size : 12pt

  multiple_classes, at_once
    font-size : 8pt

  /*
  multi
  line
  comment
  */

  .old-school-regular-css-syntax {
    box-sizing: border-box;
    color: black;
  }

  .scss_less {
    color: white;

    &:hover {
      text-decoration: underline;
    }
  }

  curly_braces_fan {
    background: none

    curly_braces_fan_number_two {
      background: transparent
    }
  }

  YAML_fan:
    display: inline-block

    python:
      length: 99999px

  // for Radium users
  @media (min-width: 320px)
    width: 100%

    :hover 
      background: white
`
```

The example is self-explanatory. The CSS text in the example above will be transformed to this JSON object

```javascript
{
  menu:
  {
    listStyleType: 'none',

    item:
    {
      display: 'inline-block',

      link:
      {
        display        : 'inline-block',
        textDecoration : 'none',
        color          : '#000000',
        padding        : '0.4em',

        current:
        {
          display         : 'inline-block',
          textDecoration  : 'none',
          color           : '#ffffff',
          backgroundColor : '#000000',
          padding         : '0.4em'
        }
      }
    }
  },

  can_style:
  {
    fontFamily : 'Sans',
    fontSize   : '12pt'
  },

  multiple_classes:
  {
    fontFamily : 'Sans',
    fontSize   : '8pt'
  },
  
  at_once:
  {
    fontFamily : 'Sans',
    fontSize   : '8pt'
  },

  'old-school-regular-css-syntax':
  {
    boxSizing: 'border-box',
    color: 'black'
  },

  scss_less:
  {
    color: 'white',

    ':hover' 
    {
      color: 'white',
      textDecoration: 'underline'
    }
  },

  curly_braces_fan:
  {
    background: 'none',

    curly_braces_fan_number_two:
    {
      background: 'transparent'
    }
  },

  YAML_fan:
  {
    display: 'inline-block',

    python:
    {
      length: '99999px'
    }
  },

  '@media (min-width: 320px)': 
  {
    width: '100%',

    ':hover': 
    {
      background: 'white'
    }
  }
}
```

And that's it. No fancy stuff, it's just what this module does. You can then take this JSON object and use it as you wish.

Pay attention to the tabulation as it's required for the whole thing to work properly. If you're one of those people who (for some strange reason) prefer spaces over tabs then you can still use it with spaces. Again, make sure that you keep all your spacing in order. And you can't mix tabs and spaces.

You can use your good old pure CSS syntax with curly braces, semicolons and dotted style class names (in this case the leading dots in CSS style class names will be omitted for later JSON object keying convenience).

Curly braces are a survival from the dark ages of 80s and the good old C language. Still you are free to use your curly braces for decoration - they'll simply be filtered out.

You can also use YAML-alike syntax if you're one of those Python people.

You can use both one-line comments and multiline comments.

### Nesting

In the example above the result is a JSON object with a nested tree of CSS style classes. You can flatten it if you like by using `import { flat as styler } from 'react-styling'` instead of the default `import styler from 'react-styling'`.

The difference is that the flat styler will flatten the CSS style class tree by prefixing all the style class names accordingly. 

The reason this feature was introduced is that, for example, [Radium](#radium) would give warnings if a style object contained child style objects.

Also, I noticed that React, given a style object containing child style objects, creates irrelevant inline styles, e.g. `<span style="color: black; child_style_object_name: [Object object]; background: white"/>`: it doesn't break anything, but if some day React starts emitting warnings for that then just start using the `flat` styler.

### Modifiers

In the example above, notice the ampersand before the "current" style class - this feature is optional (you don't need to use it at all), and it means that this style class is a "modifier" and all the style from its parent style class will be included in this style class. In this example, the padding, color, display and text-decoration from the "link" style class will be included in the "current" style class, so it works just like LESS/SASS ampersand. If you opt in to using the "modifiers" feature then you won't need to do manual merging like `style="extend({}, style.menu.item.link, style.menu.item.link.current)"`.

Modifiers, when populated with the parent's styles, will also be populated with all the parent's pseudo-classes (those ones starting with a colon) and media queries (those ones starting with an at). This is done for better and seamless integration with [Radium](https://github.com/halt-hammerzeit/react-styling#radium).

Modifiers are applied all the way down to the bottom of the style subtree and, therefore, all the child styles are "modified" too. For example, this stylesheet

```javascript
original
  display : inline-block

  item
    border : none
    color  : black

  &active
    item
      color      : white
      background : black
```

will be transformed to this style object

```javascript
original:
{
  display: 'inline-block',

  item:
  {
    border : 'none',
    color  : 'black'
  },

  active:
  {
    display: 'inline-block',

    item:
    {
      border     : 'none',
      color      : 'white',
      background : 'black'
    }
  }
}
```

### Shorthand style property expansion

[A request was made](https://github.com/halt-hammerzeit/react-styling/issues/3) to [add](https://github.com/halt-hammerzeit/react-styling/pull/4) shorthand style property expansion feature to this library. The motivation is that when writing a CSS rule like `border: 1px solid red` in a base class and then overriding it with `border-color: blue` in some modifier class (like `:hover`) it's all merged correctly both when `:hover` is added and when `:hover` is removed. In React though, style rule update algorythm is not nearly that straightforward and bulletproof, and is in fact [a very basic one](https://github.com/facebook/react/issues/5397) which results in React not handling shorhand CSS property updates correctly. In these cases a special flavour of `react-styling` can be used:

```js
import { expanded as styler } from 'react-styling'

styler `
  margin: 10px
  border: 1px solid red
`
```

Which results in the following style object

```js
{
  marginTop    : '10px',
  marginBottom : '10px',
  marginLeft   : '10px',
  marginRight  : '10px',

  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'red',
  // etc
}
```

### Radium

There's a (popular) thing called [Radium](https://github.com/FormidableLabs/radium), which allows you to (citation):

  * Browser state styles to support :hover, :focus, and :active
  * Media queries
  * Automatic vendor prefixing
  * Keyframes animation helper

You can use react-styling with this Radium library too: write you styles in text, then transform the text using react-styling into a JSON object, and then use that JSON object with Radium. If you opt in to use the "modifiers" feature of this module then you won't have to write `style={[style.a, style.a.b]}`, you can just write `style={style.a.b}`.

Here is the [DroidList example](https://github.com/FormidableLabs/radium/tree/master/docs/faq#how-do-i-use-pseudo-selectors-like-checked-or-last) from Radium FAQ rewritten using react-styling. Because `first` and `last` are "modifiers" here the `:hover` pseudo-class will be present inside each of them as well.

```javascript
// Notice the use of the "flat" styler as opposed to the default one:
// it flattens the nested style object into a shallow style object.
import { flat as styler } from 'react-styling'

var droids = [
  'R2-D2',
  'C-3PO',
  'Huyang',
  'Droideka',
  'Probe Droid'
]

@Radium
class DroidList extends React.Component {
  render() {
    return (
      <ul style={style.droids}>
        {droids.map((droid, index, droids) =>
          <li key={index} style={index === 0 ? style.droid_first : index === (droids.length - 1) ? style.droid_last : style.droid}>
            {droid}
          </li>
        )}
      </ul>
    )
  }
}

const style = styler`
  droids
    padding : 0

  droid
    border-color : black
    border-style : solid
    border-width : 1px 1px 0 1px
    cursor       : pointer
    list-style   : none
    padding      : 12px

    :hover
      background : #eee

    &first
      border-radius : 12px 12px 0 0

    &last
      border-radius : 0 0 12px 12px
      border-width  : 1px
`
```

### Performance

In the examples above, `react-styling` transforms style text into a JSON object every time a React component is instantiated and then it will reuse that JSON style object for all `.render()` calls. React component instantiation happens, for example, in a `for ... of` loop or when a user navigates a page. I guess the penalty on the performance is negligible in this scenario. Yet, if someone wants to play with Babel they can write a Babel plugin (similar to [the one](https://github.com/facebook/relay/blob/master/scripts/babel-relay-plugin/src/getBabelRelayPlugin.js#L105) they use in [Relay](https://facebook.github.io/relay/docs/guides-babel-plugin.html#content)) and submit a Pull Request.

### Contributing

After cloning this repo, ensure dependencies are installed by running:

```sh
npm install
```

This module is written in ES6 and uses [Babel](http://babeljs.io/) for ES5
transpilation. Widely consumable JavaScript can be produced by running:

```sh
npm run build
```

Once `npm run build` has run, you may `import` or `require()` directly from
node.

After developing, the full test suite can be evaluated by running:

```sh
npm test
```

While actively developing, one can use (personally I don't use it)

```sh
npm run watch
```

in a terminal. This will watch the file system and run tests automatically 
whenever you save a js file.

When you're ready to test your new functionality on a real project, you can run

```sh
npm pack
```

It will `build`, `test` and then create a `.tgz` archive which you can then install in your project folder

```sh
npm install [module name with version].tar.gz
```

## License

[MIT](LICENSE)
[npm-image]: https://img.shields.io/npm/v/react-styling.svg
[npm-url]: https://npmjs.org/package/react-styling
[travis-image]: https://img.shields.io/travis/halt-hammerzeit/react-styling/master.svg
[travis-url]: https://travis-ci.org/halt-hammerzeit/react-styling
[downloads-image]: https://img.shields.io/npm/dm/react-styling.svg
[downloads-url]: https://npmjs.org/package/react-styling
[coveralls-image]: https://img.shields.io/coveralls/halt-hammerzeit/react-styling/master.svg
[coveralls-url]: https://coveralls.io/r/halt-hammerzeit/react-styling?branch=master

<!---
[gratipay-image]: https://img.shields.io/gratipay/dougwilson.svg
[gratipay-url]: https://gratipay.com/dougwilson/
-->