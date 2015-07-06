import chai from 'chai'
import styler from './../index'

chai.should()

describe('styler', function()
{
	it('should convert text to JSON object', function()
	{
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

		const object =
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
							paddingLeft     : '0.4em',
							paddingRight    : '0.4em',
							paddingTop      : '0.2em',
							paddingBottom   : '0.2em',
							backgroundColor : '#000000'
						}
					}
				}
			}
		}

		style.should.deep.equal(object)
	})

	it('should work with curly braces', function()
	{
		const style = styler
		`
			menu {
				list-style-type: none

				item
				{
					display: inline-block

					link {
						display         : inline-block
						text-decoration : none
						color           : #000000

						padding-left    : 0.4em
						padding-right   : 0.4em
						padding-top     : 0.2em
						padding-bottom  : 0.2em

						:radium
							display: table

						.current
						{
							color            : #ffffff
							background-color : #000000
						}
					}
				}
			}
		`

		const object =
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

						':radium':
						{
							display: 'table'
						},

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

		style.should.deep.equal(object)
	})

	it('should work with spaces instead of tabs', function()
	{
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

		const object =
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
							paddingBottom   : '0.2em'
						}
					}
				}
			}
		}

		style.should.deep.equal(object)
	})
})