import chai from 'chai'
import styler from './../source/index'

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

						@media (min-width: 320px)
							width: 100%

							:hover 
								background: white
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

						.current
						{
							color            : #ffffff
							background-color : #000000
						}

						@media (min-width: 320px) {
							width: 100%

							:hover {
								background: white
							}
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

		style.should.deep.equal(object)
	})

	it('should support YAML-alike syntax', function()
	{
		const style = styler
		`
			menu:
				list-style-type: none

				item:
					display: inline-block

					link:
						display         : inline-block
						text-decoration : none
						color           : #000000

						padding-left    : 0.4em
						padding-right   : 0.4em
						padding-top     : 0.2em
						padding-bottom  : 0.2em

						.current:
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

	it('should add initial tabulation', function()
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

	it('should support nested modifiers', function()
	{
		const style = styler
		`
			menu
				list-style-type: none

				.one
					display: inline-block

					.two
						display         : block
						text-decoration : none
						color           : #000000

					.three
						color           : #ffffff
		`

		const object =
		{
			menu:
			{
				listStyleType: 'none',

				one:
				{
					listStyleType  : 'none',
					display        : 'inline-block',

					two:
					{
						listStyleType: 'none',
						display        : 'block',
						textDecoration : 'none',
						color          : '#000000'
					},

					three:
					{
						listStyleType  : 'none',
						display        : 'inline-block',
						color          : '#ffffff'
					}
				}
			}
		}

		style.should.deep.equal(object)
	})
})