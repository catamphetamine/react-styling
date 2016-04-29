import chai from 'chai'
import styler from './../source/index'

chai.should()

describe('styler', function()
{
	it('shouldn\'t allow invalid style class type hierarchy', function()
	{
		const style_function = (style) => (() => styler(style))

		style_function
		(`
			menu
				:hover
					:active
		`)
		.should.throw('Pseudoclasses (:hover, etc) can\'t contain child style classes')

		style_function
		(`
			menu
				@media
					:active
		`)
		.should.not.throw('good function')

		style_function
		(`
			menu
				@media
					passive
		`)
		.should.throw('Media query style classes can only contain pseudoclasses (:hover, etc)')
		
		style_function
		(`
			menu
				@keyframes
					10%
		`)
		.should.not.throw('good function')

		style_function
		(`
			menu
				@keyframes
					whatever
		`)
		.should.throw('Keyframes style classes can only contain keyframe selectors (from, 100%, etc)')
		
	})

	it('should convert text to JSON object', function()
	{
		const dummy_variable_for_template_string_testing = 'none'

		const style = styler
		`
			background: red

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

							@keyframes test
								0% 
									padding: 0px
								100%
									padding: 10px
		`

		const object =
		{
			background: 'red',

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
							},
							
							'@keyframes test': 
							{
								'0%': 
								{
									padding: '0px'
								},
								'100%': 
								{
									padding: '10px'
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
					// inline-block here
					display: inline-block

					/* 
					multi
					line
					comment
					*/
					two
						display          : block
						text-decoration  : none
						color            : #000000
						// single line comments may only start from the beginning of the line
						// so that urls in background-images and such won't get broken
						background-image : url(http://xhamster.com/)
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
						display         : 'block',
						textDecoration  : 'none',
						color           : '#000000',
						backgroundImage : 'url(http://xhamster.com/)'
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

	it('should extend modifiers\' subclasses with the corresponding styles from the original style tree node', function()
	{
		const style = styler
		`
			original
				display : inline-block

				item
					border : none
					color  : black

					item_link
						text-decoration : none

						:hover
							font-weight: bold

				&active
					item
						color      : white
						background : black

						item_link
							border : 1px
		`

		const object =
		{
			original:
			{
				display: 'inline-block',

				item:
				{
					border : 'none',
					color  : 'black',

					item_link:
					{
						textDecoration : 'none',

						':hover':
						{
							fontWeight: 'bold'
						}
					}
				},

				active:
				{
					display: 'inline-block',

					item:
					{
						border     : 'none',
						color      : 'white',
						background : 'black',

						item_link:
						{
							textDecoration : 'none',
							border         : '1px',

							':hover':
							{
								fontWeight: 'bold'
							}
						}
					}
				}
			}
		}

		style.should.deep.equal(object)
	})

	it('should support comma separated styles', function()
	{

		const style = styler
		`
			can_style, multiple_classes, at_once
				font-family : Sans

				child
					display : none

			can_style
				font-size : 12pt

			multiple_classes, at_once
				font-size : 8pt

				&modifier
					color : red
		`

		const object =
		{
			can_style:
			{
				fontFamily : 'Sans',
				fontSize   : '12pt',

				child:
				{
					display : 'none'
				}
			},

			multiple_classes:
			{
				fontFamily : 'Sans',
				fontSize   : '8pt',

				child:
				{
					display : 'none'
				},

				modifier:
				{
					fontFamily : 'Sans',
					fontSize   : '8pt',
					color      : 'red'
				}
			},

			at_once:
			{
				fontFamily : 'Sans',
				fontSize   : '8pt',

				child:
				{
					display : 'none'
				},

				modifier:
				{
					fontFamily : 'Sans',
					fontSize   : '8pt',
					color      : 'red'
				}
			}
		}

		style.should.deep.equal(object)
	})
})