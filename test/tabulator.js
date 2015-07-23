import chai from 'chai'
import styler from './../source/index'

chai.should()

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

		const test = () => styler(style)
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

		const test = () => styler(style)
		test.should.throw('mixed tabs and spaces')
	})

	it('should fail on spaces used when indenting with tabs', function()
	{
		const style = 
		`
			menu
			 	list-style-type: none
		`

		const test = () => styler(style)
		test.should.throw('mixed tabs and spaces')
	})

	it('should fail on exccessive tabbing', function()
	{
		const style = 
		`
			menu
					list-style-type: none
		`

		const test = () => styler(style)
		test.should.throw('Excessive indentation')
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

		const test = () => styler(style)
		test.should.throw('Invalid indentation at line')
	})

	it('should fail on blank styles', function()
	{
		const style = 
		`
    

           
      `

		const test = () => styler(style)
		test.should.throw('Not enough lines')
	})

	it('should fail on same indentation of the only two lines', function()
	{
		const style = 
		`
    test 1
    test 2
		`

		const test = () => styler(style)
		test.should.throw('Same indentation')
	})
})