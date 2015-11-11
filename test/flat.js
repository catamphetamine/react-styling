import flat_styler from '../source/flat'

import chai from 'chai'

chai.should()

describe('flat styler', function()
{
	it('should convert text to JSON object', function()
	{
		const style = flat_styler
		`
			background: red

			menu
				list-style-type: none

				.item
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
			background: 'red',

			menu:
			{
				listStyleType: 'none'
			},

			menu_item:
			{
				display: 'inline-block'
			},

			menu_item_link:
			{
				display        : 'inline-block',
				textDecoration : 'none',
				color          : '#000000',
				paddingLeft    : '0.4em',
				paddingRight   : '0.4em',
				paddingTop     : '0.2em',
				paddingBottom  : '0.2em'
			},

			menu_item_link_current:
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

		style.should.deep.equal(object)
	})
})