import chai from 'chai'
import styler from './../source/index'

chai.should()

describe('styler', function()
{
	it('should convert text to JSON object', function()
	{
		const dummy_variable_for_template_string_testing = 'none'

		const style = styler
		`
			menu
				list-style-type: ${dummy_variable_for_template_string_testing}

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

						&current
							color            : #ffffff
							background-color : #000000

							@media (min-width: 320px)
								width: 100%

								:hover 
									background: white
									whatever: 1.3
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
							backgroundColor : '#000000',

							'@media (min-width: 320px)': 
							{
								width: '100%',

								':hover': 
								{
									background: 'white',
									whatever: 1.3
								}
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

						&current
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

						&current:
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

                  &current
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

         &current
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

	it('should support comments', function()
	{
		const style = styler
		`
			menu
				list-style-type: none

				// notice the dot character here.
				// this is called a "modifier" class 
				// (see the explanation of this term below)
				&one
					display: inline-block // inline-block here

					/* 
					multi
					line
					comment
					*/
					two
						display         : block
						text-decoration : none
						color           : #000000
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
						display        : 'block',
						textDecoration : 'none',
						color          : '#000000'
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

				// notice the dot character here.
				// this is called a "modifier" class 
				// (see the explanation of this term below)
				&one
					display: inline-block
					background: none

					// this is a "modifier" class
					&two
						display         : block
						text-decoration : none
						color           : #000000

					// this is a "modifier" class
					&three
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
					background     : 'none',

					two:
					{
						listStyleType  : 'none',
						display        : 'block',
						textDecoration : 'none',
						color          : '#000000',
						background     : 'none'
					},

					three:
					{
						listStyleType  : 'none',
						display        : 'inline-block',
						color          : '#ffffff',
						background     : 'none'
					}
				}
			}
		}

		style.should.deep.equal(object)
	})

	it('should support old school CSS syntax', function()
	{
		const style = styler`
			.old-school-regular-css-syntax {
				box-sizing: border-box;

				&.modifier {
					border-width: 1px;
				}
			}

			.blah {
				border: none;
				color: white;

				.nested {
					color: black;
				}
			}
		`

		const object =
		{
			'old-school-regular-css-syntax':
			{
				boxSizing: 'border-box',

				modifier:
				{
					boxSizing: 'border-box',
					borderWidth: '1px'
				}
			},

			blah:
			{
				border: 'none',
				color: 'white',

				nested:
				{
					color: 'black'
				}
			}
		}

		style.should.deep.equal(object)
	})

	it('should preserve pseudo-classes and media queries in modifiers', function()
	{
		const style = styler
		`
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

      @media-query-test
        box-sizing : border-box

      &@non-media-query-test
        background : black

      &:this_class_wont_be_copied_into_modifiers_because_it_is_itself_a_modifier
        background : transparent

      &:first
        border-radius : 12px 12px 0 0

      &:last
        border-radius : 0 0 12px 12px
        border-width  : 1px
		`

		const object =
		{
			droids:
			{
				padding: 0,

				droid:
				{
					borderColor : 'black',
					borderStyle : 'solid',
					borderWidth : '1px 1px 0 1px',
					cursor      : 'pointer',
					listStyle   : 'none',
					padding     : '12px',

					':hover':
					{
						background : '#eee'
					},

					'@media-query-test':
					{
						boxSizing : 'border-box'
					},

					'@non-media-query-test':
					{
						borderColor : 'black',
						borderStyle : 'solid',
						borderWidth : '1px 1px 0 1px',
						cursor      : 'pointer',
						listStyle   : 'none',
						padding     : '12px',

						background : 'black',

						':hover':
						{
							background : '#eee'
						},

						'@media-query-test':
						{
							boxSizing : 'border-box'
						}
					},

					':this_class_wont_be_copied_into_modifiers_because_it_is_itself_a_modifier':
					{
						borderColor : 'black',
						borderStyle : 'solid',
						borderWidth : '1px 1px 0 1px',
						cursor      : 'pointer',
						listStyle   : 'none',
						padding     : '12px',

						background : 'transparent',

						':hover':
						{
							background : '#eee'
						},

						'@media-query-test':
						{
							boxSizing : 'border-box'
						}
					},

					':first':
					{
						borderColor : 'black',
						borderStyle : 'solid',
						borderWidth : '1px 1px 0 1px',
						cursor      : 'pointer',
						listStyle   : 'none',
						padding     : '12px',

						borderRadius : '12px 12px 0 0',

						':hover':
						{
							background : '#eee'
						},

						'@media-query-test':
						{
							boxSizing : 'border-box'
						}
					},

					':last':
					{
						borderColor : 'black',
						borderStyle : 'solid',
						cursor      : 'pointer',
						listStyle   : 'none',
						padding     : '12px',

						borderRadius : '0 0 12px 12px',
						borderWidth  : '1px',

						':hover':
						{
							background : '#eee'
						},

						'@media-query-test':
						{
							boxSizing : 'border-box'
						}
					}
				}
			}
		}

		style.should.deep.equal(object)
	})
})