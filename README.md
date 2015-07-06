# react-styling

## Motivation

At first when I heard about "that React thing" a couple of years earlier I opened their website,
looked at the docs, saw the JSX syntax and said "wtf? who still does that? i'm not gonna ever use this, lol".

The same was the public's reaction at the first presentation of React:

[React.js Conf 2015 Keynote - Introducing React Native, 8:37](https://www.youtube.com/watch?v=KVZ-P-ZI6W4#t=517)

Okay, time passed, and after a couple of years I turned to React again and now I seemed to like it (and now I like it much more).

Then I saw that presentation by Christopher "vjeux" Chedeau

[React: CSS in JS by vjeux](https://speakerdeck.com/vjeux/react-css-in-js)

And I was again like "ummm, I'm not sure... do we really need to write our styles here too? what about web-designers?"

[React.js Conf 2015 Keynote 2 - A Deep Dive into React Native, 9:14](https://www.youtube.com/watch?v=7rDsRXj9-cU#t=554)

And now, as you've already guessed, I'm writing my styles inline in my React components and I like it.

But still it was a bit of a hassle: you have your muscular memory of writing CSS, and now you need to write it all in JSON format with all those quotes (oh, you missed one there), and commas (gosh, they still have commas in JSON objects in ES6 in the XXI'st century), and that camelCase (I don't like "borderBottomRadius", I don't like camelCase at all).

So I wrote this little module. All it does is it takes your CSS-alike text and transforms it to a valid JSON style object for your React components. It's simple and tiny. It's unobtrusive and unopinionated (if you think it is - go create an issue or a pull request).

There is also some ["Radium"](https://github.com/FormidableLabs/radium) thing on the internets.
You can use this module with that Radium too: write you styles in text, then transform the text
using react-styling into a JSON object, and then use that JSON object with that Radium thing.

## Installation

```bash
$ npm install react-styling
```

## Usage

This module is written in ES6.
To use it, you can either use ES6 in your application, or you can use Babel (which I do and most of the modern developers out there too).

Then you write your styles using just tabulation and CSS syntax.

```js
import styler from 'react-styler'

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

        padding-left    : 0.4em
        padding-right   : 0.4em
        padding-top     : 0.2em
        padding-bottom  : 0.2em

        .current
          color            : #ffffff
          background-color : #000000
`
```

The example is self-explanatory. Notice the dot before the "current" class - this feature is optional (you don't need to use it at all), and it means that this style class is a "modifier" and all the default style (in this case, all the paddings, etc) will be included in this style class so that you don't need to do manual merging like style="extend({}, style.menu.item.link, style.menu.item.link.current)".

The CSS text in the example above will be transformed to this JSON object

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
        paddingLeft    : '0.4em',
        paddingRight   : '0.4em',
        paddingTop     : '0.2em',
        paddingBottom  : '0.2em',

        current:
        {
          display         : 'inline-block',
          textDecoration  : 'none',
          color           : '#ffffff',
          backgroundColor : '#000000',
          paddingLeft     : '0.4em',
          paddingRight    : '0.4em',
          paddingTop      : '0.2em',
          paddingBottom   : '0.2em',
        }
      }
    }
  }
}
```

And that's it. No fancy stuff, it's just what this module does. You can then take this JSON object and use it as you wish.

Pay attention to the tabulation as it's required for the whole thing to work properly. If you're one of those people who (for some strange reason) prefer spaces over tabs then you can still use it with spaces. Again, make sure that you keep all your spacing in order. And you can't mix tabs and spaces.

There are no curly braces because they are a survival from the dark ages of 80s and the good old C language. Still you are free to use your curly braces for decoration - they'll simply be ignored.

```js
const style = styler
`
  menu {
    list-style-type: none

    item {
      display: inline-block

      link {
        display         : inline-block
        text-decoration : none
        color           : #000000

        padding-left    : 0.4em
        padding-right   : 0.4em
        padding-top     : 0.2em
        padding-bottom  : 0.2em

        .current {
          color            : #ffffff
          background-color : #000000
        }
      }
    }
  }
`
```

### What's next

I can add the features you want (or you can do it). I can cover it with tests (or you can do it).

We can also work on making errors more user friendly and helpful. If anyone uses this module.

If you want a feature, go create an issue (or even a pull request). If it doesn't work for you or you're having errors with it - go create an issue, again.

## License

[MIT](LICENSE)