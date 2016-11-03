// Contributed by @pwlmaciejewski

import chai from 'chai'
import styler from './../source/expanded'
// `react-styling/expanded` export test
// import styler from './../expanded'

chai.should()

describe('shorthand property expansion', function()
{
	it('should expand margin property', function()
	{
		const style = styler
		`
			can_break_apart_margin:
				margin : 1px 2px
		`

		const object = 
		{
			can_break_apart_margin: 
			{
				marginTop    : '1px',
				marginRight  : '2px',
				marginBottom : '1px',
				marginLeft   : '2px'
			}
		}

		style.should.deep.equal(object)
	})

	it('should expand padding property', function()
	{
		const style = styler
		`
			can_break_apart_padding:
				padding : 1px 2px 3px
		`

		const object = 
		{
			can_break_apart_padding: 
			{
				paddingTop    : '1px',
				paddingRight  : '2px',
				paddingBottom : '3px',
				paddingLeft   : '2px'
			}
		}

		style.should.deep.equal(object)
	})

	it('should expand border property', function()
	{
		const style = styler
		`
			can_break_apart_border:
				border : 1px solid black
		`

		const object = 
		{
			can_break_apart_border: 
			{
				borderBottomColor : 'black',
				borderBottomStyle : 'solid',
				borderBottomWidth : '1px',
				borderLeftColor   : 'black',
				borderLeftStyle   : 'solid',
				borderLeftWidth   : '1px',
				borderRightColor  : 'black',
				borderRightStyle  : 'solid',
				borderRightWidth  : '1px',
				borderTopColor    : 'black',
				borderTopStyle    : 'solid',
				borderTopWidth    : '1px'
			}
		}

		style.should.deep.equal(object)
	})
})