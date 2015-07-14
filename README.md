# react-styling

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

<!---
[![Gratipay][gratipay-image]][gratipay-url]
-->

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

And now, as you've already guessed, I'm writing my styles inline in my React components and I like it.

But still it was a bit of a hassle: you have your muscular memory of writing CSS, and now you need to write it all in JSON format with all those quotes which are difficult to reach with your pinkie (oh, and you missed one there, and your IDE automatically inserted an erroneous couple there, and now your syntax highlighting is broken), and commas (oh, you missed that one too, go figure; gosh, they still have commas in JSON objects in ES6 in the XXI'st century), and that camelCase (I don't like "borderBottomRadius", I don't like camelCase at all).

So I wrote this little module. All it does is it takes your CSS-alike text and transforms it to a valid JSON style object for your React components. It's simple and tiny. The syntax is clear and uncluttered. The module itself is unobtrusive and unopinionated (if you think it is go create an issue or a pull request).

There is also this [Radium](https://github.com/FormidableLabs/radium) thing on the internets.
It allows you to (citation):

  * Conceptually simple extension of normal inline styles
  * Browser state styles to support :hover, :focus, and :active
  * Media queries
  * Automatic vendor prefixing
  * Keyframes animation helper
  * ES6 class and createClass support

And you can use this module with this [Radium](https://github.com/FormidableLabs/radium) thing too: write you styles in text, then transform the text using react-styling into a JSON object, and then use that JSON object with [Radium](https://github.com/FormidableLabs/radium), and it will work. If you opt in to use the "modifiers" feature of this module then you won't have to write `style={[style.a, style.a.b]}`, you can just write `style={style.a.b}`.

## Installation

```bash
$ npm install react-styling
```

## Usage

This module uses an ES6 feature called [template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings) which allows you to write multiline strings (finally). You can still use this module with the old ES5 (regular javascript) syntax passing it a regular string, but it's much more convenient for you to just use [Babel](https://babeljs.io/docs/setup/) for ES6 to ES5 conversion (everyone out there does it by the way).

```js
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
        // (see the "Modifiers" section of this document below)
        &current
          color            : #ffffff
          background-color : #000000

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

```js
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

### Modifiers

In the example above, notice the ampersand before the "current" style class - this feature is optional (you don't need to use it at all), and it means that this style class is a "modifier" and all the style from its parent style class will be included in this style class. In this example, the padding, color, display and text-decoration from the "link" style class will be included in the "current" style class, so it works just like LESS/SASS ampersand. If you opt in to using the "modifiers" feature then you won't need to do manual merging like `style="extend({}, style.menu.item.link, style.menu.item.link.current)"`.

Modifiers, when populated with the parent's styles, will also be populated with all the parent's pseudo-classes (those ones starting with a colon) and media queries (those ones starting with an at). This is done for better and seamless integration with [Radium](https://github.com/FormidableLabs/radium). [Featured in Radium FAQ](https://github.com/FormidableLabs/radium/blob/master/docs/faq/README.md) by the way.

### What's next

I can add the features you want (or you can do it). I can work on making errors more user friendly and helpful if anyone else uses this module.

If you want a feature, go create an issue (before making a pull request). If it doesn't work for you or you're having errors when using this module - go create an issue.

Maybe I could also write a webpack loader to perform text-to-json conversion at compile time as opposed to run time. If anyone needs that at all.

### Development

If you'd like to start working on this project you'll need to run your usual `npm install` and then everything should work: `npm test`

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