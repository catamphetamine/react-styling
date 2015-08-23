import chai from 'chai'
import Tabulator from './../source/tabulator'

chai.should()

function process_style(text)
{
	const lines = text.split('\n')
	const tabulator = new Tabulator(Tabulator.determine_tabulation(lines))
	tabulator.extract_tabulation(lines)
}

describe('tabulator', function()
{
	it('should fail on extra spaces', function()
	{
		const style = 
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

		const test = () => process_style(style)
		test.should.throw('Invalid indentation (extra leading spaces)')
	})

	it('should fail on tabs used when indenting with spaces', function()
	{
		const style = 
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

		const test = () => process_style(style)
		test.should.throw('mixed tabs and spaces')
	})

	it('should fail on spaces used when indenting with tabs', function()
	{
		const style = 
		`
			menu
			 	list-style-type: none
		`

		const test = () => process_style(style)
		test.should.throw('mixed tabs and spaces')
	})

	it('should fail on messed up indentation levels', function()
	{
		const style = 
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

		const test = () => process_style(style)
		test.should.throw('Invalid indentation at line')
	})
})